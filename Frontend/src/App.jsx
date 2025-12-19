import { useState } from 'react'
 import {createBrowserRouter,RouterProvider,Navigate,Routes,Route,BrowserRouter} from "react-router-dom"
import Navbar from './comp/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import { useAuthStore } from './store/useAuthStore.js'
import { useEffect } from 'react'
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast'




function App() {

  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore()

 
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  console.log({authUser})
  
  if(isCheckingAuth && !authUser){
    return (
      <div className='flex justify-center h-screen items-center'>
      <Loader className='size-10 animate-spin'/>
      </div>
    )
  }

  return (
    <div>


<BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser? <HomePage/> : <Navigate to ="/login"/>} />
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to ="/"/>} />
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to ="/"/>} />
        <Route path="/profile" element={authUser? <ProfilePage/> : <Navigate to ="/login"/>} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
    <Toaster/>
    </div>
  )
}

export default App
