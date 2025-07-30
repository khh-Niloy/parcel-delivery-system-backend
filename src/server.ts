import mongoose from "mongoose"
import { app } from "./app"
import { envVars } from "./app/config/env.config"
import { seedSuperAdmin } from "./app/utility/seedSuperAdmin"

const startServer = async()=>{
    await mongoose.connect(envVars.MONGO_URI)
    console.log("✅ mongoose connected")
    app.listen(8000, ()=>{
        console.log("✅ server is running")
    })
}

(async()=>{
await startServer()
await seedSuperAdmin()
})()