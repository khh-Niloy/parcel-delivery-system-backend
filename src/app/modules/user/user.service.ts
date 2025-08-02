import AppError from "../../errorHelper/AppError"
import { hashedPasswordFunc } from "../../utility/hashedPassword"
import { IauthProvider, IUser } from "./user.interface"
import { User } from "./user.model"

const userRegisterService = async(payload: Partial<IUser>)=>{
    const isAlreadyExist = await User.findOne({email: payload.email})
    if(isAlreadyExist){
        throw new AppError(400, "you already registered before");
    }

    payload.password = await hashedPasswordFunc.generateHashedPassword(payload.password as string)

    const auths : IauthProvider = {provider: "credential", providerId: payload.email as string}
    
    const newUser = await User.create({...payload, auths})
    return newUser
}

const updateUserService = async(payload: Partial<IUser>, userId: string)=>{
    const updateUserInfo = await User.findByIdAndUpdate(userId, payload, {new: true})
    return updateUserInfo
}

const getAllUserService = async()=>{
    const allUser = await User.find({})
    const totalUser = await User.estimatedDocumentCount()
    return {allUser, totalUser}
}

export const UserServices = {
    userRegisterService,
    updateUserService,
    getAllUserService
}