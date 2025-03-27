import { prisma } from "../../extras/prisma";
import { type GetPostResult, type GetAllPost, 
    type CreatePostResult, type DeletePostResult, 
    GetPostError, GetAllPostError, CreatePostError, 
    DeletePostError } from "./posts-types";

//get all posts
export const GetAllPosts = async (): Promise<GetAllPost> => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: true
            }
        }
        );
        if (!posts) {
            throw GetAllPostError.NO_POST_FOUND;
        }
        const result: GetAllPost = {
            posts: posts,
        }
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
        }

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
        });

        const result: CreatePostResult = {  
            post: post,
        }

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
        }   

        return result;
    }
    catch (e) {
        console.error(e);
        throw DeletePostError.UNKNOWN;
    }   
};