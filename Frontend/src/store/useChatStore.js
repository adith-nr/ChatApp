import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios.js"

import { useAuthStore } from "./useAuthStore.js"

export const useChatStore = create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers:async ()=>{
        set({isUsersLoading:true})
        try {
            const res = await axiosInstance.get("/messages/users")
            set((state)=>({...state,users:res.data}))

        } catch (error) {
            toast.error(error?.response?.data?.message)

        }
        finally{
            set({isUsersLoading:false})
        }
    },
    getMessages: async (userId)=>{
        set({isMessagesLoading:true})
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set((state)=>({...state,messages:res.data}))
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
        finally{
            set({isMessagesLoading:false})
        }
    },
    setSelectedUser: (user) => set((state) => ({
        ...state, 
        selectedUser: user
    })),
    
    sendMessage: async (messageData)=>{
        const {selectedUser,messages} = useChatStore.getState()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
            set((state) => ({ messages: [...state.messages, res.data] }));
            console.log("Messages received:", res.data);

        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    },
    subscribeToMessages:()=>{  //For real time indcoming messages 
        const {selectedUser,messages} = get()
        if(!selectedUser) return
        const socket = useAuthStore.getState().socket
        socket.off("newMessage");
        socket.on("newMessage",(newMessage)=>{
            set((state) => ({ messages: [...state.messages, newMessage] }));
        })
    },
    unsubscribeFromMessages:()=>{
        const socket = useAuthStore().getState().socket
        socket.off("newMessage")
    }
}))