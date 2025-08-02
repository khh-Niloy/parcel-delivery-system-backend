import { NextFunction, Request, Response } from "express"
import { UserServices } from "./user.service"
import { successResponse } from "../../utility/successResponse"

const userRegister = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const newUser = await UserServices.userRegisterService(req.body)
        successResponse(res, {
            status: 200,
            message: "user registered",
            data: newUser
        })
    } catch (error) {
        next(error)
    }
}

const updateUser = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const userId = req.params.id
        const updateUser = await UserServices.updateUserService(req.body, userId)
        successResponse(res, {
            status: 201,
            message: "updated user",
            data: updateUser
        })
    } catch (error) {
        next(error)
    } 
}

const getAllUser = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {allUser, totalUser} = await UserServices.getAllUserService()
        successResponse(res, {
            status: 200,
            message: "all user",
            metaData: totalUser,
            data: allUser
        })
    } catch (error) {
        next(error)
    }
}

const getAllDeliveryAgent = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {allDeliveryAgent, total} = await UserServices.getAllDeliveryAgentService()
        successResponse(res, {
            status: 200,
            message: "all Delivery Agent",
            metaData: total,
            data: allDeliveryAgent
        })
    } catch (error) {
        next(error)
    }
}

const updateAvailableStatus = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const deliveryAgentId = req.params.id
        const updateDeliveryAgentStatus = await UserServices.updateAvailableStatusService(req.body, deliveryAgentId)
        successResponse(res, {
            status: 201,
            message: "update Delivery Agent status",
            data: updateDeliveryAgentStatus
        })
    } catch (error) {
        next(error)
    }
}

export const userController = {
    userRegister,
    updateUser,
    getAllUser,
    getAllDeliveryAgent,
    updateAvailableStatus
}