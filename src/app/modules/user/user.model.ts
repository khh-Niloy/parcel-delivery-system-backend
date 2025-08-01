import { model, Schema } from "mongoose";
import { IauthProvider, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IauthProvider>({
    provider: {type: String, required: true},
    providerId: {type: String, required: true}
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
    auths: [authProviderSchema]
}, {timestamps: true, versionKey: false})

export const User = model<IUser>("User", userSchema)