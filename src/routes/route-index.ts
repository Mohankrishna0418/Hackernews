import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import { swaggerDocument } from "./swagger-doc";
import { authenticationRoutes } from "./authentication-routes";
import { usersRoutes } from "./user-route";
import { postsRoutes } from "./post-route";
import { likesRoutes } from "./likes-route";
import { commentsRoutes } from "./comments-route";
import { authRoute } from "./middleware/session-middleware";
import { cors } from "hono/cors";

export const allRoutes = new Hono();

allRoutes.use(
  cors({
    origin: ["http://localhost:4000"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization", "token"],
  })
);

allRoutes.get("/ui", swaggerUI({ url: "/docs" }));
allRoutes.route("/", swaggerDocument);
allRoutes.route("/api/auth", authRoute);
allRoutes.route("/auth", authenticationRoutes);
allRoutes.route("/users", usersRoutes);
allRoutes.route("/posts", postsRoutes);
allRoutes.route("/likes", likesRoutes);
allRoutes.route("/comments", commentsRoutes);