import { Router } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
import { parcelRoutes } from "./modules/parcel/parcel.routes";

export const routes = Router()

const allRoutes = [
    {path: "/auth", route: authRoutes},
    {path: "/user", route: userRoutes},
    {path: "/parcel", route: parcelRoutes},
]

allRoutes.forEach(({path, route}) => routes.use(path, route))