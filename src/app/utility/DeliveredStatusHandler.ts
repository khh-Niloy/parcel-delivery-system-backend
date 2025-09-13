import AppError from "../errorHelper/AppError";
import { IParcel, ITrackingEvents, Status } from "../modules/parcel/parcel.interface";
import { Parcel } from "../modules/parcel/parcel.model";
import { AvailableStatus, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { deliveryDurationCalc } from "./deliveryDurationCalc";
import { getETA, IAllDeliveryAgent } from "./getETA";

export const DeliveredStatusHandler = async(parcel: IParcel, payload: {status: Status})=>{

    // * update parcel status

    const pickedUpTime = parcel.trackingEvents?.find((e)=> e.status == "PICKEDUP")
    
    let updateStatusLog = {}

        if (!pickedUpTime) {
            throw new AppError(400, "Picked up time not found in tracking events");
        }

        const calculatedDeliveryDuration = deliveryDurationCalc(pickedUpTime.timestamp)

        updateStatusLog = {
            ...payload,
            timestamp: new Date().toISOString(),
            deliveryDuration: calculatedDeliveryDuration as unknown
        } as ITrackingEvents

    const updateStatus = await Parcel.findOneAndUpdate({trackingId: parcel.trackingId}, {
        $set: {status : payload.status},
        $push: {trackingEvents: updateStatusLog}
    }, {new : true})

    console.log("parcel", parcel)




    // * update delivery agent available status

    const res = await User.findOneAndUpdate(
        { currentParcelId: parcel._id },
        {
            availableStatus: AvailableStatus.AVAILABLE,
            currentParcelId: null,
            $inc: { completedDeliveries: 1 },
        }
    );
    console.log("res rider, updated", res)



    // * pending parcel assignment


    console.log("before setTimeout");
    setTimeout(() => {
        (async () => {
            try {
                console.log("entered setTimeout");

                let allAvailableDeliveryAgent = await User.find({
                    role: Role.DELIVERY_AGENT,
                    availableStatus: AvailableStatus.AVAILABLE,
                });

                console.log("available agents", allAvailableDeliveryAgent);

                if(allAvailableDeliveryAgent.length == 0){
                    return
                }

                if (allAvailableDeliveryAgent.length > 0) {
                    let allPendingParcels = await Parcel.find({ status: Status.PENDING }).sort({ createdAt: 1 });

                    if(allPendingParcels.length == 0){
                        return
                    }

                    console.log("waiting parcels", allPendingParcels);

                    while (allPendingParcels.length > 0 && allAvailableDeliveryAgent.length > 0) {
                        const selectedPendingParcel = allPendingParcels.shift();
                        const {selectedDeliveryAgent, duration, durationUnit, distance, distanceUnit} = await getETA(selectedPendingParcel?.pickupAddress.latitude as number, selectedPendingParcel?.pickupAddress.longitude as number, 
                             allAvailableDeliveryAgent as unknown as IAllDeliveryAgent[])

                        console.log("selectedPendingParcel", selectedPendingParcel)
                        console.log("selectedDeliveryAgent", selectedDeliveryAgent)

                        if (!selectedPendingParcel || !selectedDeliveryAgent) break;

                        const updateStatusLog = {
                            status: Status.ASSIGNED,
                            location: selectedPendingParcel.pickupAddress,
                            note: "pending parcel assigned to delivery agent",
                            timestamp: new Date().toISOString(),
                            updatedBy: Role.DELIVERY_AGENT,
                        };

                        await Parcel.findByIdAndUpdate(
                            selectedPendingParcel._id,
                            {
                                assignedDeliveryAgent: selectedDeliveryAgent,
                                status: Status.ASSIGNED,
                                $push: { trackingEvents: updateStatusLog },
                            },
                            { new: true }
                        );

                        await User.findByIdAndUpdate(
                            selectedDeliveryAgent._id,
                            {
                                currentParcelId: selectedPendingParcel._id,
                                availableStatus: AvailableStatus.BUSY,
                                $push: { assignedParcels: selectedPendingParcel._id },
                            },
                            { new: true }
                        );

                        allAvailableDeliveryAgent = allAvailableDeliveryAgent.filter(
                            agent => agent._id.toString() !== selectedDeliveryAgent._id.toString()
                          );

                          allPendingParcels = allPendingParcels.filter(
                            parcel => parcel._id.toString() !== selectedPendingParcel._id.toString()
                        );
                          
                    }
                }
                
            } catch (error) {
                console.error("Error in delayed assignment:", error);
            }
        })();
    }, 60 * 1000);

    console.log("done");


    return updateStatusLog
}