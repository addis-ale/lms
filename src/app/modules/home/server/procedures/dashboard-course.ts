import { db } from "@/db";
import {
  category,
  chapters,
  courses,
  purchase,
  userProgress,
} from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq, inArray, sql } from "drizzle-orm";

export type CourseWithProgress = typeof courses.$inferSelect & {
  category: typeof category.$inferSelect;
  progress: number;
  totalChapters: number;
  completedChapters: number;
};

export const dashboardCoursesRoute = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    // 1. Get purchased course IDs
    const purchased = await db
      .select({ courseId: purchase.courseId })
      .from(purchase)
      .where(eq(purchase.userId, ctx.auth.user.id));

    const purchasedCourseIds = purchased.map((c) => c.courseId);
    if (purchasedCourseIds.length === 0) {
      return { completedCourses: [], coursesInProgress: [] };
    }

    // 2. Get purchased courses with categories
    const purchasedCourses = await db
      .select({
        course: courses,
        category,
      })
      .from(courses)
      .where(
        and(
          eq(courses.isPublished, true),
          inArray(courses.id, purchasedCourseIds)
        )
      )
      .innerJoin(category, eq(category.id, courses.categoryId));

    // 3. Bulk progress calculation (per course)
    const progressData = await db
      .select({
        courseId: chapters.courseId,
        completedChapters: sql<number>`count(case when ${userProgress.isCompleted} = true then 1 end)`,
        totalChapters: sql<number>`count(${chapters.id})`,
      })
      .from(chapters)
      .leftJoin(
        userProgress,
        and(
          eq(userProgress.chapterId, chapters.id),
          eq(userProgress.userId, ctx.auth.user.id)
        )
      )
      .where(inArray(chapters.courseId, purchasedCourseIds))
      .groupBy(chapters.courseId);

    const progressMap = Object.fromEntries(
      progressData.map((p) => [
        p.courseId,
        {
          completedChapters: Number(p.completedChapters) || 0,
          totalChapters: Number(p.totalChapters) || 0,
          progress:
            p.totalChapters > 0
              ? Math.round(
                  (Number(p.completedChapters) / Number(p.totalChapters)) * 100
                )
              : 0,
        },
      ])
    );

    // 4. Attach progress to each course
    const courseWithProgress: CourseWithProgress[] = purchasedCourses.map(
      (c) => {
        const progressInfo = progressMap[c.course.id] ?? {
          completedChapters: 0,
          totalChapters: 0,
          progress: 0,
        };

        return {
          ...c.course,
          category: c.category,
          progress: progressInfo.progress,
          totalChapters: progressInfo.totalChapters,
          completedChapters: progressInfo.completedChapters,
        };
      }
    );

    // 5. Split into completed vs in-progress
    const completedCourses = courseWithProgress.filter(
      (c) => c.progress === 100
    );
    const coursesInProgress = courseWithProgress.filter(
      (c) => c.progress < 100
    );

    return { completedCourses, coursesInProgress };
  }),
});
