import AppError from "../../errorHelper/AppError"
import { hashedPasswordFunc } from "../../utility/hashedPassword"
import { ITrackingEvents, Status } from "../parcel/parcel.interface"
import { Parcel } from "../parcel/parcel.model"
import { AvailableStatus, IauthProvider, IUser, Role } from "./user.interface"
import { User } from "./user.model"

const userRegisterService = async(payload: Partial<IUser>)=>{
    console.log("userRegisterService", payload)
    const isAlreadyExist = await User.findOne({email: payload.email})
    if(isAlreadyExist){
        throw new AppError(400, "you already registered before, so please login");
    }

    payload.password = await hashedPasswordFunc.generateHashedPassword(payload.password as string)
    payload.address = {
        address: payload.address?.address as string
    }

    const auths : IauthProvider = {provider: "credential", providerId: payload.email as string}

    const userCreatePayload = {
        ...payload, auths, ...(payload.role === Role.DELIVERY_AGENT && {
            availableStatus: AvailableStatus.OFFLINE,
            completedDeliveries : 0
        })
    }
    
    const newUser = await User.create(userCreatePayload)
    return newUser
}

const updateUserService = async(payload: Partial<IUser>, userId: string)=>{
    const updateUserInfo = await User.findByIdAndUpdate(userId, payload, {new: true})
    return updateUserInfo
}

const getAllUserService = async()=>{
    const allSender = await User.find({role: Role.SENDER})
    const allDeliveryAgent = await User.find({role: Role.DELIVERY_AGENT})
    const allReceiver = await User.find({role: Role.RECEIVER})
    const totalUser = allSender.length + allDeliveryAgent.length + allReceiver.length

    const allUser = [...allSender, ...allDeliveryAgent, ...allReceiver]

    return {allUser, totalUser}
}

const getAllDeliveryAgentService = async()=>{
    const allDeliveryAgent = await User.find({role: Role.DELIVERY_AGENT})
    const total = allDeliveryAgent.length

    return {allDeliveryAgent, total}  
}

const updateAvailableStatusService = async(payload: {availableStatus: AvailableStatus, lat: number, lng: number}, deliveryAgentId: string)=>{
    if(payload.availableStatus === AvailableStatus.BUSY){
        throw new AppError(400, "you can only make available or offline")
    }
    console.log("updateAvailableStatusService", payload)
    // console.log(deliveryAgentId, payload.availableStatus)

    const deliveryAgent = await User.findById(deliveryAgentId)
    
    if(!deliveryAgent){
        throw new AppError(400, "delivery agent id not matched or does not exist")
    }

    if(deliveryAgent.availableStatus == AvailableStatus.BUSY){
        throw new AppError(400, "first you have to complete ongoing delivery")
    }

    let nextStatus : AvailableStatus
    nextStatus = payload.availableStatus

    if(payload.availableStatus == AvailableStatus.AVAILABLE){

        nextStatus = AvailableStatus.BUSY

        const allPendingParcels = await Parcel.find({ status: Status.PENDING }).sort({ createdAt: 1 });

        if(allPendingParcels.length > 0){
        const parcel = allPendingParcels.shift()

        const updateStatusLog : ITrackingEvents = {
            status: Status.ASSIGNED,
            location: {latitude: payload.lat, longitude: payload.lng},
            note: "pending parcel assigned to delivery agent",
            timestamp: new Date().toISOString(),
            updatedBy: Role.DELIVERY_AGENT
        }

        const availableDeliveryAgent = await User.findById(deliveryAgentId).select("_id name phone")

        await Parcel.findOneAndUpdate({_id: parcel?._id}, {
        assignedDeliveryAgent: availableDeliveryAgent, status:Status.ASSIGNED, $push: {trackingEvents: updateStatusLog}
        }, {new: true})

        await User.findByIdAndUpdate(deliveryAgentId, {currentParcelId: parcel?._id, availableStatus: AvailableStatus.BUSY, $push: {assignedParcels: parcel?._id}}, {new: true})
        }
        
    }

    const updateDeliveryAgentStatus = await User.findOneAndUpdate({_id: deliveryAgentId}, {availableStatus: nextStatus}, {new: true})
    return updateDeliveryAgentStatus
}

const getMeService = async(userId: string)=>{
    console.log(userId)
    const me = await User.findById(userId)
    if(!me){
        throw new AppError(400, "user not found")
    }
    return me
}

export const UserServices = {
    userRegisterService,
    updateUserService,
    getAllUserService,
    getAllDeliveryAgentService,
    updateAvailableStatusService,
    getMeService
}