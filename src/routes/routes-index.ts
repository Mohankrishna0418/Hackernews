import { Hono } from "hono";
import { authenticationRoutes } from "./authentication/authentication-routes";
import { usersRoutes } from "./users/users-routes";
import { postsRoutes } from "./posts/posts-routes";
import { likesRoutes } from "./likes/likes-routes";
import { commentsRoutes } from "./comments/comments-routes";
import { authRoute } from "./middleware/session-middleware";
import { cors } from "hono/cors";

export const allRoutes = new Hono();

allRoutes.use(
  cors({
    // origin: "http://localhost:4000",
    origin: ["http://localhost:4000"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization", "token"],
    exposeHeaders: ["Set-Cookie"],
    maxAge: 600,
  })
);

allRoutes.route("/api/auth", authRoute);
allRoutes.route("/auth", authenticationRoutes);
allRoutes.route("/users", usersRoutes);
allRoutes.route("/posts", postsRoutes);
allRoutes.route("/likes", likesRoutes);
allRoutes.route("/comments", commentsRoutes);