import { Hono } from "hono";
import { tokenmiddleware } from "./middleware/token-middleware";
import { DeleteLike, GetLike, PostLike} from "../controllers/likes/likes-controller";
import { GetLikeError, PostLikeError, DeleteLikeError } from "../controllers/likes/likes-types";
import { getPagination } from "../extras/pagination";


export const likeRoutes = new Hono();


//get all likes to a post
likeRoutes.get("/on/:postId", tokenmiddleware, async (context) => {
    try {
          const postId = context.req.param("postId")
          const { page, limit } = getPagination(context);
          const result = await GetLike({ postId, page, limit });
          if (!result) {
            return context.json({ error: "No likes found to the post!" }, 404);
          }
          return context.json(result, 200);
        } catch (error) {
          if (error === GetLikeError.POST_NOT_FOUND) {
            return context.json({ error: "No likes found to the post!" }, 404);
          }
          if (error === GetLikeError.POST_NOT_FOUND) {
            return context.json({ error: "No posts found on the requested page!" }, 404);
          }
          return context.json({ error: "Unknown error!" }, 500);
        }
      });



//like a post
likeRoutes.post("/on/:postId", tokenmiddleware, async (context) => {
    try {
        const postId = context.req.param("postId");
        const userId = context.get("userId");
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
likeRoutes.delete("/on/:postId", tokenmiddleware, async (context) => {
    try {
        const postId = context.req.param("postId");
        const userId = context.get("userId");
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
