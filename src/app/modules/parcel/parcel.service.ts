import { JwtPayload } from "jsonwebtoken"
import { Iaddress, IParcel, ITrackingEvents, Status } from "./parcel.interface"
import { User } from "../user/user.model"
import { Role } from "../user/user.interface"
import { createTrackingId } from "../../utility/createTrackingId"
import { calculateFee } from "../../utility/calculateFee"
import { Parcel } from "./parcel.model"
import AppError from "../../errorHelper/AppError"
import { StatusFlow } from "../../utility/statusFlow"
import { DeliveredStatusHandler } from "../../utility/DeliveredStatusHandler"
import { PAYMENT_STATUS } from "../payment/payment.interface"
import { getTransactionId } from "../../utility/getTransactionId"
import { Payment } from "../payment/payment.model"
import { sslService } from "../sslCommerz/sslCommerz.service"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface"


const createParcelService = async(payload: Partial<IParcel>, userInfo: JwtPayload)=>{

    // Processing parcel creation payload

    const session = await Parcel.startSession()
    session.startTransaction()

    try {
    
    const {receiverPhoneNumber, ...restPayload} = payload

    const receiverExist = await User.findOne({phone: receiverPhoneNumber})
    const senderInfo = await User.findById(userInfo.userId)

    if(!senderInfo){
        throw new AppError(400, "sender is not found");
    }

    // console.log("receiverExist", receiverExist)

    const receiver = receiverExist?._id || {
        phone: receiverPhoneNumber,
        address: restPayload.deliveryAddress
    }
    // console.log("receiver", receiver)

    if(!receiver){
        throw new AppError(400, "can not create parcel with receiver info");
    }

    const fee = calculateFee(payload.weight as number)
    const trackingId = createTrackingId()

    const trackingEvents : ITrackingEvents = {
        status: Status.REQUESTED,
        location: restPayload.pickupAddress as Iaddress,
        note: `Parcel request submitted by ${senderInfo?.name}, ${senderInfo?.email}`,
        timestamp: new Date().toISOString(),
        updatedBy: Role.SENDER
    }

    const parcelInfo = {
        ...restPayload,
        senderId: senderInfo?._id,
        receiverInfo: receiver,
        fee,
        status: Status.REQUESTED,
        trackingEvents,
        trackingId,
    }
    // console.log(parcelInfo)
    const newParcel = await Parcel.create([parcelInfo], {session})



    // * create payment record

    const transactionId = getTransactionId();

    const paymentInfo = {
        parcelId: newParcel[0]?._id,
        amount: fee,
        status: PAYMENT_STATUS.UNPAID,
        transactionId: transactionId,
        trackingId: trackingId,
    }

    const newPayment = await Payment.create([paymentInfo], {session})

    const newlyAddedParcel = await Parcel.findByIdAndUpdate(newParcel[0]?._id, {paymentId: newPayment[0]?._id}, {new: true, session})
    .populate("senderId", "name email phone address")

    if(!newlyAddedParcel){
        throw new AppError(400, "parcel not found")
    }
    const sslPayload : ISSLCommerz = {
        // @ts-expect-error - senderId is populated with user data
        name: (newlyAddedParcel?.senderId as { name: string }).name,
        // @ts-expect-error - senderId is populated with user data
        email: (newlyAddedParcel?.senderId as { email: string }).email,   
        // @ts-expect-error - senderId is populated with user data
        phoneNumber: (newlyAddedParcel?.senderId as { phone: string }).phone,
        // @ts-expect-error - senderId is populated with user data
        address: (newlyAddedParcel?.senderId as { address: string }).address as string,
        amount: newlyAddedParcel?.fee,
        transactionId: transactionId
    }

    const sslPayment = await sslService.sslPaymentInit(sslPayload)

    await Payment.findByIdAndUpdate(newPayment[0]?._id, {url: sslPayment.GatewayPageURL}, {new: true, session})

    await session.commitTransaction()
    session.endSession()
    return {newParcel, newPayment}

    } catch (error) {
        session.abortTransaction()
        session.endSession()
        throw (error as Error).message
    }
}

const updateParcelService = async(payload: Partial<IParcel>, trackingId: string)=>{

    const filter = {trackingId: trackingId}

    const parcel = await Parcel.findOne(filter)
    if(parcel?.status !== Status.REQUESTED && parcel?.status !== Status.APPROVED ){
        throw new AppError(400, `Sorry, parcel already on -> ${parcel?.status}`);
    }

    const updatePayload = {...payload}

    if(payload.weight){
        updatePayload.fee = calculateFee(payload.weight)
    }

    const updateParcelInfo = await Parcel.findOneAndUpdate(filter, updatePayload, {new: true})
    return updateParcelInfo
}

const updateParcelStatusService = async(payload: { status: Status }, trackingId: string, userInfo: JwtPayload, lat: number, lng: number)=>{
    // Processing parcel status update payload
    const parcel = await Parcel.findOne({trackingId: trackingId})

    if(!parcel){
        throw new AppError(400, "parcel not found");
    }

    // console.log("parcel", parcel)

    const parcelCurrentStatus = parcel.status as keyof typeof StatusFlow
    const updateRequestRole = userInfo.role
    

    const allowedNextStatus: Status[] = StatusFlow[parcelCurrentStatus].next as Status[]
    const allowedRoles: Role[] = StatusFlow[payload.status].allowedRoles as Role[]

    // console.log("allowedNextStatus", allowedNextStatus)
    // console.log("allowedRoles", allowedRoles)

    if(!allowedRoles.includes(updateRequestRole)){
        throw new AppError(400, 
      `you are not permitted to select status to ${payload.status}`
    );
    }

    if(updateRequestRole === Role.SENDER && [Status.BLOCKED, Status.APPROVED, Status.ASSIGNED].includes(payload.status)){
        throw new AppError(400, 
      `Sender can not update ${parcelCurrentStatus} to ${payload.status}`
    );
    }

    if(!allowedNextStatus.includes(payload.status)){
        throw new AppError(400, 
      `Invalid status transition from ${parcelCurrentStatus} to ${payload.status}`
    );
    }

    let updateStatusLog = {}

    if(payload.status == Status.DELIVERED){
        updateStatusLog = DeliveredStatusHandler(parcel, payload)
    }


    if(payload.status != Status.DELIVERED){
        updateStatusLog = {
            ...payload,
            location: {
                latitude: lat,
                longitude: lng,
            },
            timestamp: new Date().toISOString(),
        } as ITrackingEvents
    }

    const updateStatus = await Parcel.findOneAndUpdate({trackingId: parcel.trackingId}, {
        $set: {status : payload.status},
        $push: {trackingEvents: updateStatusLog}
    }, {new : true})

    return updateStatus
}

// const assignDeliveryAgentService = async(trackingId: string, _lat: number, _lng: number)=>{

//     let canNotFindAnyDeliveryAgent = false

//     const parcel = await Parcel.findOne({trackingId: trackingId})

//     const allAvailableDeliveryAgent = await User.find({role: Role.DELIVERY_AGENT, availableStatus: AvailableStatus.AVAILABLE}).select("_id name phone currentLocation")

//     if(allAvailableDeliveryAgent.length == 0){
//         canNotFindAnyDeliveryAgent = true
//         const updateStatusLog = {
//         status: Status.PENDING,
//         // location: "",
//         note: "Could not find any available delivery agent, if someone available will be assigned",
//         timestamp: new Date().toISOString(),
//         updatedBy: Role.SYSTEM
//         }

//         await Parcel.findOneAndUpdate({trackingId: trackingId}, {status: Status.PENDING, $push: {trackingEvents: updateStatusLog}}, {new: true})
//         return
//     }

//     // * based on Rider Availability, 
//     // * Location Proximity, 
//     // * ETA (Estimated Time of Arrival), 
//     // * Parcel Priority,
//     // * and Rider Experience Level

//     // [
//     //     {
//     //       _id: new ObjectId('68ad5002cf5bb7e5125ae534'),
//     //       name: 'Hasib Hossain Niloy',
//     //       phone: '01915910291',
//     //       currentLocation: { latitude: 23.7969, longitude: 90.3863 }
//     //     },
//     //     {
//     //       _id: new ObjectId('68af3ff708c1534fb5da050f'),
//     //       name: 'kamal uddin',
//     //       phone: '01915910298',
//     //       currentLocation: { latitude: 23.7969, longitude: 90.3863 }
//     //     }
//     //   ]
    
//     const {selectedDeliveryAgent} = await getETA(parcel?.pickupAddress.latitude as number, parcel?.pickupAddress.longitude as number, allAvailableDeliveryAgent as unknown as IAllDeliveryAgent[])

//     const updateStatusLog : ITrackingEvents = {
//         status: Status.ASSIGNED,
//         // location: {
//         //     latitude: lat,
//         //     longitude: lng,
//         // },
//         note: "Parcel assigned to delivery agent",
//         timestamp: new Date().toISOString(),
//         updatedBy: Role.SYSTEM
//     }

//     const insertDeliveryAgentInParcel = await Parcel.findOneAndUpdate({trackingId: trackingId}, {
//         assignedDeliveryAgent: selectedDeliveryAgent, status:Status.ASSIGNED, $push: {trackingEvents: updateStatusLog}
//     }, {new: true})

//     const addParcelIdInDeliveryAgent = await User.findByIdAndUpdate(selectedDeliveryAgent?._id, {currentParcelId: insertDeliveryAgentInParcel?._id, availableStatus: AvailableStatus.BUSY, $push: {assignedParcels: insertDeliveryAgentInParcel?._id}}, {new: true})

//     return {insertDeliveryAgentInParcel, addParcelIdInDeliveryAgent, canNotFindAnyDeliveryAgent}
// }

const viewAllParcelSenderService = async(userInfo: JwtPayload)=>{
    const allParcel = await Parcel.find({senderId: userInfo.userId}).populate("paymentId", "url")
    const total = allParcel.length
    return {allParcel, total}
}

const viewIncomingParcelReceiverService = async(userInfo: JwtPayload)=>{
    const allIncomingParcel = await Parcel.find({receiverId: userInfo.userId, status: { $nin: [Status.APPROVED, Status.CONFIRMED, Status.CANCELLED, Status.BLOCKED] }})
    const total = allIncomingParcel.length
    return {allIncomingParcel, total}
}

const allDeliveredParcelReceiverService = async(userInfo: JwtPayload)=>{
    const allDeliveredParcel = await Parcel.find({receiverId: userInfo.userId, status: Status.CONFIRMED})
    const total = allDeliveredParcel.length
    return {allDeliveredParcel, total}
}

const allParcelService = async(query: Record<string, unknown> = {})=>{
    const filter = {...query}
    const searchTerm = query.searchTerm || ""
    const sort = query.sort || "-createdAt"
    delete filter["searchTerm"]
    delete filter["sort"]

    const searchArray = ["status", "trackingId"]
    const searchQuery = searchTerm ? {
        $or: searchArray.map((field)=> ({[field]: {$regex: searchTerm, $options: "i"}}))
    } : {}

    const allParcel = await Parcel.find({ ...searchQuery, ...filter }).sort(sort as string)
    const total = allParcel.length
    return {allParcel, total}
}

const singleParcelService = async(trackingId: string)=>{
    const singleParcel = await Parcel.findOne({trackingId: trackingId}).populate("receiverId", "phone")
    return singleParcel
}

// const makePaymentService = async(trackingId: string)=>{
//     const paymentRecord = await Payment.findOne({trackingId: trackingId})
//     if(!paymentRecord){
//         throw new AppError(400, "payment not found")
//     }
// }

export const parcelServices = {
    createParcelService,
    updateParcelService,
    updateParcelStatusService,
    // assignDeliveryAgentService,
    viewAllParcelSenderService,
    viewIncomingParcelReceiverService,
    allDeliveredParcelReceiverService,
    allParcelService,
    singleParcelService,
    // makePaymentService
}