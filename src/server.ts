import mongoose from "mongoose"
import { app } from "./app"

const startServer = async()=>{
    await mongoose.connect("")
    app.listen(8000, ()=>{
        console.log("✅ server is running")
    })
}

startServer()