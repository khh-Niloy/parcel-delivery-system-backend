import { Types } from "mongoose";

export enum Role{
    "ADMIN" = "ADMIN",
    "SUPER_ADMIN" = "SUPER_ADMIN",
    "SENDER" = "SENDER",
    "RECEIVER" = "RECEIVER",
    "DELIVERY_AGENT" = "DELIVERY_AGENT",
}

export interface IauthProvider{
    provider: "credential" | "google",
    providerId: string
}

// delivery agent
export enum AvailableStatus {
  AVAILABLE = "AVAILABLE",
  BUSY = "BUSY",
  OFFLINE = "OFFLINE"
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

export interface Ilocation {
  latitude: number;
  longitude: number;
}
// delivery agent

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  picture?: string;
  address: string;
  isDeleted?: boolean;
  isBlocked?: boolean;
  role: Role;
  auths: IauthProvider[];

  //  delivery agent

  currentParcelId?: Types.ObjectId,
  availableStatus?: AvailableStatus,
  completedDeliveries?: number,
  assignedParcels?: Types.ObjectId[],
  vehicleType?: VehicleType;
  licenseNumber?: string;
  experienceLevel?: ExperienceLevel;
  currentLocation?: Ilocation;

  // delivery agent
}