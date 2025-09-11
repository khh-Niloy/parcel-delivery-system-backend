import { model, Schema } from "mongoose";
import { AvailableStatus, ExperienceLevel, IauthProvider, Ilocation, IUser, Role, VehicleType } from "./user.interface";

const authProviderSchema = new Schema<IauthProvider>({
    provider: {type: String, required: true},
    providerId: {type: String, required: true}
}, {versionKey: false, _id: false})

const locationSchema = new Schema<Ilocation>({
    latitude: { type: Number },
    longitude: { type: Number },
}, {versionKey: false, _id: false})

export const userSchema = new Schema<IUser>({
    name: {type: String, required: true},
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    phone: { type: String, required: true },
    picture: { type: String },
    address: { type: String, required: true },
    isDeleted: {type: Boolean, default: false},
    isBlocked: {type: Boolean, default: false},
    role: { type: String, enum: Object.values(Role), default: Role.SENDER },
    auths: [authProviderSchema],

    // delivery agent

    currentParcelId: { type: Schema.Types.ObjectId, ref: "Parcel" },
    availableStatus: { type: String, enum: Object.values(AvailableStatus)},
    completedDeliveries: { type: Number},
    assignedParcels: [{ type: Schema.Types.ObjectId, ref: "Parcel" }],
    vehicleType: {type: String, enum: Object.values(VehicleType),},
    licenseNumber: { type: String },
    experienceLevel: { type: String, enum: Object.values(ExperienceLevel) },
    currentLocation: { type: locationSchema },

    // delivery agent


}, {timestamps: true, versionKey: false})

userSchema.pre("save", function (next) {
    if (this.role !== Role.DELIVERY_AGENT) {
        this.set("assignedParcels", undefined, { strict: false });
    }
    next();
});

export const User = model<IUser>("User", userSchema)