import mongoose from "mongoose";

// Function to connect to MongoDB
export const connectDB = async (mongoURI) => {
    try { 
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }       
};