import { prisma } from "../../extras/prisma";
import { type GetLikeResult, 
    type PostLikeResult, type DeleteLikeResult, 
    GetLikeError, PostLikeError, DeleteLikeError} from "./likes-types";

//get All like
export const GetLike = async (parameters: {
    postId: string;
    userId: string; // <-- Also pass userId from frontend
}): Promise<GetLikeResult> => {
    const { postId, userId } = parameters;

    const post = await prisma.post.findUnique({
        where: { id: postId },
    });
    if (!post) {
        throw GetLikeError.POST_NOT_FOUND;
    }

    const likes = await prisma.like.findMany({
        where: { postId },
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                },
            },
        },
    });

    const totalLikes = likes.length;

    const userHasLiked = likes.some((like) => like.userId === userId);

    return {
        totalLikes,
        userHasLiked,
        like: likes,
    };
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
// delete a like based on postId and userId
export const DeleteLike = async (parameters: {
    postId: string;
    userId: string;
}): Promise<DeleteLikeResult> => {
    try {
        const like = await prisma.like.findFirst({
            where: {
                postId: parameters.postId,
                userId: parameters.userId,
            },
        });

        if (!like) {
            throw DeleteLikeError.LIKE_NOT_FOUND;
        }

        const deletedLike = await prisma.like.delete({
            where: { id: like.id },
        });

        const result: DeleteLikeResult = {
            like: deletedLike,
        };

        return result;
    } catch (e) {
        console.error(e);
        throw DeleteLikeError.UNKNOWN;
    }
};
