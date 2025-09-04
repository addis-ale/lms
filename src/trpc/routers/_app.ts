import { coursesRoute } from "@/app/modules/courses/server/procedures/course";
import { createTRPCRouter } from "../init";
import { chaptersRoute } from "@/app/modules/chapters/server/procedures/chapters";
import { attachmentsRoute } from "@/app/modules/courses/server/procedures/attachments";
import { categoriesRoute } from "@/app/modules/courses/server/procedures/category";
import { browseCourseRoute } from "@/app/modules/browser/server/procedures/browse-course";
import { paymentRoute } from "@/app/modules/courses/server/procedures/payment";
import { dashboardCoursesRoute } from "@/app/modules/home/server/procedures/dashboard-course";
import { analyticsRoute } from "@/app/modules/courses/server/procedures/analytics";

export const appRouter = createTRPCRouter({
  courses: coursesRoute,
  chapters: chaptersRoute,
  attachments: attachmentsRoute,
  categories: categoriesRoute,
  browseCourse: browseCourseRoute,
  payment: paymentRoute,
  dashboardCourse: dashboardCoursesRoute,
  analytics: analyticsRoute,
});
// export type definition of API
export type AppRouter = typeof appRouter;
