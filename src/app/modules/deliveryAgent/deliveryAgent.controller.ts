import { NextFunction, Request, Response } from "express"
import { successResponse } from "../../utility/successResponse"
import { deliveryAgentServices } from "./deliveryAgent.service"

const createDeliveryAgent = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const newDeliveryAgent = await deliveryAgentServices.createDeliveryAgentService(req.body)
        successResponse(res, {
            status: 201,
            message: "Delivery Agent registered",
            data: newDeliveryAgent
        })
    } catch (error) {
        next(error)
    }
}

export const deliveryAgentController = {
    createDeliveryAgent,
}