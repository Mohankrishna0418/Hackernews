import { Hono } from "hono";
import { tokenmiddleware } from "./middleware/token-middleware";
import { DeleteLike, GetLike, PostLike} from "../controllers/likes/likes-controller";
import { GetLikeError, PostLikeError, DeleteLikeError } from "../controllers/likes/likes-types";
import { getPagination } from "../extras/pagination";
import { sessionMiddleware } from "./middleware/session-middleware";


export const likeRoutes = new Hono();

likeRoutes.get("/on/:postId", sessionMiddleware, async (context) => {
  try {
      const postId = context.req.param("postId");
      const userId = context.get("user").id; // get user from session
      const result = await GetLike({ postId, userId }); // pass userId also!
      if (!result) {
          return context.json({ error: "No likes found to the post!" }, 404);
      }
      return context.json(result, 200);
  } catch (error) {
      console.error(error);
      return context.json({ error: "Unknown error!" }, 500);
  }
});

//like a post
likeRoutes.post("/on/:postId", sessionMiddleware, async (context) => {
    try {
        const postId = context.req.param("postId");
        const userId = context.get("user").id;
        const result = await PostLike({ userId, postId });
        return context.json(result, 200);
    } catch (error) {
        if (error === PostLikeError.LIKE_ALREADY_EXISTS) {
            return context.json({ error: "Like already exists" }, 400);
        }
        if (error === PostLikeError.POST_NOT_FOUND) {
            return context.json({ error: "Post not found" }, 404);
        }
        return context.json({ error: "Unknown error" }, 500);
    }
});

//delete likes
likeRoutes.delete("/on/:postId", sessionMiddleware, async (context) => {
    try {
        const postId = context.req.param("postId");
        const userId = context.get("user").id;
        const result = await DeleteLike({ postId, userId });
        return context.json(result, 200);
    } catch (error) {
      if (error === DeleteLikeError.LIKE_NOT_FOUND) {
        return context.json({ error: "Like not found" }, 404);
        }
        if (error === DeleteLikeError.POST_NOT_FOUND) {
            return context.json({ error: "Post not found" }, 404);
        }
        if (error === DeleteLikeError.USER_NOT_FOUND) {
            return context.json({ error: "User not found" }, 404);
        }
        if (error === DeleteLikeError.UNKNOWN) {
            return context.json({ error: "Unknown error" }, 500);
        }
    }
});
