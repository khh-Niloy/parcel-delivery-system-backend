import { Types } from "mongoose";
import { Role } from "../user/user.interface";

export enum Status {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  CANCELLED = "CANCELLED",
  BLOCKED = "BLOCKED",
  DISPATCHED = "DISPATCHED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED",
  CONFIRMED = "CONFIRMED"
}
// RESCHEDULED

export interface ITrackingEvents{
    status: Status,
    location: string,
    note: string
    timestamp: string,
    updatedBy: Role
}

export interface IassignedDeliveryAgent{
  _id: string,
  name: string,
  phone: string
}

export interface IParcel{
    _id?: Types.ObjectId,
    type: string,
    weight: number,
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
    deliveryAddress: string,
    pickupAddress: string,
    deliveryDate: Date,
    fee: number,
    status: Status,
    trackingEvents?: ITrackingEvents[],
    trackingId: string,
    receiverPhoneNumber?: string,
    assignedDeliveryAgent?: IassignedDeliveryAgent
} 