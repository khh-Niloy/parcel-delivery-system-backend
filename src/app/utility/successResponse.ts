import { Response } from "express";

interface TResponse<T> {
    status?: number;
    success?: boolean;
    message?: string;
    data?: T;
    metaData?: number
}

export const successResponse = <T>(res: Response, data: TResponse<T>) => {
    res.status(data.status as number).json({
        success: data.success,
        message: data.message,
        metaData: data.metaData,
        data: data.data
    })
}
