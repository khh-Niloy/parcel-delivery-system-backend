import { JwtPayload } from "jsonwebtoken"
import { IParcel, ITrackingEvents, Status } from "./parcel.interface"
import { User } from "../user/user.model"
import { Role } from "../user/user.interface"
import { createTrackingId } from "../../utility/createTrackingId"
import { calculateFee } from "../../utility/calculateFee"
import { Parcel } from "./parcel.model"
import { StatusFlow } from "../../utility/statusFlow"

const createParcelService = async(payload: Partial<IParcel>, userInfo: JwtPayload)=>{

    const {receiverPhoneNumber, ...restPayload} = payload

    const receiverInfo = await User.findOne({phone: receiverPhoneNumber})
    const senderInfo = await User.findById(userInfo.userId)

    if(!senderInfo){
        throw new Error("sender not found");
    }

    if(!receiverInfo){
        throw new Error("receiver not found");
    }

    const fee = calculateFee(payload.weight as number)
    const trackingId = createTrackingId()

    const trackingEvents : ITrackingEvents = {
        status: Status.REQUESTED,
        location: restPayload.pickupAddress as string,
        note: `Parcel request submitted by ${senderInfo?.name}, ${senderInfo?.email}`,
        timestamp: new Date().toISOString(),
        updatedBy: Role.SENDER
    }

    const parcelInfo = {
        ...restPayload,
        senderId: senderInfo?._id,
        receiverId: receiverInfo._id,
        fee,
        status: Status.REQUESTED,
        trackingEvents,
        trackingId,
    }
    console.log(parcelInfo)
    const newParcel = await Parcel.create(parcelInfo)
    return newParcel
}

const updateParcelService = async(payload: Partial<IParcel>, trackingId: string)=>{

    const filter = {trackingId: trackingId}

    const parcel = await Parcel.findOne(filter)
    if(parcel?.status !== Status.REQUESTED){
        throw new Error(`Sorry, parcel already on -> ${parcel?.status}`);
    }

    const updateParcelInfo = await Parcel.findOneAndUpdate(filter, payload, {new: true})
    return updateParcelInfo
}

const updateParcelStatusService = async(payload: { status: Status, updatedBy: Role }, trackingId: string)=>{

    const parcel = await Parcel.findOne({trackingId: trackingId})

    if(!parcel){
        throw new Error("parcel not found");
    }

    const parcelCurrentStatus = parcel.status as Status
    const updateRequestRole = payload.updatedBy as Role

    const allowedNextStatus: Status[] = StatusFlow[parcelCurrentStatus].next as Status[]
    const allowedRoles: Role[] = StatusFlow[parcelCurrentStatus].allowedRoles as Role[]

    if(!allowedRoles.includes(updateRequestRole)){
        throw new Error(
      `you are not permitted to select status to ${payload.status}`
    );
    }

    if(payload.updatedBy === Role.SENDER && payload.status === Status.APPROVED){
        throw new Error(
      `Sender can not update ${parcelCurrentStatus} to ${payload.status}`
    );
    }

    if(!allowedNextStatus.includes(payload.status)){
        throw new Error(
      `Invalid status transition from ${parcelCurrentStatus} to ${payload.status}`
    );
    }

    const updateStatus = await Parcel.findOneAndUpdate({trackingId: trackingId}, {
        $set: {status : payload.status},
        $push: {trackingEvents: payload}
    }, {new : true})

    return updateStatus
}


export const parcelServices = {
    createParcelService,
    updateParcelService,
    updateParcelStatusService,
}