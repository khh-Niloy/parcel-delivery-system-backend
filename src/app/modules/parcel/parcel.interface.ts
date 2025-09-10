import { Types } from "mongoose";
import { Role } from "../user/user.interface";

export enum Status {
  REQUESTED = "REQUESTED",
  BLOCKED = "BLOCKED",
  CANCELLED = "CANCELLED",
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  PICKEDUP = "PICKEDUP",
  ON_THE_WAY = "ON_THE_WAY",
  DELIVERED = "DELIVERED",
  CONFIRMED = "CONFIRMED",
  RETURNED = "RETURNED",
}

export interface ITrackingEvents{
    status: Status,
    location?: string,
    note: string
    timestamp: string,
    updatedBy: Role
}

export interface IassignedDeliveryAgent{
  _id: string,
  name: string,
  phone: string
}

export interface IReceiverInfo{
  _id?: Types.ObjectId,
  phone: string,
  address: string
}



export interface IParcel{
    _id?: Types.ObjectId,
    type: string,
    weight: number,
    senderId: Types.ObjectId,
    // receiverId?: Types.ObjectId,
    receiverInfo?: IReceiverInfo,
    deliveryAddress: string,
    pickupAddress: string,
    deliveryDate: Date,
    fee: number,
    status: Status,
    trackingEvents?: ITrackingEvents[],
    trackingId: string,
    receiverPhoneNumber?: string,
    assignedDeliveryAgent?: IassignedDeliveryAgent,
    isPaid?: boolean
} 