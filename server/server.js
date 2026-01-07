import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import {connectDB} from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import {Server} from 'socket.io';

//Create Express app and HTTP server setup
const app = express();
const server = http.createServer(app);

// initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
});

// Store online users
export const userSocketMap = {}; //{userId: socketId}


// Socket.io connection setup
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected with ID:", userId);

    if(userId){
        userSocketMap[userId] = socket.id;
    }

    // Emit online users to all connected clients
    io.emit("online-users", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected with ID:", userId);
        delete userSocketMap[userId];
        io.emit("online-users", Object.keys(userSocketMap));
    });
});


// Middleware setup
app.use(express.json({limit: '4mb'}));
app.use(cors());

// Routes setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to the Mongodb
await connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
