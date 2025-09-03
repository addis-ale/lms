import { coursesRoute } from "@/app/modules/courses/server/procedures/course";
import { createTRPCRouter } from "../init";
import { chaptersRoute } from "@/app/modules/chapters/server/procedures/chapters";
import { attachmentsRoute } from "@/app/modules/courses/server/procedures/attachments";
import { categoriesRoute } from "@/app/modules/courses/server/procedures/category";
import { browseCourseRoute } from "@/app/modules/browser/server/procedures/browse-course";
import { paymentRoute } from "@/app/modules/courses/server/procedures/payment";

export const appRouter = createTRPCRouter({
  courses: coursesRoute,
  chapters: chaptersRoute,
  attachments: attachmentsRoute,
  categories: categoriesRoute,
  browseCourse: browseCourseRoute,
  payment: paymentRoute,
});
// export type definition of API
export type AppRouter = typeof appRouter;
