import type { User } from "@prisma/client"

export type SignUpWithUsernameAndPasswordResponseResult = {
    token: string;
    user: User;
};

export enum SignupError {
    CONFLICTING_USERNAME = "CONFLICTING_USERNAME",
    UNKNOWN = "UNKNOWN",
};

export type LoginWithUsernameAndPassword = {
    token: string;
    user: User;
};

export enum LoginWithUsernameAndPasswordError {
    INCORRECT_USERNAME_OR_PASSWORD = "INCORRECT_USERNAME_OR_PASSWORD",
    UNKNOWN = "UNKNOWN", 
};