import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes";
import { usersRoutes } from "./user-route";
import { postRoutes } from "./post-route";

export const allRoutes = new Hono();

allRoutes.route("/auth", authenticationRoutes);
allRoutes.route("/user", usersRoutes); 
allRoutes.route("/post", postRoutes);