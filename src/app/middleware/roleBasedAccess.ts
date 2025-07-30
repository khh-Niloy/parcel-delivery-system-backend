import { NextFunction, Request, Response } from "express"
import { jwtToken } from "../utility/jwtTokens"
import { User } from "../modules/user/user.model"
import { Role } from "../modules/user/user.interface"

export const roleBasedAccess = (...role: string[])=> async(req: Request, res:Response, next: NextFunction)=>{
    try {
        const accessToken = req.headers.authorization

        const userInfo = jwtToken.verifyToken(accessToken as string)

        const user = await User.findOne({email: userInfo.email})

        if(!user){
            throw new Error("user does not exist");
        }

        if(!role.includes(user.role)){
            throw new Error("you are not permitted to visit this route");
        }

        if(user.isDeleted){
            throw new Error("you have been deleted!");
        }

        if(user.isBlocked){
            throw new Error("you have been blocked!");
        }

        if(![Role.ADMIN, Role.SUPER_ADMIN].includes(user.role) && (
            req.body.isDeleted !== undefined ||
            req.body.isBlocked !== undefined ||
            req.body.role !== undefined
        )){
            throw new Error(
                "You are not permitted to update fields like isDeleted, isBlocked, or role."
            );
        }

        req.user = userInfo
        next()
    } catch (error) {
        console.log("jwt error", error);
        res.status(400).json({
            message: (error as Error).message
        })
    }
}