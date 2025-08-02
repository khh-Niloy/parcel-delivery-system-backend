import AppError from "../../errorHelper/AppError"
import { hashedPasswordFunc } from "../../utility/hashedPassword"
import { AvailableStatus, IauthProvider, IUser, Role } from "./user.interface"
import { User } from "./user.model"

const userRegisterService = async(payload: Partial<IUser>)=>{
    const isAlreadyExist = await User.findOne({email: payload.email})
    if(isAlreadyExist){
        throw new AppError(400, "you already registered before");
    }

    payload.password = await hashedPasswordFunc.generateHashedPassword(payload.password as string)

    const auths : IauthProvider = {provider: "credential", providerId: payload.email as string}

    const userCreatePayload = {
        ...payload, auths, ...(payload.role === Role.DELIVERY_AGENT && {
            availableStatus: AvailableStatus.AVAILABLE,
            completedDeliveries : 0
        })
    }

    // if(payload.role === Role.DELIVERY_AGENT){
    //     const deliveryAgentCreatePayload = {
    //         ...userCreatePayload,
    //         availableStatus: AvailableStatus.AVAILABLE,
    //         completedDeliveries : 0
    //     } 
    //     userCreatePayload = deliveryAgentCreatePayload
    // }
    
    const newUser = await User.create(userCreatePayload)
    return newUser
}

const updateUserService = async(payload: Partial<IUser>, userId: string)=>{
    const updateUserInfo = await User.findByIdAndUpdate(userId, payload, {new: true})
    return updateUserInfo
}

const getAllUserService = async()=>{
    const allUser = await User.find({role: { $nin: [Role.DELIVERY_AGENT, Role.SUPER_ADMIN, Role.ADMIN] }})
    const totalUser = allUser.length
    return {allUser, totalUser}
}

const getAllDeliveryAgentService = async()=>{
    const allDeliveryAgent = await User.find({role: Role.DELIVERY_AGENT})
    const total = allDeliveryAgent.length

    return {allDeliveryAgent, total}  
}

const updateAvailableStatusService = async(payload: Partial<IUser>, deliveryAgentId: string)=>{
    if(payload.availableStatus === AvailableStatus.BUSY){
        throw new AppError(400, "you can only make available or offline")
    }
    console.log(deliveryAgentId, payload.availableStatus)

    const deliveryAgent = await User.findById(deliveryAgentId)
    
    if(!deliveryAgent){
        throw new AppError(400, "delivery agent id not matched or does not exist")
    }

    if(deliveryAgent.availableStatus == AvailableStatus.BUSY){
        throw new AppError(400, "first you have to complete ongoing delivery")
    }

    const updateDeliveryAgentStatus = await User.findOneAndUpdate({_id: deliveryAgentId}, {availableStatus: payload.availableStatus}, {new: true})
    return updateDeliveryAgentStatus
}

export const UserServices = {
    userRegisterService,
    updateUserService,
    getAllUserService,
    getAllDeliveryAgentService,
    updateAvailableStatusService
}