import express from "express"
import cors from "cors"
import coookieParser from "cookie-parser"

import dotenv from "dotenv"
dotenv.config()
import authRoutes from "./routes/auth.route.js"
import ConnectDB from "./lib/db.js"
import messageRoutes from "./routes/message.route.js"
import { app,server } from "./socket.js"
const PORT = process.env.PORT
app.use(coookieParser())
app.use(express.json())
app.use(cors({origin: "http://localhost:5173",credentials: true  }))


app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

server.listen(PORT,()=>{
    console.log("Server running on",PORT)
    ConnectDB()
})