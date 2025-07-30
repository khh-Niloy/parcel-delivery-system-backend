import { Request, Response } from "express"
import { authServices } from "./auth.service"
import { cookiesManagement } from "../../utility/cookiesManagement"
import { successResponse } from "../../utility/successResponse"

const userLogin = async(req: Request, res: Response)=>{
    try {
        const userLogin = await authServices.userLoginService(req.body)
        const {accessRefreshToken, user} = userLogin

        cookiesManagement.setCookies(res, accessRefreshToken.accessToken, accessRefreshToken.refreshToken)

        successResponse(res, {
            status: 200,
            message: "user logged in",
            data: {accessRefreshToken, user},
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message
        })
    }
}

const userLogOut = async(req: Request, res: Response)=>{
    try {
        authServices.userLogOutService(res)
        successResponse(res, {
            status: 200,
            message: "user logged out",
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message
        })
    }
}

const getNewAccessToken = async(req: Request, res: Response)=>{
    try {
        const refreshToken = req.cookies.refreshToken
        console.log(refreshToken)

        if(!refreshToken){
            throw new Error("refresh token not found from cookies");
        }

        const tokens = await authServices.getNewAccessTokenService(refreshToken)

        cookiesManagement.setCookies(res, tokens.accessToken, tokens.refreshToken)

        successResponse(res, {
            status: 201,
            message: "new access and refresh token added",
            data: tokens
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message
        })
    }
}

const changePassword = async(req: Request, res: Response)=>{
    try {
        const user = req.user
        await authServices.changePasswordService(req.body, user)
        successResponse(res, {
            status: 201,
            message: "password changed",
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message
        })
    }
}


export const authController = {
    userLogin,
    userLogOut,
    getNewAccessToken,
    changePassword
}