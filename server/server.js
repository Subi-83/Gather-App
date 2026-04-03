// server.js
import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';

// Create Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server
export const io = new Server(server, {
    cors: { origin: "*" }
});

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// Socket.IO connection setup
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected with ID:", userId);

    if (userId) userSocketMap[userId] = socket.id;

    // Emit online users to all connected clients
    io.emit("online-users", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected with ID:", userId);
        delete userSocketMap[userId];
        io.emit("online-users", Object.keys(userSocketMap));
    });
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

// Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Port
const PORT = process.env.PORT || 5000;

// Start server **only after MongoDB is connected**
const startServer = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI not defined in .env");
        }

        await connectDB(process.env.MONGODB_URI);
        console.log("MongoDB connected, starting server...");

        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error("Server failed to start:", error);
        process.exit(1); // Stop the process if DB connection fails
    }
};

startServer();