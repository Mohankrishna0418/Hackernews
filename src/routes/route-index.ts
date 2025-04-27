import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes";
import { usersRoutes } from "./user-route";
import { postRoutes } from "./post-route";
import { likeRoutes } from "./likes-route";
import { commentsRoutes } from "./comments-route"
import { swaggerUI } from "@hono/swagger-ui";
import { swaggerDocument } from "./swagger-doc";
import { cors } from "hono/cors";
import { authRoute } from "./middleware/session-middleware";

export const allRoutes = new Hono();

allRoutes.use(
    cors({
      origin: "http://localhost:4000",
      allowHeaders: ["Content-Type", "Authorization","token"],
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    })
  );
  

allRoutes.get("/ui", swaggerUI({ url: "/docs" }));
allRoutes.route("/", swaggerDocument);
allRoutes.route("/api/auth", authRoute)
allRoutes.route("/auth", authenticationRoutes);
allRoutes.route("/user", usersRoutes); 
allRoutes.route("/post", postRoutes);
allRoutes.route("/like", likeRoutes);
allRoutes.route("/comment", commentsRoutes);