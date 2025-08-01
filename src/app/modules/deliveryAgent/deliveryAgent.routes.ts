import { Router } from "express";
import { roleBasedAccess } from "../../middleware/roleBasedAccess";
import { validateZodSchema } from "../../middleware/validateZodSchema";
import { createDeliveryAgentZodSchema } from "./deliveryAgent.validation";
import { deliveryAgentController } from "./deliveryAgent.controller";


export const deliveryAgentRoutes = Router()

deliveryAgentRoutes.post("/register", validateZodSchema(createDeliveryAgentZodSchema), deliveryAgentController.createDeliveryAgent)