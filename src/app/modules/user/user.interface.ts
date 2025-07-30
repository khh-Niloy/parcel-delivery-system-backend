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
}