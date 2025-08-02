import mongoose from "mongoose"
import { envVars } from "./app/config/env.config"
import { seedSuperAdmin } from "./app/utility/seedSuperAdmin"
import {Server} from "http"
import app from "./app"

let server : Server

const startServer = async()=>{
    await mongoose.connect(envVars.MONGO_URI)
    console.log("✅ mongoose connected")
    server = app.listen(8000, ()=>{
        console.log("✅ server is running")
    })
}

(async()=>{
await startServer()
await seedSuperAdmin()
})()

// https://parcel-delivery-system-backend-one.vercel.app/
// http://localhost:8000

process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejecttion detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})