import AppError from "../../errorHelper/AppError";
import { hashedPasswordFunc } from "../../utility/hashedPassword";
import { IauthProvider } from "../user/user.interface";
import { AvailableStatus, IDeliveryAgent } from "./deliveryAgent.interface"
import { DeliveryAgent } from "./deliveryAgent.model";

const createDeliveryAgentService = async(payload: Partial<IDeliveryAgent>)=>{
    const isAlreadyExist = await DeliveryAgent.findOne({email: payload.email})
    if(isAlreadyExist){
        throw new AppError(400, "you already registered before");
    }

    payload.password = await hashedPasswordFunc.generateHashedPassword(payload.password as string)

    const auths : IauthProvider = {provider: "credential", providerId: payload.email as string}
    
    const newDeliveryAgent = await DeliveryAgent.create({...payload, auths})
    return newDeliveryAgent    
}

const getAllDeliveryAgentService = async()=>{
    const allDeliveryAgent = await DeliveryAgent.find({})
    const total = allDeliveryAgent.length

    return {allDeliveryAgent, total}  
}

const updateAvailableStatusService = async(status: Partial<IDeliveryAgent>, deliveryAgentId: string)=>{
    if(status.availableStatus === AvailableStatus.BUSY){
        throw new AppError(400, "you can only make available or offline")
    }

    const deliveryAgent = await DeliveryAgent.findById(deliveryAgentId)
    
    if(!deliveryAgent){
        throw new AppError(400, "delivery agent id not matched or does not exist")
    }

    if(deliveryAgent.availableStatus == AvailableStatus.BUSY){
        throw new AppError(400, "first you have to complete ongoing delivery")
    }

    const updateDeliveryAgentStatus = await DeliveryAgent.findByIdAndUpdate(deliveryAgentId, {availableStatus: status}, {new: true})
    return updateDeliveryAgentStatus
}


export const deliveryAgentServices = {
    createDeliveryAgentService,
    getAllDeliveryAgentService,
    updateAvailableStatusService
}