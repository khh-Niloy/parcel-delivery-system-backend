import { Request, Response } from "express"
import { successResponse } from "../../utility/successResponse"
import { deliveryAgentServices } from "./deliveryAgent.service"

const createDeliveryAgent = async(req: Request, res: Response)=>{
    try {
        const newDeliveryAgent = await deliveryAgentServices.createDeliveryAgentService(req.body)
        successResponse(res, {
            status: 201,
            message: "Delivery Agent registered",
            data: newDeliveryAgent
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message
        })
    }
}

// const updateDeliveryAgent = async(req: Request, res: Response)=>{
//     try {
//         const userId = req.params.id
//         const updateUser = await UserServices.updateUserService(req.body, userId)
//         successResponse(res, {
//             status: 201,
//             message: "updated user",
//             data: updateUser
//         })
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: (error as Error).message
//         })
//     } 
// }

// const updateStatusDeliveryAgent = async(req: Request, res: Response)=>{
//     try {
//         const userId = req.params.id
//         const updateUser = await UserServices.updateUserService(req.body, userId)
//         successResponse(res, {
//             status: 201,
//             message: "updated user",
//             data: updateUser
//         })
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: (error as Error).message
//         })
//     } 
// }

// const getAllDeliveryAgent = async(req: Request, res: Response)=>{
//     try {
//         const {allUser, totalUser} = await UserServices.getAllUserService()
//         successResponse(res, {
//             status: 200,
//             message: "all user",
//             metaData: {
//                 total: totalUser
//             },
//             data: allUser
//         })
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: (error as Error).message
//         })
//     }
// }

export const deliveryAgentController = {
    createDeliveryAgent,
    // updateDeliveryAgent,
    // updateStatusDeliveryAgent,
    // getAllDeliveryAgent
}