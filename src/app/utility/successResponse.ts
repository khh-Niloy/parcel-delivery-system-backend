import { Response } from "express";

interface IData{
    status:number, message: string, data?: any, metaData?: any
}

export const successResponse = (res:Response, data: IData)=>{
    res.status(data.status).json({
        success: true,
        message: data.message,
        meta: data.metaData,
        data: data.data
    })
}