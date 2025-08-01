import { Router } from "express";
import { roleBasedAccess } from "../../middleware/roleBasedAccess";
import { Role } from "../user/user.interface";
import { validateZodSchema } from "../../middleware/validateZodSchema";
import { createParcelZodSchema, updateParcelZodSchema } from "./parcel.validation";
import { parcelController } from "./parcel.controller";

export const parcelRoutes = Router()

parcelRoutes.post("/create-parcel", roleBasedAccess(Role.SENDER), validateZodSchema(createParcelZodSchema), parcelController.createParcel)
parcelRoutes.patch("/:trackingId", roleBasedAccess(Role.SENDER, Role.ADMIN, Role.SUPER_ADMIN), validateZodSchema(updateParcelZodSchema), parcelController.updateParcel)
parcelRoutes.patch("/status/:trackingId", roleBasedAccess(Role.DELIVERY_AGENT, Role.ADMIN, Role.SUPER_ADMIN), parcelController.updateParcelStatus)
parcelRoutes.patch("/assign-delivery-agent/:trackingId", roleBasedAccess(Role.ADMIN, Role.SUPER_ADMIN), parcelController.assignDeliveryMan)