import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";                // ✅ MISSING IMPORT (VERY IMPORTANT)
import { generateToken } from "../lib/util.js";
import cloudinary from "../lib/cloudinary.js";

// SIGNUP
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "Account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log("Signup error:", error);
    res.json({ success: false, message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userData.password
    );

    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken(userData._id);

    res.json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.log("Login error:", error);
    res.json({ success: false, message: error.message });
  }
};

// CHECK AUTH
export const checkAuth = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// UPDATE PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    }

    res.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log("Update profile error:", error);
    res.json({ success: false, message: error.message });
  }
};
