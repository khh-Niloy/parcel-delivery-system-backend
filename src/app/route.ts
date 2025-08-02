import { Router } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
import { parcelRoutes } from "./modules/parcel/parcel.routes";
// import { deliveryAgentRoutes } from "./modules/deliveryAgent/deliveryAgent.routes";

export const routes = Router()

const allRoutes = [
    {path: "/auth", route: authRoutes},
    {path: "/user", route: userRoutes},
    {path: "/parcel", route: parcelRoutes},
    // {path: "/delivery-agent", route: deliveryAgentRoutes},
]

allRoutes.forEach(({path, route}) => routes.use(path, route))