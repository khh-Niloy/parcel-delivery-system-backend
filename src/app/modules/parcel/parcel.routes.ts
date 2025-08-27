import { Router } from "express";
import { roleBasedAccess } from "../../middleware/roleBasedAccess";
import { Role } from "../user/user.interface";
import { validateZodSchema } from "../../middleware/validateZodSchema";
import { createParcelZodSchema, updateParcelZodSchema } from "./parcel.validation";
import { parcelController } from "./parcel.controller";

export const parcelRoutes = Router()

parcelRoutes.get("/all-sender-parcel", roleBasedAccess(Role.SENDER), parcelController.viewAllParcelSender)

parcelRoutes.get("/incoming-parcels", roleBasedAccess(Role.RECEIVER), parcelController.viewIncomingParcelReceiver)

parcelRoutes.get("/delivered-parcels", roleBasedAccess(Role.RECEIVER), parcelController.allDeliveredParcelReceiver)

parcelRoutes.get("/single-parcel/:trackingId", roleBasedAccess(Role.SENDER, Role.ADMIN, Role.SUPER_ADMIN), parcelController.singleParcel)

parcelRoutes.get("/admin/all-parcels", roleBasedAccess(Role.ADMIN, Role.SUPER_ADMIN, Role.DELIVERY_AGENT, Role.RECEIVER), parcelController.allParcel)

parcelRoutes.post("/create-parcel", roleBasedAccess(Role.SENDER), validateZodSchema(createParcelZodSchema), parcelController.createParcel)

parcelRoutes.patch("/:trackingId", roleBasedAccess(Role.SENDER, Role.ADMIN, Role.SUPER_ADMIN), validateZodSchema(updateParcelZodSchema), parcelController.updateParcel)

parcelRoutes.patch("/status/:trackingId", roleBasedAccess(...Object.values(Role)), parcelController.updateParcelStatus)

parcelRoutes.patch("/assign-delivery-agent/:trackingId", roleBasedAccess(Role.ADMIN, Role.SUPER_ADMIN), parcelController.assignDeliveryMan)