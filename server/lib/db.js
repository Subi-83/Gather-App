import mongoose from "mongoose";

export const connectDB = async (mongoURI) => {
    try {
        mongoose.set("strictQuery", true);

        await mongoose.connect(mongoURI);

        console.log("MongoDB connected successfully");

        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected!");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });

    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
};