import { JwtPayload } from "jsonwebtoken"
import { IParcel, IpickupAddress, ITrackingEvents, Status } from "./parcel.interface"
import { User } from "../user/user.model"
import { AvailableStatus, Role } from "../user/user.interface"
import { createTrackingId } from "../../utility/createTrackingId"
import { calculateFee } from "../../utility/calculateFee"
import { Parcel } from "./parcel.model"
import AppError from "../../errorHelper/AppError"
import { getETA, IAllDeliveryAgent } from "../../utility/getETA"

const createParcelService = async(payload: Partial<IParcel>, userInfo: JwtPayload)=>{

    const {receiverPhoneNumber, ...restPayload} = payload

    const receiverExist = await User.findOne({phone: receiverPhoneNumber})
    const senderInfo = await User.findById(userInfo.userId)

    if(!senderInfo){
        throw new AppError(400, "sender is not found");
    }

    let receiver = receiverExist?._id || {
        phone: receiverPhoneNumber,
        address: restPayload.deliveryAddress
    }

    if(!receiver){
        throw new AppError(400, "can not create parcel with receiver info");
    }

    const fee = calculateFee(payload.weight as number)
    const trackingId = createTrackingId()

    const trackingEvents : ITrackingEvents = {
        status: Status.REQUESTED,
        location: restPayload.pickupAddress as IpickupAddress,
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
    const newParcel = await Parcel.create(parcelInfo)
    return newParcel
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

// const updateParcelStatusService = async(payload: { status: Status, updatedBy: Role }, trackingId: string)=>{
//     console.log("payload", payload)
//     const parcel = await Parcel.findOne({trackingId: trackingId})

//     if(!parcel){
//         throw new AppError(400, "parcel not found");
//     }

//     const parcelCurrentStatus = parcel.status as keyof typeof StatusFlow
//     const updateRequestRole = payload.updatedBy as Role

//     const allowedNextStatus: Status[] = StatusFlow[parcelCurrentStatus].next as Status[]
//     const allowedRoles: Role[] = StatusFlow[parcelCurrentStatus].allowedRoles as Role[]

//     if(!allowedRoles.includes(updateRequestRole)){
//         throw new AppError(400, 
//       `you are not permitted to select status to ${payload.status}`
//     );
//     }

//     if(payload.updatedBy === Role.SENDER && [Status.BLOCKED, Status.APPROVED, Status.DISPATCHED].includes(payload.status)){
//         throw new AppError(400, 
//       `Sender can not update ${parcelCurrentStatus} to ${payload.status}`
//     );
//     }

//     if(!allowedNextStatus.includes(payload.status)){
//         throw new AppError(400, 
//       `Invalid status transition from ${parcelCurrentStatus} to ${payload.status}`
//     );
//     }

//     if (payload.status === Status.DELIVERED) {
//     await User.findOneAndUpdate(
//         { currentParcelId: parcel._id },
//         {
//             availableStatus: AvailableStatus.AVAILABLE,
//             currentParcelId: null,
//             $inc: { completedDeliveries: 1 },
//         }
//     );

//     console.log("before setTimeout");

//     setTimeout(() => {
//         (async () => {
//             try {
//                 console.log("entered setTimeout");

//                 const allAvailableDeliveryAgent = await User.find({
//                     role: Role.DELIVERY_AGENT,
//                     availableStatus: AvailableStatus.AVAILABLE,
//                 });

//                 console.log("available agents", allAvailableDeliveryAgent);

//                 if (allAvailableDeliveryAgent.length > 0) {
//                     const allWaitingParcels = await Parcel.find({ status: Status.WAITING }).sort({ createdAt: 1 });

//                     console.log("waiting parcels", allWaitingParcels);

//                     while (allWaitingParcels.length > 0 && allAvailableDeliveryAgent.length > 0) {
//                         const parcel = allWaitingParcels.shift();
//                         const deliveryAgent = allAvailableDeliveryAgent.shift();

//                         if (!parcel || !deliveryAgent) break;

//                         const updateStatusLog = {
//                             status: Status.DISPATCHED,
//                             location: parcel.pickupAddress,
//                             note: "Parcel picked up from sender",
//                             timestamp: new Date().toISOString(),
//                             updatedBy: Role.DELIVERY_AGENT,
//                         };

//                         await Parcel.findByIdAndUpdate(
//                             parcel._id,
//                             {
//                                 assignedDeliveryAgent: deliveryAgent,
//                                 status: Status.DISPATCHED,
//                                 $push: { trackingEvents: updateStatusLog },
//                             },
//                             { new: true }
//                         );

//                         await User.findByIdAndUpdate(
//                             deliveryAgent._id,
//                             {
//                                 currentParcelId: parcel._id,
//                                 availableStatus: AvailableStatus.BUSY,
//                                 $push: { assignedParcels: parcel._id },
//                             },
//                             { new: true }
//                         );
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error in delayed assignment:", error);
//             }
//         })();
//     }, 60 * 1000);

//     console.log("done");
// }


//     const updateStatusLog = {
//         ...payload,
//         timestamp: new Date().toISOString()
//     }

//     const updateStatus = await Parcel.findOneAndUpdate({trackingId: trackingId}, {
//         $set: {status : payload.status},
//         $push: {trackingEvents: updateStatusLog}
//     }, {new : true})

//     return updateStatus
// }

const assignDeliveryAgentService = async(trackingId: string)=>{

    let isWaiting = false

    const parcel = await Parcel.findOne({trackingId: trackingId})

    const allAvailableDeliveryAgent = await User.find({role: Role.DELIVERY_AGENT, availableStatus: AvailableStatus.AVAILABLE}).select("_id name phone currentLocation")

    // if(allAvailableDeliveryAgent.length == 0){
    //     isWaiting = true
    //     const updateStatusLog = {
    //     status: Status.WAITING,
    //     location: "",
    //     note: "Could not find any available delivery agent, if someone available will be assigned",
    //     timestamp: new Date().toISOString(),
    //     updatedBy: Role.ADMIN
    //     }

    //     await Parcel.findOneAndUpdate({trackingId: trackingId}, {status: Status.WAITING, $push: {trackingEvents: updateStatusLog}}, {new: true})
    //     return
    // }

    // based on Rider Availability, 
    // Location Proximity, 
    // ETA (Estimated Time of Arrival), 
    // Parcel Priority,
    // and Rider Experience Level

    // [
    //     {
    //       _id: new ObjectId('68ad5002cf5bb7e5125ae534'),
    //       name: 'Hasib Hossain Niloy',
    //       phone: '01915910291',
    //       currentLocation: { latitude: 23.7969, longitude: 90.3863 }
    //     },
    //     {
    //       _id: new ObjectId('68af3ff708c1534fb5da050f'),
    //       name: 'kamal uddin',
    //       phone: '01915910298',
    //       currentLocation: { latitude: 23.7969, longitude: 90.3863 }
    //     }
    //   ]
    
    // console.log(parcel?.pickupAddress)


    const {selectedDeliveryAgent, duration, durationUnit, distance, distanceUnit} = await getETA(parcel?.pickupAddress.latitude as number, parcel?.pickupAddress.longitude as number, allAvailableDeliveryAgent as unknown as IAllDeliveryAgent[])
    // console.log(selectedDeliveryAgent)




    // const availableDeliveryAgent = allAvailableDeliveryAgent[0]

    // // console.log(availableDeliveryAgent)

    // const updateStatusLog = {
    //     status: Status.DISPATCHED,
    //     location: parcel?.pickupAddress,
    //     note: "Parcel picked up from sender",
    //     timestamp: new Date().toISOString(),
    //     updatedBy: Role.DELIVERY_AGENT
    // }

    // const insertDeliveryAgentId = await Parcel.findOneAndUpdate({trackingId: trackingId}, {
    //     assignedDeliveryAgent: availableDeliveryAgent, status:Status.DISPATCHED, $push: {trackingEvents: updateStatusLog}
    // }, {new: true})

    // const addParcelId = await User.findByIdAndUpdate(availableDeliveryAgent._id, {currentParcelId: parcel?._id, availableStatus: AvailableStatus.BUSY, $push: {assignedParcels: parcel?._id}}, {new: true})

    // return {insertDeliveryAgentId, addParcelId, isWaiting}
}

const viewAllParcelSenderService = async(userInfo: JwtPayload)=>{
    const allParcel = await Parcel.find({senderId: userInfo.userId})
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

const makePaymentService = async(trackingId: string)=>{
    const makePayment = await Parcel.findOneAndUpdate({trackingId: trackingId}, {isPaid: true}, {new: true})
    const trackingEvents : ITrackingEvents = {
        status: Status.APPROVED,
        // location: restPayload.pickupAddress as string,
        note: "Parcel payment made",
        timestamp: new Date().toISOString(),
        updatedBy: Role.SENDER
    }
    await Parcel.findOneAndUpdate({trackingId: trackingId}, { $push: { trackingEvents: trackingEvents } }, { new: true })
    return makePayment
}

export const parcelServices = {
    createParcelService,
    updateParcelService,
    // updateParcelStatusService,
    assignDeliveryAgentService,
    viewAllParcelSenderService,
    viewIncomingParcelReceiverService,
    allDeliveredParcelReceiverService,
    allParcelService,
    singleParcelService,
    makePaymentService
}