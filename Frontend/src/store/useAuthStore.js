import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"
import { io } from "socket.io-client"
export const useAuthStore = create((set,get)=>({
    authUser:null,
    
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    onlineUsers:[],
    isCheckingAuth:true,

    socket: null,

    checkAuth:async ()=>{
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser:res.data})
            get().connectSocket()
        } catch (error) {
            console.log("Error in auth",error)
            set({authUser:null})
        }
        finally{
            set({isCheckingAuth:false})
        }
    },
    signup:async(data)=>{
        set({isSigningUp:true})
        try {
           const res = await axiosInstance.post("/auth/signup",data)
           set({authUser:res.data})
           toast.success("Account created Successfully")
           get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally{
            set({isSigningUp:false})
        }
    },
    logout:async ()=>{
        try {
            await axiosInstance.get("/auth/logout")
            set({authUser:null})
            toast.success("Logged out successfully")
            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    login:async (data)=>{
        set({isLoggingIn:true})
        try {
            const res = await axiosInstance.post("/auth/login",data)
            set({authUser:res.data})
            toast.success("Logged in Successfully")
            get().connectSocket()
        } catch (error) {
            toast.error()
        }
        finally{
            set({isLoggingIn:false})
        }
    },
    updateProfile: async (data)=>{
        set({isUpdatingProfile:true})
        try {
            const res = await axiosInstance.put("/auth/update-profile",data)
            set({authUser:res.data})
            toast.success("Updated Profile Pic Successfully")
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
        finally{
            set({isUpdatingProfile:false})
        }
    },
    connectSocket:()=>{
        const {authUser,socket,onlineUsers} = get()
        if (!authUser || socket) return
        const Newsocket = io("http://localhost:4000",{
            query:{
                userId:authUser._id
            }
        })
        Newsocket.connect()
        set({socket:Newsocket})

        Newsocket.on("getOnlineUsers",(userIds)=>{
           
            set({onlineUsers:userIds})
            console.log({onlineUsers})
        })
    },
    disconnectSocket:()=>{
        const {socket} = get()
        if(socket?.connected){
            socket.disconnect()
        }
    }
}))




//WebSockets are a communication protocol that provides full-duplex, bidirectional communication between a client (browser) and a server over a single, long-lived connection.

// Unlike traditional HTTP requests, where the client must repeatedly send requests to get updates (polling), WebSockets keep a persistent connection open. This makes them faster and more efficient for real-time applications like: