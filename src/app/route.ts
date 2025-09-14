import { Router } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
import { parcelRoutes } from "./modules/parcel/parcel.routes";
import { paymentRoutes } from "./modules/payment/payment.routes";

export const routes = Router()

const allRoutes = [
    {path: "/auth", route: authRoutes},
    {path: "/user", route: userRoutes},
    {path: "/parcel", route: parcelRoutes},
    {path: "/payment", route: paymentRoutes},
    // {path: "/delivery-agent", route: deliveryAgentRoutes},
]

allRoutes.forEach(({path, route}) => routes.use(path, route))