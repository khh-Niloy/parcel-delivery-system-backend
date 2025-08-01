import { model, Schema, Types } from "mongoose";
import { AvailableStatus, ExperienceLevel, IDeliveryAgent, VehicleType } from "./deliveryAgent.interface";
import { userSchema } from "../user/user.model";


const deliveryAgentSchema = new Schema<IDeliveryAgent>({
    ...userSchema.obj,
    currentParcelId: { type: Schema.Types.ObjectId, ref: "Parcel" },
    availableStatus: { type: String, enum: Object.values(AvailableStatus), default: AvailableStatus.AVAILABLE },
    completedDeliveries: { type: Number, default: 0 },
    assignedParcels: [{ type: Schema.Types.ObjectId, ref: "Parcel" }],
    vehicleType: {
    type: String,
    enum: Object.values(VehicleType),},
    licenseNumber: { type: String },
    experienceLevel: { type: String, enum: Object.values(ExperienceLevel) }
}, {timestamps: true, versionKey: false})

export const DeliveryAgent = model<IDeliveryAgent>("DeliveryAgent", deliveryAgentSchema)