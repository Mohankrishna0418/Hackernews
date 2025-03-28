import { prisma } from "../../extras/prisma";
import { type GetLikeResult, 
    type PostLikeResult, type DeleteLikeResult, 
    GetLikeError, PostLikeError, DeleteLikeError} from "./likes-types";

//get All like
export const GetLike = async (parameters: {
    postId: string;
    page: number;
    limit: number;
}): Promise<GetLikeResult> => {
    const { postId, page, limit } = parameters;
    const post = await prisma.post.findUnique({
        where: { id: parameters.postId },
    });
    if (!post){
        throw GetLikeError.POST_NOT_FOUND;
    }
        // First we will check if there are any users at all
        const totalUsers = await prisma.like.count();
        if (totalUsers === 0) {
            throw GetLikeError.LIKE_NOT_FOUND;
        }
        const totalPages = Math.ceil(totalUsers / limit);
        if (page > totalPages) {
            throw GetLikeError.POST_BEYOND_LIMIT;
        }
    try {
        
        const like = await prisma.like.findMany({
            where: {postId},
            orderBy: { createdAt: "desc" },
            include: {
                user: true
            }
        });

        if (!like) {
            throw GetLikeError.LIKE_NOT_FOUND;
        }

        const result: GetLikeResult = {
            like: like,
        }

        return result;
    } catch (e) {
        console.error(e);
        throw GetLikeError.UNKNOWN;
    }
};


//post likes
export const PostLike = async (parameters: {
    userId: string;
    postId: string;
}): Promise<PostLikeResult> => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: parameters.postId },
        });

        if (!post) {
            throw PostLikeError.POST_NOT_FOUND;
        }
        
        const existingLike = await prisma.like.findFirst({
            where: {
                userId: parameters.userId,
                postId: parameters.postId,
            },
        });

        if (existingLike) {
            throw PostLikeError.LIKE_ALREADY_EXISTS;
        }

        const like = await prisma.like.create({
            data: {
                userId: parameters.userId,
                postId: parameters.postId,
            },
        });

        const result: PostLikeResult = {
            like: like,
        }   

        return result;
    } catch (e) {
        if (e === PostLikeError.POST_NOT_FOUND) {
            throw e;
        }

        if (e === PostLikeError.LIKE_ALREADY_EXISTS) {
            throw e;
        }

        console.error(e);
        throw PostLikeError.UNKNOWN;
    }
};
export const DeleteLike = async (parameters: {
    postId: string;
    userId: string;
}): Promise<DeleteLikeResult> => {
    try {
        const like = await prisma.like.delete({
            where: { id: parameters.postId,
            },
        });

        if (!like) {
            throw DeleteLikeError.LIKE_NOT_FOUND;
        }

        const result: DeleteLikeResult = {
            like: like,
        }   

        return result;
    }
    catch (e) {
        if (e === DeleteLikeError.LIKE_NOT_FOUND){
            throw e;
        }
        if (e === DeleteLikeError.POST_NOT_FOUND){
            throw e;
        }
        console.error(e);
        throw DeleteLikeError.UNKNOWN;
    }   
};
