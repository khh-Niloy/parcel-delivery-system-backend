import { Response } from "express"

const setCookies = (res:Response, accessToken: string, refreshToken: string)=>{
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
      secure: true,
      sameSite: "none"
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
}

const clearCookies = (res:Response)=>{
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
}

export const cookiesManagement = {
    setCookies,
    clearCookies
}