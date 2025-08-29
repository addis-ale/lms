import { coursesRoute } from "@/app/modules/courses/server/procedures/course";
import { createTRPCRouter } from "../init";
import { chaptersRoute } from "@/app/modules/chapters/server/procedures/chapters";
import { attachmentsRoute } from "@/app/modules/courses/server/procedures/attachments";
import { categoriesRoute } from "@/app/modules/courses/server/procedures/category";
import { browseCourseRoute } from "@/app/modules/dashboard/server/procedures/enrolled";

export const appRouter = createTRPCRouter({
  courses: coursesRoute,
  chapters: chaptersRoute,
  attachments: attachmentsRoute,
  categories: categoriesRoute,
  browseCourse: browseCourseRoute,
});
// export type definition of API
export type AppRouter = typeof appRouter;
