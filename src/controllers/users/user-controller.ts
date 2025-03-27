import { prisma } from "../../extras/prisma";
import { GetMeError, type GetMeResult, type GetAllUsersResult, GetAllUsersError } from "./user-types";


export const GetMe = async (parameters: {
    userId: string;
}): Promise<GetMeResult> => {
    try {
        const user = await prisma.user.findUnique({
        where: { id: parameters.userId },
    });

        if (!user) {
            throw GetMeError.USER_NOT_FOUND;
        }

        const result: GetMeResult = {
            user: user,
        }

        return result;
    } catch (e) {
        console.error(e);
        throw GetMeError.UNKNOWN;
    }
}

export const GetAllUsers = async (parameters: {
        page: number;
        limit: number;
      }): Promise<GetAllUsersResult> => {
        try {
          const { page, limit } = parameters;
          const skip = (page - 1) * limit;
      
          // First we will check if there are any users at all
          const totalUsers = await prisma.user.count();
          if (totalUsers === 0) {
            throw GetAllUsersError.NO_USERS_FOUND;
          }
      
          // Then we will check if the requested page exists
          const totalPages = Math.ceil(totalUsers / limit);
          if (page > totalPages) {
            throw GetAllUsersError.PAGE_BEYOND_LIMIT;
          }
      
          const users = await prisma.user.findMany({
            orderBy: { name: "asc" },
            skip,
            take: limit,
          });
      
          return { users };
        } catch (e) {
          console.error(e);
          if (
            e === GetAllUsersError.NO_USERS_FOUND ||
            e === GetAllUsersError.PAGE_BEYOND_LIMIT
          ) {
            throw e;
          }
          throw GetAllUsersError.UNKNOWN;
        }
      };