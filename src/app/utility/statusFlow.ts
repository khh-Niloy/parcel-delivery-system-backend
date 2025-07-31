export const StatusFlow = {
  REQUESTED: {
    next: ["APPROVED", "CANCELLED"],
    allowedRoles: ["ADMIN", "SUPER_ADMIN","SENDER"],
  },
  APPROVED: {
    next: ["DISPATCHED", "BLOCKED"],
    allowedRoles: ["ADMIN"],
  },
  DISPATCHED: {
    next: ["IN_TRANSIT"],
    allowedRoles: ["DELIVERY_AGENT"],
  },
  IN_TRANSIT: {
    next: ["DELIVERED", "RETURNED"],
    allowedRoles: ["DELIVERY_AGENT"],
  },
  RETURNED: {
    next: [],
    allowedRoles: ["ADMIN"],
  },
  DELIVERED: {
    next: [],
    allowedRoles: [],
  },
  CANCELLED: {
    next: [],
    allowedRoles: [],
  },
  BLOCKED: {
    next: [],
    allowedRoles: ["ADMIN"],
  },
}