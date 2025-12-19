import mongoose from "mongoose"
async function ConnectDB(){
    try {
       await mongoose.connect(process.env.MONGODB_URI)
       console.log("Connected to DB")
    } catch (error) {
        console.log("Not Connected to DB",error)
    }
}
export default ConnectDB