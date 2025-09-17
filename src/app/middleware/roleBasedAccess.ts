import { NextFunction, Request, Response } from "express"
import { jwtToken } from "../utility/jwtTokens"
import { User } from "../modules/user/user.model"
import { Role } from "../modules/user/user.interface"
import AppError from "../errorHelper/AppError"

export const roleBasedAccess = (...role: string[])=> async(req: Request, res:Response, next: NextFunction)=>{
    try {
        // Support both Authorization header and cookies for authentication
        let accessToken = req.cookies.accessToken
        
        // Check Authorization header if no cookie token
        if (!accessToken && req.headers.authorization) {
            const authHeader = req.headers.authorization
            if (authHeader.startsWith('Bearer ')) {
                accessToken = authHeader.substring(7) // Remove 'Bearer ' prefix
            }
        }

        if (!accessToken) {
            throw new AppError(401, "Access token not found");
        }

        const userInfo = jwtToken.verifyToken(accessToken as string)

        // For system tokens, skip user lookup and role validation
        if (userInfo.email === "system@internal.com" && userInfo.role === "SUPER_ADMIN") {
            req.user = userInfo
            // console.log("userInfo", req.user)
            next()
            return
        }

        const user = await User.findOne({email: userInfo.email})

        if(!user){
            throw new AppError(400, "user does not exist");
        }

        if(!role.includes(user.role)){
            throw new AppError(400, "you are not permitted to visit this route");
        }

        if(user?.isDeleted){
            throw new AppError(400, "you have been deleted!");
        }

        if(user?.isBlocked){
            throw new AppError(400, "you have been blocked!");
        }

        if(![Role.ADMIN, Role.SUPER_ADMIN].includes(user.role) && (
            req?.body?.isDeleted !== undefined ||
            req?.body?.isBlocked !== undefined ||
            req?.body?.role !== undefined
        )){
            throw new AppError(
                400, "You are not permitted to update fields like isDeleted, isBlocked, or role."
            );
        }

        req.user = userInfo
        // console.log("userInfo",req.user)
        next()
    } catch (error) {
        // JWT verification error occurred
        next(error)
    }
}