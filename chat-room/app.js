const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Message = require('./models/Message'); // Import Message model

const app = express();
const server = http.createServer(app);
const io = new Server(server);

mongoose.connect('mongodb+srv://sarupatil0001:dog21@cluster0.dwnvs.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());
app.use(express.static('public'));

// API Endpoints
app.post('/api/login', async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Handle user signup
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Socket.IO Logic
const onlineUsers = new Map();
const privateRooms = {};

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining
    socket.on('user_join', (username) => {
        onlineUsers.set(socket.id, username);
        io.emit('update_user_list', Array.from(onlineUsers.entries()));
    });

    // Handle private chat initiation
    socket.on('start_private_chat', async ({ fromUser, toUser }) => {
        const pairKey = [fromUser, toUser].sort().join('_');
        let roomID = privateRooms[pairKey];

        if (!roomID) {
            roomID = `room_${Date.now()}`;
            privateRooms[pairKey] = roomID;
        }

        socket.join(roomID);

        // Fetch chat history from the database
        const messages = await Message.find({ roomID }).sort({ timestamp: 1 });
        socket.emit('joined_private_chat', { roomID, messages });
    });

    // Handle sending private messages
    socket.on('private_message', async ({ roomID, message, sender, receiver }) => {
        // Save the message to the database
        const newMessage = new Message({ roomID, sender, receiver, message });
        await newMessage.save();

        // Emit the message to the room
        io.to(roomID).emit('receive_message', { message, sender });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        const username = onlineUsers.get(socket.id);
        onlineUsers.delete(socket.id);
        io.emit('update_user_list', Array.from(onlineUsers.entries()));
        console.log(`${username} disconnected`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
