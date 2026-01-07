import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getAllUsersExceptLoggedIn,
  getMessages,
  markMessagesAsSeen,
  sendMessage
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getAllUsersExceptLoggedIn);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessagesAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);


export default messageRouter;
