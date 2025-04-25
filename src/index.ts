import { serve } from "@hono/node-server";
import { allRoutes } from "./routes/route-index";


allRoutes.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(allRoutes, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
