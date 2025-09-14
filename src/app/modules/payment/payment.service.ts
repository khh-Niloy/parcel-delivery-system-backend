import { ITrackingEvents, Status } from "../parcel/parcel.interface"
import { Parcel } from "../parcel/parcel.model"
import { Role } from "../user/user.interface"
import { PAYMENT_STATUS } from "./payment.interface"
import { Payment } from "./payment.model"

const successPaymentService = async(query : Record<string, string>)=>{
    const session = await Payment.startSession()
    session.startTransaction()
    try {
        const paymentRecord = await Payment.findOne({transactionId: query.transactionId})
        const updatedPayment = await Payment.findByIdAndUpdate(paymentRecord?._id, {status: PAYMENT_STATUS.PAID}, {new: true, session})

        if(!updatedPayment){
            throw new Error("Parcel not found")
        }

        const updateParcel = await Parcel.findByIdAndUpdate(paymentRecord?.parcelId, {isPaid: true, status: Status.APPROVED},
            {new: true, session}
        )

        if (!updateParcel) {
            throw new Error("Parcel not found")
        }

        const trackingEvents : ITrackingEvents = {
            status: Status.APPROVED,
            // location: restPayload.pickupAddress as string,
            note: "Parcel payment approved",
            timestamp: new Date().toISOString(),
            updatedBy: Role.SYSTEM
        }
        await Parcel.findOneAndUpdate({trackingId: paymentRecord?.trackingId}, { $push: { trackingEvents: trackingEvents } }, { new: true })

        await session.commitTransaction()
        session.endSession()

        return {success: true, message: "payment success"}
    } catch (error) {
        session.abortTransaction()
        session.endSession()
        throw (error as Error).message
    }
}
// const failPaymentService = async(query : Record<string, string>)=>{
// const session = await Payment.startSession()
//     session.startTransaction()
//     try {
//         const paymentRecord = await Payment.findOne({transactionId: query.transactionId})
//         await Payment.findByIdAndUpdate(paymentRecord?._id, {status: PAYMENT_STATUS.FAILED}, {new: true, session})

//         await Booking.findByIdAndUpdate(paymentRecord?.booking, {status: BOOKING_STATUS.FAILED},
//             {new: true, session}
//         )

//         await session.commitTransaction()
//         session.endSession()

//         return {success: false, message: "payment fail"}
//     } catch (error) {
//         session.abortTransaction()
//         session.endSession()
//         throw (error as Error).message
//     }
// }

// const cancelPaymentService = async(query : Record<string, string>)=>{
// const session = await Payment.startSession()
//     session.startTransaction()
//     try {
//         const paymentRecord = await Payment.findOne({transactionId: query.transactionId})
//         await Payment.findByIdAndUpdate(paymentRecord?._id, {status: PAYMENT_STATUS.CANCELLED}, {new: true, session})

//         await Booking.findByIdAndUpdate(paymentRecord?.booking, {status: BOOKING_STATUS.CANCEL},
//             {new: true, session}
//         )

//         await session.commitTransaction()
//         session.endSession()

//         return {success: false, message: "payment cancel"}
//     } catch (error) {
//         session.abortTransaction()
//         session.endSession()
//         throw (error as Error).message
//     }
// }

// const rePaymentService = async(bookingId: string)=>{

//     const session = await Booking.startSession()
//     session.startTransaction()
//     try {
//         const booking = await Booking.findById(bookingId)
//         const user = await User.findById(booking?.user)
//         const payment = await Payment.findById(booking?.payment)
    
//         const userAddress = user?.address as string
//         const userEmail = user?.email as string
//         const userPhoneNumber = user?.phone as string
//         const userName = user?.name as string
        
//         const sslPayload : ISSLCommerz = {
//             name: userName,
//             email: userEmail,
//             phoneNumber: userPhoneNumber,
//             address: userAddress,
//             amount: payment?.amount as number,
//             transactionId: payment?.transactionId as string
//         }
        
//         const sslPayment = await sslService.sslPaymentInit(sslPayload)

//         await session.commitTransaction()
//         session.endSession()
//         return {
//             paymentUrl: sslPayment.GatewayPageURL,
//         }   

//     } catch (error) {
//         session.abortTransaction()
//         session.endSession()
//         throw (error as Error).message
//     }

    
// }

export const paymentServices = {
    successPaymentService,
    // failPaymentService,
    // cancelPaymentService,
    // rePaymentService,
    
}