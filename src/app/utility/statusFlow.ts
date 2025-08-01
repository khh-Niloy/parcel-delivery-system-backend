import { Status } from "../modules/parcel/parcel.interface";
import { Role } from "../modules/user/user.interface";

export const StatusFlow = {
  REQUESTED: {
    next: [Status.APPROVED, Status.CANCELLED],
    allowedRoles: [Role.ADMIN, Role.SUPER_ADMIN, Role.SENDER],
  },
  APPROVED: {
    next: [Status.DISPATCHED, Status.BLOCKED, Status.CANCELLED],
    allowedRoles: [Role.ADMIN, Role.SENDER],
  },
  DISPATCHED: {
    next: [Status.IN_TRANSIT],
    allowedRoles: [Role.DELIVERY_AGENT],
  },
  IN_TRANSIT: {
    next: [Status.DELIVERED, Status.RETURNED],
    allowedRoles: [Role.DELIVERY_AGENT],
  },
  RETURNED: {
    next: [],
    allowedRoles: [Role.ADMIN],
  },
  DELIVERED: {
    next: [Status.CONFIRMED],
    allowedRoles: [Role.RECEIVER],
  },
  CANCELLED: {
    next: [],
    allowedRoles: [],
  },
  BLOCKED: {
    next: [],
    allowedRoles: [Role.ADMIN],
  },
}