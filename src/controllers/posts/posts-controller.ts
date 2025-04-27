import { prisma } from "../../extras/prisma";
import type { Context } from "hono";
import {
  type GetPostResult,
  type GetAllPost,
  type CreatePostResult,
  type DeletePostResult,
  GetPostError,
  GetAllPostError,
  CreatePostError,
  DeletePostError,
} from "./posts-types";

//get all posts
export const GetAllPosts = async (parameters: {
  page: number;
  limit: number;
}): Promise<GetAllPost> => {
  const { page, limit } = parameters;
  // First we will check if there are any users at all
  const totalUsers = await prisma.user.count();
  if (totalUsers === 0) {
    throw GetAllPostError.NO_POST_FOUND;
  }

  // Then we will check if the requested page exists
  const totalPages = Math.ceil(totalUsers / limit);
  if (page > totalPages) {
    throw GetAllPostError.POST_BEYOND_LIMIT;
  }
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: {
          select: {
            username: true,
            name: true,
          },
        },
      },
    });
    if (!posts) {
      throw GetAllPostError.NO_POST_FOUND;
    }
    const result: GetAllPost = {
      posts: posts,
    };
    return result;
  } catch (e) {
    console.error(e);
    throw GetAllPostError.UNKNOWN;
  }
};

//get single post
export const GetPost = async (parameters: {
  postId: string;
}): Promise<GetPostResult> => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parameters.postId },
    });

    if (!post) {
      throw GetPostError.POST_NOT_FOUND;
    }

    const result: GetPostResult = {
      post: post,
    };

    return result;
  } catch (e) {
    console.error(e);
    throw GetPostError.UNKNOWN;
  }
};

//create post
export const CreatePost = async (parameters: {
  title: string;
  content: string;
  userId: string;
}): Promise<CreatePostResult> => {
  try {
    const post = await prisma.post.create({
      data: {
        title: parameters.title,
        content: parameters.content,
        userId: parameters.userId,
      },
      include: {
        user: {
          select: {
            username: true,
            name: true,
          },
        },
    },
    });

    const result: CreatePostResult = {
      post: post,
    };

    return result;
  } catch (e) {
    console.error(e);
    throw CreatePostError.UNKNOWN;
  }
};

//delete post
export const DeletePost = async (parameters: {
  postId: string;
}): Promise<DeletePostResult> => {
  try {
    const post = await prisma.post.delete({
      where: { id: parameters.postId },
    });

    if (!post) {
      throw DeletePostError.POST_NOT_FOUND;
    }

    const result: DeletePostResult = {
      post: post,
    };

    return result;
  } catch (e) {
    console.error(e);
    throw DeletePostError.UNKNOWN;
  }
};
