import { Request, Response } from "express"
import { successResponse } from "../../utility/successResponse"
import { parcelServices } from "./parcel.service"

const createParcel = async(req: Request, res: Response)=>{
    try {
        const userInfo = req.user
        const newParcel = await parcelServices.createParcelService(req.body, userInfo)
        successResponse(res, {
            status: 201,
            message: "new parcel created",
            data: newParcel
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message
        })
    }
}

const updateParcel = async(req: Request, res: Response)=>{
    try {
        const trackingId = req.params.trackingId
        const updateParcel = await parcelServices.updateParcelService(req.body, trackingId)
        successResponse(res, {
            status: 201,
            message: "parcel info updated",
            data: updateParcel
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message
        })
    }
}

const updateParcelStatus = async(req: Request, res: Response)=>{
    try {
        const trackingId = req.params.trackingId
        const updateParcelStatus = await parcelServices.updateParcelStatusService(req.body, trackingId)
        successResponse(res, {
            status: 201,
            message: "parcel status updated",
            data: updateParcelStatus
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message
        })
    }
}

const assignDeliveryMan = async(req: Request, res: Response)=>{
    try {
        const trackingId = req.params.trackingId
        const updateParcelStatus = await parcelServices.assignDeliveryManService(trackingId)
        successResponse(res, {
            status: 201,
            message: "delivery agent assgined and dispatched",
            data: updateParcelStatus
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message
        })
    }
}

export const parcelController = {
    createParcel,
    updateParcel,
    updateParcelStatus,
    assignDeliveryMan
}