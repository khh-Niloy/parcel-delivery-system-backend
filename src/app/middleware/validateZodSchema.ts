import { NextFunction, Request, Response } from "express"
import { ZodTypeAny } from "zod"

export const validateZodSchema = (zodSchema: ZodTypeAny)=> async(req: Request, res: Response, next: NextFunction)=>{
    const result = zodSchema.safeParse(req.body)
    if(!result.success){
        return res.status(400).json({ errors: result.error.format() });
    }
    req.body = result.data
    next()
}