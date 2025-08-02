import { JwtPayload } from "jsonwebtoken"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import { cookiesManagement } from "../../utility/cookiesManagement"
import { hashedPasswordFunc } from "../../utility/hashedPassword"
import { jwtToken } from "../../utility/jwtTokens"
import { Response } from "express"
import AppError from "../../errorHelper/AppError"

const userLoginService = async(payload: Partial<IUser>)=>{
    const {email, password} = payload

    console.log(payload)

    const user = await User.findOne({email})

    if(!user){
        throw new AppError(400, "Please register first");
    }

    const isPasswordOK = await hashedPasswordFunc.checkHashedPassword(password as string, user.password as string)

    if(!isPasswordOK){
        throw new AppError(400, "password not matched!");
    }

    const jwtPayload = {
        role: user.role,
        email: user.email,
        userId: user._id
    }

    const accessRefreshToken = jwtToken.generateAccessRefreshToken(jwtPayload as JwtPayload)  
    return {user, accessRefreshToken}
}

const userLogOutService = (res: Response)=>{
    cookiesManagement.clearCookies(res)
}

const getNewAccessTokenService = async(refreshToken: string)=>{
    const userInfo = jwtToken.verifyToken(refreshToken)

    const user = await User.findOne({email: userInfo.email})

    if(!user){
        throw new AppError(400, "user not found");
    }

    if(user.isBlocked){
        throw new AppError(400, "user is blocked");
    }

    if(user.isDeleted){
        throw new AppError(400, "user is deleted");
    }

    const jwtPayload = {
        role: user.role,
        email: user.email,
        userId: user._id
    }

    const newTokens = jwtToken.generateAccessRefreshToken(jwtPayload)
    return newTokens
}

const changePasswordService = async(payload: { password: string }, user: JwtPayload)=>{
    const userInfo = await User.findOne({email: user.email})

    if(!userInfo){
        throw new AppError(400, "user not found");
    }

    const newHashedPassword = await hashedPasswordFunc.generateHashedPassword(payload.password)
    await User.findByIdAndUpdate(userInfo._id, {password: newHashedPassword})
}


export const authServices = {
    userLoginService,
    userLogOutService,
    getNewAccessTokenService,
    changePasswordService
}