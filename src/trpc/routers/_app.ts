import { createTRPCRouter } from "../init";
import { coursesRoute } from "@/app/modules/courses/server/procedures";
export const appRouter = createTRPCRouter({
  courses: coursesRoute,
});
// export type definition of API
export type AppRouter = typeof appRouter;
