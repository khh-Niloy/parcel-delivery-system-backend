import { Request, Response } from "express"
import { envVars } from "../../config/env.config"
import { sslService } from "../sslCommerz/sslCommerz.service"
import { successResponse } from "../../utility/successResponse"
import { paymentServices } from "./payment.service"

const successPayment = async(req: Request, res: Response)=>{
    try {
        const query = req.query
        const updatePaymentStatus = await paymentServices.successPaymentService(query as Record<string, string>)
        if(updatePaymentStatus.success){
            res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=success`)
        }
    } catch (error) {
        res.status(400).json({
            message: (error as Error).message
        })
    }
}

// const failPayment = async(req: Request, res: Response)=>{
//     try {
//         const query = req.query
//         const updatePaymentStatus = await paymentServices.failPaymentService(query as Record<string, string>)
//         if(!updatePaymentStatus.success){
//             res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=fail`)
//         }
//     } catch (error) {
//         res.status(400).json({
//             message: (error as Error).message
//         })
//     }
// }

// const cancelPayment = async(req: Request, res: Response)=>{
//     try {
//         const query = req.query
//         const updatePaymentStatus = await paymentServices.cancelPaymentService(query as Record<string, string>)
//         if(!updatePaymentStatus.success){
//             res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=cancel`)
//         }
//     } catch (error) {
//         res.status(400).json({
//             message: (error as Error).message
//         })
//     }
// }

// const rePayment = async(req: Request, res: Response)=>{
//     const bookingId = req.params.bookingId
//     const newPaymentURL = await paymentServices.rePaymentService(bookingId)

//     successResponse(res, {
//           status: 200,
//           success: true,
//           message: "payment success",
//           data: newPaymentURL.paymentUrl,
//         });
// }

// const validatePayment = async(req: Request, res: Response)=>{
//     console.log("sslcommerz ipn url body", req.body);
//     await sslService.validatePayment(req.body)

//     successResponse(res, {
//             status: 200,
//             success: true,
//             message: "Payment Validated Successfully",
//             data: null,
//         });
// }

export const paymentController = {
    successPayment,
    // failPayment,
    // cancelPayment,
    // rePayment,
    // validatePayment
}