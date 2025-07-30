import { Router } from "express";
import { authController } from "./auth.controller";
import { roleBasedAccess } from "../../middleware/roleBasedAccess";
import { Role } from "../user/user.interface";
import { validateZodSchema } from "../../middleware/validateZodSchema";
import { passwordChangeZodSchema } from "../user/user.validation";

export const authRoutes = Router()

authRoutes.post("/login", authController.userLogin)
authRoutes.post("/logout", authController.userLogOut)
authRoutes.patch("/change-password",validateZodSchema(passwordChangeZodSchema), roleBasedAccess(...Object.values(Role)), authController.changePassword)
authRoutes.post("/refresh-token", authController.getNewAccessToken)