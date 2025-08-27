import express, { Request, Response } from "express"
import { routes } from "./app/route"
import cookieParser from 'cookie-parser'
import { globalErrorHandler } from "./app/middleware/globalErrorHandler"
import notFound from "./app/middleware/notFound"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173", "https://parcel-delivery-system-frontend-beige.vercel.app"],
    credentials: true
}))
app.use("/api/v1/", routes)

app.get("/", (req: Request, res: Response)=>{
    res.status(200).json({
        message: "welcome to parcel delivery system backend"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app