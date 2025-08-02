// import { NextFunction, Request, Response } from "express"
// import { successResponse } from "../../utility/successResponse"
// import { deliveryAgentServices } from "./deliveryAgent.service"

// const createDeliveryAgent = async(req: Request, res: Response, next: NextFunction)=>{
//     try {
//         const newDeliveryAgent = await deliveryAgentServices.createDeliveryAgentService(req.body)
//         successResponse(res, {
//             status: 201,
//             message: "Delivery Agent registered",
//             data: newDeliveryAgent
//         })
//     } catch (error) {
//         next(error)
//     }
// }

// const getAllDeliveryAgent = async(req: Request, res: Response, next: NextFunction)=>{
//     try {
//         const {allDeliveryAgent, total} = await deliveryAgentServices.getAllDeliveryAgentService()
//         successResponse(res, {
//             status: 200,
//             message: "all Delivery Agent",
//             metaData: total,
//             data: allDeliveryAgent
//         })
//     } catch (error) {
//         next(error)
//     }
// }

// const updateAvailableStatus = async(req: Request, res: Response, next: NextFunction)=>{
//     try {
//         const deliveryAgentId = req.params.id
//         const updateDeliveryAgentStatus = await deliveryAgentServices.updateAvailableStatusService(req.body, deliveryAgentId)
//         successResponse(res, {
//             status: 201,
//             message: "update Delivery Agent status",
//             data: updateDeliveryAgentStatus
//         })
//     } catch (error) {
//         next(error)
//     }
// }

// export const deliveryAgentController = {
//     createDeliveryAgent,
//     getAllDeliveryAgent,
//     updateAvailableStatus
// }