import { Status } from "../modules/parcel/parcel.interface";
import { Role } from "../modules/user/user.interface";

export const StatusFlow = {
  REQUESTED: {
    next: [Status.APPROVED, Status.BLOCKED, Status.CANCELLED],
    allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN, Role.SENDER],
  },

  BLOCKED: {
    next: [Status.REQUESTED],
    allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN],
  },

  CANCELLED: {
    next: [Status.REQUESTED],
    allowedRoles: [Role.ADMIN, Role.SENDER, Role.SUPER_ADMIN],
  },

  APPROVED: {
    next: [Status.CANCELLED, Status.PENDING, Status.ASSIGNED],
    allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN, Role.SENDER],
  },

  PENDING: {
    next: [Status.ASSIGNED],
    allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN],
  },

  ASSIGNED: {
    next: [Status.PICKEDUP],
    allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN, Role.DELIVERY_AGENT],  
  },

  PICKEDUP: {
    next: [Status.ON_THE_WAY],
    allowedRoles: [Role.DELIVERY_AGENT],
  },

  ON_THE_WAY: {
    next: [Status.DELIVERED],
    allowedRoles: [Role.DELIVERY_AGENT],
  },

  DELIVERED: {
    next: [Status.CONFIRMED, Status.RETURNED],
    allowedRoles: [Role.DELIVERY_AGENT],
  },

  CONFIRMED: {
    next: [],
    allowedRoles: [Role.RECEIVER],
  },

  RETURNED: {
    next: [Status.REQUESTED],
    allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN, Role.DELIVERY_AGENT],
  },
};