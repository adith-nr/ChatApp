import bcrypt from "bcrypt"
import User from "../models/user.model.js"
import { genAuthToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req,res)=>{
    const {fullName,email,password}=req.body
    try {
        if(!email || !fullName || !password){
            return res.status(401).json({message:"All Fields are required"})
        }

        if(req.body.password.length<6){
            return res.status(400).send({message:"Password should be of minlenghth of 6"})
        }
        const user = await User.findOne({email:req.body.email})
        if(user){
            return res.status(400).send({message:"Email aldready exists"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password,salt)
        const newUser = await new User({...req.body,password:hashPassword}).save()
        if(newUser){
            genAuthToken(newUser._id,res)
           
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic
            })
        }
        else{
            res.status(400).json({message:"Invalid User Data"})
        }
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
    }
}


export const login = async (req,res)=>{
    const {email,password} = req.body
    try {
        const user = await User.findOne({email:email})
        if(!user){
            return res.status(400).json({message:"User Not Found"})
        }
        const validatePassword = await bcrypt.compare(password,user.password)
        if(!validatePassword){
            return res.status(400).json({message:"Invalid Password"})
        }
        genAuthToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        })
        
    } catch (error) {
        console.log("Error in login controller",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}


export const logout = (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out Successfully"})
    } catch (error) {
        console.log("Error in logout controller",error.message)
    }
}

export const updateProfile=async (req,res)=>{
    try {
        const {profilePic} = req.body
        const userId = req.user._id
        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"})
        }
       const uploadRes = await cloudinary.uploader.upload(profilePic)
       const updateUser = await User.findByIdAndUpdate(userId,{profilePic:uploadRes.secure_url},{new:true})
       res.status(200).json(updateUser)
    } catch (error) {
        console.log("Error in updating profile",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const checkAuth=async (req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth Controller",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}