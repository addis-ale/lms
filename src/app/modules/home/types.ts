import { CourseWithProgress } from "./server/procedures/dashboard-course";

export interface GetManyDashboardCourses {
  completedCourses: CourseWithProgress[];
  coursesInProgress: CourseWithProgress[];
}
