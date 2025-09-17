import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import { envVars } from "../config/env.config"

const generateAccessRefreshToken = (payload: JwtPayload)=>{
    const accessToken = jwt.sign(payload, envVars.JWT_ACCESS_SECRET, {expiresIn: envVars.JWT_ACCESS_EXPIRES} as SignOptions)

    const refreshToken = jwt.sign(payload, envVars.JWT_REFRESH_SECRET, {expiresIn: envVars.JWT_REFRESH_EXPIRES} as SignOptions)

    return {accessToken, refreshToken}
}

const verifyToken = (token: string)=>{
    const userInfo = jwt.verify(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    return userInfo
}

const generateSystemToken = ()=>{
    const systemPayload = {
        role: "SUPER_ADMIN",
        email: "system@internal.com",
        userId: "system"
    }
    
    const systemToken = jwt.sign(systemPayload, envVars.JWT_ACCESS_SECRET, {expiresIn: "1h"})
    return systemToken
}

export const jwtToken = {
    generateAccessRefreshToken,
    verifyToken,
    generateSystemToken
}