import { Request, Response } from 'express';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
import cloudinary from '../socket/cloudinary.js';

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const loggedInUserId = req.user?._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error: any) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMessages(req: Request, res: Response): Promise<void> {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user?._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error: any) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function sendMessages(req: Request, res: Response): Promise<void> {
  try {
    const senderId = req.user?._id
    const { receiverId } = req.params
    const { text, image } = req.body

    let newMessage;
    let secure_url;

    console.log(image);
    console.log(text);

    if (image) {
      secure_url = await (cloudinary as any).uploader.upload(image).secure_url
    }
    
    if (image && text) {
      newMessage = await Message.create({ senderId, receiverId, text, image: secure_url })
    } else if (text) {
      newMessage = await Message.create({ senderId, receiverId, text })
    } else if (image) {
      newMessage = await Message.create({ senderId, receiverId, image: secure_url })
    } else {
      res.status(400).json({ message: "Provide a text or image" })
      return;
    }
    
    console.log(newMessage);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error: any) {
    console.error('Error in send messages controller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


