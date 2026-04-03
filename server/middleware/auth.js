import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) return res.json({ success: false, message: "User not found" });

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        res.json({ success: false, message: "Not authorized, token failed " + error.message });
    }
};

// Controller to check if user is authenticated
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
};