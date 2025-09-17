import { Router } from "express";
import { validateZodSchema } from "../../middleware/validateZodSchema";
import { udpateDeliveryAgentStatusZodSchema, userRegisterZodSchema, userUpdateZodSchema } from "./user.validation";
import { roleBasedAccess } from "../../middleware/roleBasedAccess";
import { Role } from "./user.interface";
import { userController } from "./user.controller";

export const userRoutes = Router()

userRoutes.post("/register", validateZodSchema(userRegisterZodSchema), userController.userRegister)

userRoutes.patch("/:id", roleBasedAccess(...Object.values(Role)),validateZodSchema(userUpdateZodSchema), userController.updateUser)

userRoutes.get("/all-user",roleBasedAccess(Role.ADMIN, Role.SUPER_ADMIN), userController.getAllUser)

userRoutes.get("/get-me", roleBasedAccess(...Object.values(Role)), userController.getMe)

userRoutes.get("/all-delivery-agent", roleBasedAccess(Role.ADMIN, Role.SUPER_ADMIN), userController.getAllDeliveryAgent)

userRoutes.patch("/update-available-status/:id", roleBasedAccess(Role.DELIVERY_AGENT), validateZodSchema(udpateDeliveryAgentStatusZodSchema), userController.updateAvailableStatus)

