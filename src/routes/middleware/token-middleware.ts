import { createMiddleware } from "hono/factory";
import jwt from "jsonwebtoken";
import { jwtsecretkey as seckey } from "../../../environment";

export const tokenmiddleware = createMiddleware<{

    Variables: { userId: string };
}>(async (c, next) => {
    const token = c.req.header("token");
    if (!token) {
        return c.json({ error: "Missing Token" }, 401);
    }
    
    try {
        const payload = jwt.verify(token, seckey) as jwt.JwtPayload;

        const userId = payload.sub;

        if (userId){
            c.set("userId", userId)
        }
    } catch (error) {   
        return c.json({ error: "Unauthorized" }, 401);  
    }

    await next();
})