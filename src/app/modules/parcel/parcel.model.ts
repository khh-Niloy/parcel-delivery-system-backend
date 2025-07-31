import { model, Schema } from "mongoose";
import { IParcel, ITrackingEvents, Status } from "./parcel.interface";
import { Role } from "../user/user.interface";

const trackingSchema = new Schema<ITrackingEvents>({
    status: {type: String, enum: Status, required: true},
    location: {type: String, required: true},
    note: {type: String},
    timestamp: {type: String, required: true},
    updatedBy: {type: String, enum: Role, required: true},
}, {timestamps: true, versionKey: false, _id: false})

const parcelSchema = new Schema<IParcel>({
    type: {type: String},
    weight: {type: Number, required: true},
    senderId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    receiverId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    deliveryAddress: {type: String, required: true},
    pickupAddress: {type: String, required: true},
    deliveryDate: {type: Date, required: true},
    fee: {type: Number, required: true},
    status: {type: String, enum: Status, required: true},
    trackingEvents: {type: [trackingSchema], default: []},
    trackingId: {type: String, required: true},

}, {timestamps: true, versionKey: false})

export const Parcel = model<IParcel>("Parcel", parcelSchema) 