import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes";
import { usersRoutes } from "./user-route";
import { postRoutes } from "./post-route";
import { likeRoutes } from "./likes-route";
import { commentsRoutes } from "./comments-route"

export const allRoutes = new Hono();

allRoutes.route("/auth", authenticationRoutes);
allRoutes.route("/user", usersRoutes); 
allRoutes.route("/post", postRoutes);
allRoutes.route("/like", likeRoutes);
allRoutes.route("/comment", commentsRoutes);