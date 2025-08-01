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
        const updateParcelStatus = await parcelServices.assignDeliveryAgentService(trackingId)
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

const viewAllParcelSender = async(req: Request, res: Response)=>{
    try {
        const userInfo = req.user
        const {allParcel, total} = await parcelServices.viewAllParcelSenderService(userInfo)
        successResponse(res, {
            status: 200,
            message: "sender all parcel",
            metaData: total,
            data: allParcel
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message
        })
    }
}

const viewIncomingParcelReceiver = async(req: Request, res: Response)=>{
    try {
        const userInfo = req.user
        const {allIncomingParcel, total} = await parcelServices.viewIncomingParcelReceiverService(userInfo)
        successResponse(res, {
            status: 200,
            message: "all incoming parcel",
            metaData: total,
            data: allIncomingParcel
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message
        })
    }
}


const allDeliveredParcelReceiver = async(req: Request, res: Response)=>{
    try {
        const userInfo = req.user
        const {allDeliveredParcel, total} = await parcelServices.allDeliveredParcelReceiverService(userInfo)
        successResponse(res, {
            status: 200,
            message: "all delivered parcel",
            metaData: total,
            data: allDeliveredParcel
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message
        })
    }
}

const allParcel = async(req: Request, res: Response)=>{
    try {
        const {allParcel, total} = await parcelServices.allParcelService()
        successResponse(res, {
            status: 200,
            message: "all parcels",
            metaData: total,
            data: allParcel
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
    assignDeliveryMan,
    viewAllParcelSender,
    viewIncomingParcelReceiver,
    allDeliveredParcelReceiver,
    allParcel
}