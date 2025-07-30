import { Response } from "express"
import { envVars } from "../config/env.config"

const setCookies = (res:Response, accessToken: string, refreshToken: string)=>{
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: envVars.NODE_ENV == "production",
        sameSite: "none"
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: envVars.NODE_ENV == "production",
        sameSite: "none"
    })
}

const clearCookies = (res:Response)=>{
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: envVars.NODE_ENV == "production",
        sameSite: "none"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: envVars.NODE_ENV == "production",
        sameSite: "none"
    })
}

export const cookiesManagement = {
    setCookies,
    clearCookies
}