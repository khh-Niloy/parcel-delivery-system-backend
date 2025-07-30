import { Request, Response } from "express"
import { UserServices } from "./user.service"
import { successResponse } from "../../utility/successResponse"

const userRegister = async(req: Request, res: Response)=>{
    try {
        const newUser = await UserServices.userRegisterService(req.body)
        successResponse(res, {
            status: 200,
            message: "user registered",
            data: newUser
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message
        })
    }
}

const updateUser = async(req: Request, res: Response)=>{
    try {
        const userId = req.params.id
        const updateUser = await UserServices.updateUserService(req.body, userId)
        successResponse(res, {
            status: 201,
            message: "updated user",
            data: updateUser
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message
        })
    } 
}

const getAllUser = async(req: Request, res: Response)=>{
    try {
        const {allUser, totalUser} = await UserServices.getAllUserService()
        successResponse(res, {
            status: 200,
            message: "all user",
            metaData: {
                total: totalUser
            },
            data: allUser
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message
        })
    }
}

export const userController = {
    userRegister,
    updateUser,
    getAllUser
}