import { Router } from "express";
import { validateZodSchema } from "../../middleware/validateZodSchema";
import { createDeliveryAgentZodSchema, udpateDeliveryAgentStatusZodSchema } from "./deliveryAgent.validation";
import { deliveryAgentController } from "./deliveryAgent.controller";
import { roleBasedAccess } from "../../middleware/roleBasedAccess";
import { Role } from "../user/user.interface";


export const deliveryAgentRoutes = Router()

deliveryAgentRoutes.get("/all-delivery-agent", roleBasedAccess(Role.ADMIN, Role.SUPER_ADMIN), deliveryAgentController.getAllDeliveryAgent)

deliveryAgentRoutes.post("/register",roleBasedAccess(Role.DELIVERY_AGENT, Role.ADMIN, Role.SUPER_ADMIN), validateZodSchema(createDeliveryAgentZodSchema), deliveryAgentController.createDeliveryAgent)

deliveryAgentRoutes.patch("/update-availabe-status/:id", roleBasedAccess(Role.DELIVERY_AGENT, Role.ADMIN, Role.SUPER_ADMIN), validateZodSchema(udpateDeliveryAgentStatusZodSchema), deliveryAgentController.updateAvailableStatus)