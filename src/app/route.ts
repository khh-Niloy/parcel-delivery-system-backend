import { Router } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";

export const routes = Router()

const allRoutes = [
    {path: "/auth", route: authRoutes},
    {path: "/user", route: userRoutes},
]

allRoutes.forEach(({path, route}) => routes.use(path, route))