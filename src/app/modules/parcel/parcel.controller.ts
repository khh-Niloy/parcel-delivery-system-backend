import { NextFunction, Request, Response } from "express"
import { successResponse } from "../../utility/successResponse"
import { parcelServices } from "./parcel.service"

const createParcel = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const userInfo = req.user
        const newParcel = await parcelServices.createParcelService(req.body, userInfo)
        successResponse(res, {
            status: 201,
            message: "new parcel created",
            data: newParcel
        })
    } catch (error) {
        next(error)
    }
}

const updateParcel = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const trackingId = req.params.trackingId
        const updateParcel = await parcelServices.updateParcelService(req.body, trackingId)
        successResponse(res, {
            status: 201,
            message: "parcel info updated",
            data: updateParcel
        })
    } catch (error) {
        next(error)
    }
}

const updateParcelStatus = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const trackingId = req.params.trackingId
        const userInfo = req.user
        const lat = parseFloat(req.query.lat as string)
        const lng = parseFloat(req.query.lng as string)
        const updateParcelStatus = await parcelServices.updateParcelStatusService(req.body, trackingId, userInfo, lat, lng)
        successResponse(res, {
            status: 201,
            message: "parcel status updated",
            data: updateParcelStatus
        })
    } catch (error) {
        next(error)
    }
}

const assignDeliveryMan = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const trackingId = req.params.trackingId
        const lat = parseFloat(req.query.lat as string)
        const lng = parseFloat(req.query.lng as string)
        const assignResult = await parcelServices.assignDeliveryAgentService(trackingId, lat, lng)
        
        if (!assignResult) {
            successResponse(res, {
                status: 200,
                message: "Could not find any available delivery agent, if someone available will be assigned",
                data: null
            })
            return
        }

        successResponse(res, {
            status: 201,
            message: "delivery agent assgined",
            data: assignResult
        })
    } catch (error) {
        next(error)
    }
}

const viewAllParcelSender = async(req: Request, res: Response, next: NextFunction)=>{
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
        next(error)
    }
}

const viewIncomingParcelReceiver = async(req: Request, res: Response, next: NextFunction)=>{
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
        next(error)
    }
}

const allDeliveredParcelReceiver = async(req: Request, res: Response, next: NextFunction)=>{
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
        next(error)
    }
}

const allParcel = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {allParcel, total} = await parcelServices.allParcelService(req.query)
        successResponse(res, {
            status: 200,
            message: "all parcels",
            metaData: total,
            data: allParcel
        })
    } catch (error) {
        next(error)
    }
}

const singleParcel = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const trackingId = req.params.trackingId
        const singleParcel = await parcelServices.singleParcelService(trackingId)
        successResponse(res, {
            status: 200,
            message: "single parcel",
            data: singleParcel
        })
    } catch (error) {
        next(error)
    }
}

const makePayment = async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const trackingId = req.params.trackingId
        console.log(trackingId)
        const makePayment = await parcelServices.makePaymentService(trackingId)
        successResponse(res, {
            status: 200,
            message: "make payment",
            data: makePayment
        })
    } catch (error) {
        next(error)
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
    allParcel,
    singleParcel,
    makePayment

}