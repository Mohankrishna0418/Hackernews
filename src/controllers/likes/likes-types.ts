import type { Like } from "@prisma/client";

export type GetLikeResult = { 
    like: Like[];
}

export enum GetLikeError {
    UNKNOWN = "UNKNOWN",
    POST_NOT_FOUND = "POST_NOT_FOUND",
    LIKE_NOT_FOUND = "LIKE_NOT_FOUND",
    POST_BEYOND_LIMIT = "POST_BEYOND_LIMIT",
}

export type PostLikeResult = { 
    like: Like;
}

export enum PostLikeError {
    UNKNOWN = "UNKNOWN",
    POST_NOT_FOUND = "POST_NOT_FOUND",
    LIKE_ALREADY_EXISTS = "LIKE_ALREADY_EXISTS",
}

export type DeleteLikeResult = { 
    like: Like;
}

export enum DeleteLikeError {
    UNKNOWN = "UNKNOWN",
    LIKE_NOT_FOUND = "LIKE_NOT_FOUND",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    POST_NOT_FOUND = "POST_NOT_FOUND",
}