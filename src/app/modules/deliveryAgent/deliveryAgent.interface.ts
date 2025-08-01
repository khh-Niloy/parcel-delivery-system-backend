import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

export enum AvailableStatus {
  OFFLINE = "OFFLINE",
  AVAILABLE = "AVAILABLE",
  BUSY = "BUSY",
}

export enum VehicleType{
  bike = "bike",
  car = "car",
  van = "van",
  other = "other"
}

export enum ExperienceLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  EXPERT = "expert",
}


export interface IDeliveryAgent extends IUser{
  currentParcelId?: Types.ObjectId,
  availableStatus?: AvailableStatus,
  completedDeliveries?: number,
  assignedParcels?: Types.ObjectId[],
  vehicleType?: VehicleType;
  licenseNumber?: string;
  experienceLevel?: ExperienceLevel;
} 