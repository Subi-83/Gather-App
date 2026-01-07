import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

 
// Get all users except the logged-in user
export const getAllUsersExceptLoggedIn = async (req, res) => {

    try{
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");
        // Count number of messages not seen
        const unseenMessageCounts = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({senderId: user._id, resceiverId: userId, seen: false})
            if(messages.length > 0){
                unseenMessageCounts[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success: true, users: filteredUsers, unseenMessageCounts});
    }
    catch(error){
        console.log("Error fetching users:", error.message);
        res.json({success: false, message: "Error fetching users"+error.message});
    }

}


// Get all messages for selected user
export const getMessages = async (req, res) => {
    try{
        const {id: selectedUserId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        })

        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});

        res.json({success: true, messages}); 
    }
    catch(error){
        console.log("Error fetching messages:", error.message);
        res.json({success: false, message: "Error fetching messages"+error.message});
    }
}


//api to mark messages as seen using message id

export const markMessagesAsSeen = async (req, res) => {
  try {
    const senderId = req.params.id;
    const myId = req.user._id;

    await Message.updateMany(
      { senderId, receiverId: myId, seen: false },
      { seen: true }
    );

    res.json({ success: true, message: "Messages marked as seen" });
  } catch (error) {
    console.log("Error marking messages as seen:", error.message);
    res.json({ success: false, message: error.message });
  }
};


// Send message to selected user
export const sendMessage = async (req, res) => {
    try{
        
        const{text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("new-message", newMessage);
        }

        res.json({success: true, message: newMessage});
    }

    catch(error){
        console.log("Error sending message:", error.message);
        res.json({success: false, message: "Error sending message"+error.message});
    }
}

