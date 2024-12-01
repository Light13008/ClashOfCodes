const socket = io();

const roomInput = document.getElementById('room');
const joinRoomButton = document.getElementById('join-room');
const messageInput = document.getElementById('message');
const sendMessageButton = document.getElementById('send-message');
const messagesContainer = document.getElementById('messages');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startCallButton = document.getElementById('startCall');
const endCallButton = document.getElementById('endCall');

// Canvas variables
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

let drawing = false;
let current = { x: 0, y: 0 };

let localStream;
let peerConnections = {};
let currentRoom = '';
let targetSocketId = '';

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' } // STUN server
    ]
};

// Creating peer connections using rooms 
async function createPeerConnection(room) {
    const peerConnection = new RTCPeerConnection(configuration);

    // Add local stream tracks
    if (localStream) {
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
    }

    // Handle remote tracks
    peerConnection.ontrack = (event) => {
        const remoteVideo = document.getElementById('remoteVideo');
        if (event.streams && event.streams[0]) {
            remoteVideo.srcObject = event.streams[0];
        }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('iceCandidate', { 
                candidate: event.candidate, 
                room: room 
            });
        }
    };

    return peerConnection;
}

async function getLocalStream() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
        });
        
        const localVideo = document.getElementById('localVideo');
        localVideo.srcObject = localStream;
        
        return localStream;
    } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Could not access camera and microphone');
    }
}

// Join room event
joinRoomButton.addEventListener('click', () => {
    const room = roomInput.value;
    if (room) {
        currentRoom = room;
        socket.emit('joinRoom', room);
        roomInput.value = '';
    }
});

// Send message event
sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message && currentRoom) {
        socket.emit('chatMessage', { room: currentRoom, message });
        messageInput.value = '';
    }
});

// Listen for messages from the server
socket.on('message', (msg) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = msg.message;
    messagesContainer.appendChild(messageElement);
});

// Start call
async function startCall() {
    await getLocalStream();
    const peerConnection = await createPeerConnection(currentRoom);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('webrtcOffer', { 
        offer: offer, 
        room: currentRoom 
    });
    peerConnections[currentRoom] = peerConnection;
}

// Handle incoming offer
socket.on('webrtcOffer', async (data) => {
    await getLocalStream();
    const peerConnection = await createPeerConnection(data.room);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('webrtcAnswer', { 
        answer: answer, 
        room: data.room 
    });
    peerConnections[data.room] = peerConnection;
});

// Handle incoming answer
socket.on('webrtcAnswer', async (data) => {
    const peerConnection = peerConnections[data.room];
    if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    }
});

// Handle ICE candidates
socket.on('iceCandidate', async (data) => {
    const peerConnection = peerConnections[data.room];
    if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
});

// Event listeners
startCallButton.addEventListener('click', startCall);

// End call functionality
endCallButton.addEventListener('click', () => {
    Object.values(peerConnections).forEach(pc => pc.close());
    peerConnections = {};
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localVideo.srcObject = null;
    }
    remoteVideo.srcObject = null;
});

// Canvas logic
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    current.x = e.clientX - canvas.offsetLeft;
    current.y = e.clientY - canvas.offsetTop;
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    drawLine(current.x, current.y, x, y);
    current.x = x;
    current.y = y;

    // Emit drawing event to other users
    socket.emit('drawing', { x: current.x, y: current.y, room: currentRoom });
});

// Draw line function
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Listen for drawing events from other users
socket.on('drawing', (data) => {
    drawLine(current.x, current.y, data.x, data.y);
    current.x = data.x;
    current.y = data.y;
});

// Clear canvas functionality
document.getElementById('clearCanvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clearCanvas', { room: currentRoom });
});

// Listen for clear canvas event from other users
socket.on('clearCanvas', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});