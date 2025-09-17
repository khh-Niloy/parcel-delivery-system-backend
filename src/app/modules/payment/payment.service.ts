import { ITrackingEvents, Status } from "../parcel/parcel.interface"
import { Parcel } from "../parcel/parcel.model"
import { AvailableStatus, Role } from "../user/user.interface"
import { PAYMENT_STATUS } from "./payment.interface"
import { Payment } from "./payment.model"
import { User } from "../user/user.model"
import { getETA, IAllDeliveryAgent } from "../../utility/getETA"

const successPaymentService = async(query : Record<string, string>)=>{
    const session = await Payment.startSession()
    try {
        await session.startTransaction()

        // Payment success service started
        
        const paymentRecord = await Payment.findOne({transactionId: query.transactionId})
        await Payment.findByIdAndUpdate(paymentRecord?._id, {status: PAYMENT_STATUS.PAID}, {new: true, session})
        // console.log("updatedPayment", updatedPayment)

        const trackingEvents : ITrackingEvents = {
            status: Status.APPROVED,
            // location: restPayload.pickupAddress as string,
            note: "Parcel approved by system after payment",
            timestamp: new Date().toISOString(),
            updatedBy: Role.SYSTEM
        }
        const updateParcel = await Parcel.findByIdAndUpdate(paymentRecord?.parcelId, {isPaid: true, status: Status.APPROVED, $push: {trackingEvents: trackingEvents}},
            {new: true, session}
        )
        // console.log("updateParcel", updateParcel)


        // * assign delivery agent


        const allAvailableDeliveryAgent = await User.find({role: Role.DELIVERY_AGENT, availableStatus: AvailableStatus.AVAILABLE}).select("_id name phone currentLocation")

        if(allAvailableDeliveryAgent.length == 0){
            const updateStatusLog = {
                status: Status.PENDING,
                // location: "",
                note: "Could not find any available delivery agent, if someone available will be assigned",
                timestamp: new Date().toISOString(),
                updatedBy: Role.SYSTEM
            }
            await Parcel.findOneAndUpdate({trackingId: updateParcel?.trackingId}, {status: Status.PENDING, $push: {trackingEvents: updateStatusLog}}, {new: true, session})
            await session.commitTransaction();
            return {success: true, message: "payment success, but could not find any delivery agent"}
        }

        const {selectedDeliveryAgent} = await getETA(updateParcel?.pickupAddress.latitude as number, updateParcel?.pickupAddress.longitude as number, allAvailableDeliveryAgent as unknown as IAllDeliveryAgent[])

        const updateStatusLog : ITrackingEvents = {
            status: Status.ASSIGNED,
            // location: {
            //     latitude: lat,
            //     longitude: lng,
            // },
            note: "Parcel assigned to delivery agent",
            timestamp: new Date().toISOString(),
            updatedBy: Role.SYSTEM
        }

        const insertDeliveryAgentInParcel = await Parcel.findOneAndUpdate({trackingId: updateParcel?.trackingId}, {
        assignedDeliveryAgent: selectedDeliveryAgent, status:Status.ASSIGNED, $push: {trackingEvents: updateStatusLog}
        }, {new: true, session})

        // console.log("insertDeliveryAgentInParcel", insertDeliveryAgentInParcel)

        const addParcelIdInDeliveryAgent = await User.findByIdAndUpdate(selectedDeliveryAgent?._id, {currentParcelId: insertDeliveryAgentInParcel?._id, availableStatus: AvailableStatus.BUSY, $push: {assignedParcels: insertDeliveryAgentInParcel?._id}}, {new: true, session})

        // console.log("addParcelIdInDeliveryAgent", addParcelIdInDeliveryAgent)

        await session.commitTransaction()
        return {success: true, message: "payment success", insertDeliveryAgentInParcel, addParcelIdInDeliveryAgent}
    } catch (error) {
        await session.abortTransaction()
        throw (error as Error).message
    } finally {
        session.endSession()
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