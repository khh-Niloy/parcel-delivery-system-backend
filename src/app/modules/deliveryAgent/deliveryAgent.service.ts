import { hashedPasswordFunc } from "../../utility/hashedPassword";
import { IauthProvider } from "../user/user.interface";
import { IDeliveryAgent } from "./deliveryAgent.interface"
import { DeliveryAgent } from "./deliveryAgent.model";

const createDeliveryAgentService = async(payload: Partial<IDeliveryAgent>)=>{
    const isAlreadyExist = await DeliveryAgent.findOne({email: payload.email})
    if(isAlreadyExist){
        throw new Error("you already registered before");
    }

    payload.password = await hashedPasswordFunc.generateHashedPassword(payload.password as string)

    const auths : IauthProvider = {provider: "credential", providerId: payload.email as string}
    
    const newDeliveryAgent = await DeliveryAgent.create({...payload, auths})
    return newDeliveryAgent    
}


export const deliveryAgentServices = {
    createDeliveryAgentService,
    // updateUserService,
    // getAllUserService
}