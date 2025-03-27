import { LoginWithUsernameAndPasswordError, SignupError, type SignUpWithUsernameAndPasswordResponseResult, type LoginWithUsernameAndPassword } from "./authentication-types";
import jwt from "jsonwebtoken";
import { prisma } from "../../extras/prisma";
import { createHash } from "crypto";    
import { jwtsecretkey } from "../../../environment";



const createJWToken = (parameters: { id: string; username: string }): string => {
    // Generate tokenLoginWithUsernameAndPassword
    const jwtPayload: jwt.JwtPayload = {
      iss: "https://purpleshorts.co.in",
      sub: parameters.id,
      username: parameters.username,
    };
  
    const token = jwt.sign(jwtPayload, jwtsecretkey, {
      expiresIn: "30d",
    });
  
    return token;
  };
export const createPasswordHash = (parameters: {
    password: string}): string =>
         { return createHash("sha256").update(parameters.password).digest("hex");
};


export const signUpWithUsernameAndPasswordResponseResult = async (parameters: {
    username: string,
    password: string
}): Promise<SignUpWithUsernameAndPasswordResponseResult> => {
    try{
        const existingUser = await prisma.user.findUnique({
            where: {
                username: parameters.username,
            },
        });

        if (existingUser) {
            throw SignupError.CONFLICTING_USERNAME;
        }

        const passwordHash = createPasswordHash({
            password: parameters.password
        });

        const user = await prisma.user.create({
            data: {
                username: parameters.username,
                password: passwordHash,
            },
        });

        const jwtPayload = {
            iss: "https://purpleshoy.co.in",
            sub: user.id,
            username: user.username,
        };

        const token = jwt.sign(jwtPayload, jwtsecretkey, {
            expiresIn: "30d",
        });

        const result: SignUpWithUsernameAndPasswordResponseResult = {
            token,
            user,
        };
        return result;
    } catch (e) {
        console.error(e);
        throw SignupError.UNKNOWN;
    }
};


export const loginWithUsernameAndPassword = async (parameters: {
    username: string;
    password: string;
}): Promise<LoginWithUsernameAndPassword> => {
        const passwordHash = createPasswordHash({
            password: parameters.password,
        });

        const user = await prisma.user.findUnique({
            where: {
                username: parameters.username,
                password: passwordHash,
            },
        });
        if (!user) {
            throw LoginWithUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD;
        }

        const token = createJWToken({
            id: user.id,
            username: user.username,
        });

        return {
            token,
            user,
        }
    
}