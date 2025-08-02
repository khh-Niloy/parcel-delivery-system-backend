import express, { Request, Response } from "express"
import { routes } from "./app/route"
import cookieParser from 'cookie-parser'
import { globalErrorHandler } from "./app/middleware/globalErrorHandler"
import notFound from "./app/middleware/notFound"

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/", routes)

app.get("/", (req: Request, res: Response)=>{
    res.status(200).json({
        message: "welcome to parcel delivery system backend"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app