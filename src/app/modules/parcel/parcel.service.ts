import { JwtPayload } from "jsonwebtoken"
import { IParcel, ITrackingEvents, Status } from "./parcel.interface"
import { User } from "../user/user.model"
import { Role } from "../user/user.interface"
import { createTrackingId } from "../../utility/createTrackingId"
import { calculateFee } from "../../utility/calculateFee"
import { Parcel } from "./parcel.model"
import { StatusFlow } from "../../utility/statusFlow"
import { DeliveryAgent } from "../deliveryAgent/deliveryAgent.model"
import { AvailableStatus } from "../deliveryAgent/deliveryAgent.interface"

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
    if(parcel?.status !== Status.REQUESTED && parcel?.status !== Status.APPROVED ){
        throw new Error(`Sorry, parcel already on -> ${parcel?.status}`);
    }

    const updatePayload = {...payload}

    if(payload.weight){
        updatePayload.fee = calculateFee(payload.weight)
    }

    const updateParcelInfo = await Parcel.findOneAndUpdate(filter, updatePayload, {new: true})
    return updateParcelInfo
}

const updateParcelStatusService = async(payload: { status: Status, updatedBy: Role }, trackingId: string)=>{

    const parcel = await Parcel.findOne({trackingId: trackingId})

    if(!parcel){
        throw new Error("parcel not found");
    }

    const parcelCurrentStatus = parcel.status as keyof typeof StatusFlow
    const updateRequestRole = payload.updatedBy as Role

    const allowedNextStatus: Status[] = StatusFlow[parcelCurrentStatus].next as Status[]
    const allowedRoles: Role[] = StatusFlow[parcelCurrentStatus].allowedRoles as Role[]

    if(!allowedRoles.includes(updateRequestRole)){
        throw new Error(
      `you are not permitted to select status to ${payload.status}`
    );
    }

    if(payload.updatedBy === Role.SENDER && [Status.BLOCKED, Status.APPROVED, Status.DISPATCHED].includes(payload.status)){
        throw new Error(
      `Sender can not update ${parcelCurrentStatus} to ${payload.status}`
    );
    }

    if(!allowedNextStatus.includes(payload.status)){
        throw new Error(
      `Invalid status transition from ${parcelCurrentStatus} to ${payload.status}`
    );
    }

    if(payload.status === Status.DELIVERED){
        await DeliveryAgent.findOneAndUpdate({currentParcelId: parcel._id},{
            availableStatus: AvailableStatus.AVAILABLE, currentParcelId: null, $inc: { completedDeliveries: 1 }
        })
    }

    const updateStatusLog = {
        ...payload,
        timestamp: new Date().toISOString()
    }

    const updateStatus = await Parcel.findOneAndUpdate({trackingId: trackingId}, {
        $set: {status : payload.status},
        $push: {trackingEvents: updateStatusLog}
    }, {new : true})

    return updateStatus
}

const assignDeliveryAgentService = async(trackingId: string)=>{
    const parcel = await Parcel.findOne({trackingId: trackingId})

    const allAvailableDeliveryAgent = await DeliveryAgent.find({availableStatus: AvailableStatus.AVAILABLE}).select("_id name phone")

    const availableDeliveryAgent = allAvailableDeliveryAgent[0]

    const updateStatusLog = {
        status: Status.DISPATCHED,
        location: parcel?.pickupAddress,
        note: "Parcel picked up from sender",
        timestamp: new Date().toISOString(),
        updatedBy: Role.DELIVERY_AGENT
    }

    const insertDeliveryAgentId = await Parcel.findOneAndUpdate({trackingId: trackingId}, {
        assignedDeliveryAgent: availableDeliveryAgent, status:Status.DISPATCHED, $push: {trackingEvents: updateStatusLog}
    }, {new: true})

    const addParcelId = await DeliveryAgent.findByIdAndUpdate(availableDeliveryAgent._id, {currentParcelId: parcel?._id, availableStatus: AvailableStatus.BUSY, $push: {assignedParcels: parcel?._id}}, {new: true})

    return {insertDeliveryAgentId, addParcelId}
}

const viewAllParcelSenderService = async(userInfo: JwtPayload)=>{
    const allParcel = await Parcel.find({senderId: userInfo.userId})
    const total = allParcel.length
    return {allParcel, total}
}

const viewIncomingParcelReceiverService = async(userInfo: JwtPayload)=>{
    const allIncomingParcel = await Parcel.find({receiverId: userInfo.userId, status: { $nin: [Status.APPROVED, Status.DELIVERED] }})
    const total = allIncomingParcel.length
    return {allIncomingParcel, total}
}

const allDeliveredParcelReceiverService = async(userInfo: JwtPayload)=>{
    const allDeliveredParcel = await Parcel.find({receiverId: userInfo.userId, status: Status.CONFIRMED})
    const total = allDeliveredParcel.length
    return {allDeliveredParcel, total}
}

const allParcelService = async()=>{
    const allParcel = await Parcel.find({})
    const total = allParcel.length
    return {allParcel, total}
}

export const parcelServices = {
    createParcelService,
    updateParcelService,
    updateParcelStatusService,
    assignDeliveryAgentService,
    viewAllParcelSenderService,
    viewIncomingParcelReceiverService,
    allDeliveredParcelReceiverService,
    allParcelService
}