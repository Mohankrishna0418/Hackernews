import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes";
import { usersRoutes } from "./user-route";
import { postRoutes } from "./post-route";
import { likeRoutes } from "./likes-route";
import { commentsRoutes } from "./comments-route"
import { swaggerUI } from "@hono/swagger-ui";
import { swaggerDocument } from "./swagger-doc";

export const allRoutes = new Hono();

allRoutes.get("/ui", swaggerUI({ url: "/docs" }));
allRoutes.route("/", swaggerDocument);
allRoutes.route("/auth", authenticationRoutes);
allRoutes.route("/user", usersRoutes); 
allRoutes.route("/post", postRoutes);
allRoutes.route("/like", likeRoutes);
allRoutes.route("/comment", commentsRoutes);