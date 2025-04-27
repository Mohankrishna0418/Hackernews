import { Hono } from "hono";
import { tokenmiddleware } from "./middleware/token-middleware";
import { GetAllPosts, GetPost, CreatePost, DeletePost } from "../controllers/posts/posts-controller";
import { GetAllPostError, GetPostError, CreatePostError, DeletePostError } from "../controllers/posts/posts-types";
import { getPagination } from "../extras/pagination";
import { sessionMiddleware } from "./middleware/session-middleware";


export const postRoutes = new Hono();

//get single post
postRoutes.get("/:id", sessionMiddleware, async (context) => {
    try {
        const postId = context.req.param("id");
        const result = await GetPost({ postId });
        if (!result) {
            return context.json({ error: "Post not found" }, 404);
        }
        return context.json(result, 200);
    } catch (error) {
        if (error === GetPostError.POST_NOT_FOUND) {
            return context.json({ error: "Post not found" }, 404);
        }
        if (error === GetPostError.UNKNOWN) {
            return context.json({ error: "Unknown error" }, 500);   
        }
    }
});
    
//get all posts
postRoutes.get("", async (context) => {
    try {
      const { page, limit } = getPagination(context);
      const result = await GetAllPosts({ page, limit });
      if (!result) {
        return context.json({ error: "No posts found in the system!" }, 404);
      }
      return context.json(result, 200);
    } catch (error) {
      if (error === GetAllPostError.NO_POST_FOUND) {
        return context.json({ error: "No posts found in the system!" }, 404);
      }
      if (error === GetAllPostError.POST_BEYOND_LIMIT) {
        return context.json({ error: "No posts found on the requested page!" }, 404);
      }
      return context.json({ error: "Unknown error!" }, 500);
    }
  });

//create post
postRoutes.post("/", sessionMiddleware, async (context) => {
    try {
        const userId = context.get("user").id;
        const { title, content } = await context.req.json();
        const result = await CreatePost({ userId, title, content });
        return context.json(result, 200);
    } catch (error) {
        if (error === CreatePostError.USER_NOT_FOUND) {
            return context.json({ error: "User not found" }, 404);
        }
        if (error === CreatePostError.REQUIRED_FIELD_MISSING) {
            return context.json({ error: "Required field missing" }, 400);
        }
        if (error === CreatePostError.UNKNOWN) {
            return context.json({ error: "Unknown error" }, 500);
        }
    }
});  

//delete post
postRoutes.delete("/:id", sessionMiddleware, async (context) => {
    try {
        const postId = context.req.param("id");
        const result = await DeletePost({ postId });
        return context.json(result, 200);
    } catch (error) {
        if (error === DeletePostError.POST_NOT_FOUND) {
            return context.json({ error: "Post not found" }, 404);
        }
        if (error === DeletePostError.USER_NOT_FOUND) {
            return context.json({ error: "User not found" }, 404);
        }
        if (error === DeletePostError.UNKNOWN) {
            return context.json({ error: "Unknown error" }, 500);
        }
    }
});
