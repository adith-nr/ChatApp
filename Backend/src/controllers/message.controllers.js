import cloudinary from "../lib/cloudinary.js"
import Message from "../models/message.model.js"
import User from "../models/user.model.js"
import { getReceiverSocketId, io } from "../socket.js"

export const getUsersforSidebar= async (req,res)=>{
    try {
        const loggedInUser = req.user._id
      
        const filteredUsers = await User.find({_id:{$ne:loggedInUser}}).select("-password")
       
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getting Users",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const getMessages = async (req,res)=>{
    try {
        const {id:userToChatId} =req.params
        const senderId = req.user._id
        const messages = await Message.find({$or:[
            {senderId:senderId,receiverId:userToChatId},
            {senderId:userToChatId,receiverId:senderId},
        ]
    })
    res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getting Messages",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const sendMessages = async (req,res)=>{
    try {
        const {text,image} = req.body
        const {id:receiverId} =req.params
        const senderId = req.user._id
        let imageUrl 
        if(image){
            const uploadRes=await cloudinary.uploader.upload(image)
            imageUrl=uploadRes.secure_url
        }
        const newMessage = await new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        }).save()

        //todo:realtime functionality goes here =>socket.io

        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage)


    } catch (error) {
        console.log("Error in sending Messages",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}