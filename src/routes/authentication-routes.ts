import { Hono } from "hono";
import { loginWithUsernameAndPassword , signUpWithUsernameAndPasswordResponseResult } from 
"../controllers/authentication/authentication-controller";
import { LoginWithUsernameAndPasswordError , SignupError } from 
"../controllers/authentication/authentication-types";

export const authenticationRoutes = new Hono();


authenticationRoutes.post("/sign-up", async (c) => {
    const { username, password } = await c.req.json();
    try {
        const result = await signUpWithUsernameAndPasswordResponseResult({ username, password });
        return c.json({ data: result });
    } catch (error) {
        if (error === SignupError.CONFLICTING_USERNAME) {
            return c.json({ error: "Username already exists" }, 409);
        }
        if (error === SignupError.UNKNOWN) {
            return c.json({ error: "Unknown error" }, 500);
        };
    }
});

authenticationRoutes.post("/log-in", async (c) => {
    try {
      const { username, password } = await c.req.json();
  
      const result = await loginWithUsernameAndPassword({
        username,
        password,
      });
      return c.json({ data: result }, 200);
    } catch (error) {
      if (error === LoginWithUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD) {
        return c.json({ error: "Incorrect username or password" }, 401);
      }
      if (error === LoginWithUsernameAndPasswordError.UNKNOWN) {
        return c.json({ error: "Unknown error" }, 500);
      };
    }
  });