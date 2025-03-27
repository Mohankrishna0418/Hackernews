import type { Post } from "@prisma/client";

export type GetPostResult = {
    post: Post
}

export enum GetPostError {
    UNKNOWN = "UNKNOWN",
    POST_NOT_FOUND = "POST_NOT_FOUND",
    POST_BEYOND_LIMIT = "POST_BEYOND_LIMIT",
}

export type GetAllPost = {
    posts: Post[]
}

export enum GetAllPostError {
    NO_POST_FOUND = "NO_POAT_FOUND",
    POST_BEYOND_LIMIT = "POST_BEYOND_LIMIT",
    UNKNOWN = "UNKNOWN",
}

export type CreatePostResult = {
    post: Post
}

export enum CreatePostError {
    UNKNOWN = "UNKNOWN",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    REQUIRED_FIELD_MISSING = "REQUIRED_FIELD_MISSING",
}   

export type DeletePostResult = {
    post: Post
}

export enum DeletePostError {
    UNKNOWN = "UNKNOWN",
    POST_NOT_FOUND = "POST_NOT_FOUND",
    USER_NOT_FOUND = "USER_NOT_FOUND",
}