# Private Chat Application

This project is a private chat application that allows users to sign up, log in, and engage in private text and video chats. The application uses WebRTC for real-time communication and Socket.IO for signaling.

## Features

- User authentication (signup and login)
- Real-time private text chat
- Real-time video chat using WebRTC
- User presence and online status
- Content Security Policy (CSP) for security

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Socket.IO
- WebRTC
- HTML/CSS/JavaScript

## Prerequisites

- Node.js and npm installed
- MongoDB instance (local or cloud)

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/private-chat-app.git
   cd private-chat-app

Sure, here's a `README.md` file for your project:


# Private Chat Application

This project is a private chat application that allows users to sign up, log in, and engage in private text and video chats. The application uses WebRTC for real-time communication and Socket.IO for signaling.

## Features

- User authentication (signup and login)
- Real-time private text chat
- Real-time video chat using WebRTC
- User presence and online status
- Content Security Policy (CSP) for security

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Socket.IO
- WebRTC
- HTML/CSS/JavaScript

## Prerequisites

- Node.js and npm installed
- MongoDB instance (local or cloud)

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/private-chat-app.git
   cd private-chat-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up MongoDB:**

   Ensure you have a MongoDB instance running. You can use a local instance or a cloud service like MongoDB Atlas. Update the MongoDB connection string in `app.js` if necessary.

4. **Run the server:**

   ```bash
   npm start
   ```

   The server will start on 

http://localhost:5000

.

5. **Access the application:**

   Open your browser and navigate to 

http://localhost:5000

.

## File Structure

- 

app.js

: Main server file
- 

User.js

: Mongoose model for user data
- 

Message.js

: Mongoose model for chat messages
- 

public

: Static files (HTML, CSS, JavaScript)
  - 

index.html

: Main chat interface
  - `login.html`: Login page
  - `signup.html`: Signup page
  - 

conference.html

: Video conference page

## Usage

1. **Sign Up:**

   - Navigate to 

http://localhost:5000/signup.html

.
   - Fill in the required fields and submit the form.

2. **Log In:**

   - Navigate to 

http://localhost:5000/login.html

.
   - Enter your username and password and submit the form.

3. **Chat:**

   - After logging in, you will be redirected to the main chat interface (`index.html`).
   - You can see the list of online users and start a private chat by clicking on a user.
   - Use the text input to send messages and the call button to initiate a video call.

4. **Video Conference:**

   - Navigate to 

http://localhost:5000/conference.html

.
   - Join a room by entering a room ID or using the generated link.

## Security

- The application uses a Content Security Policy (CSP) to enhance security.
- Ensure you run the application over HTTPS in production to secure WebRTC connections.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgements

- [Socket.IO](https://socket.io/)
- [WebRTC](https://webrtc.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)


This `README.md` file provides an overview of the project, setup instructions, usage guidelines, and other relevant information. Make sure to update the repository URL and any other specific details as needed.This `README.md` file provides an overview of the project, setup instructions, usage guidelines, and other relevant information. Make sure to update the repository URL and any other specific details as needed.
