import { db } from "@/db";
import {
  chapters,
  courses,
  userProgress,
  category,
  purchase,
} from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, count, desc, eq, ilike, inArray } from "drizzle-orm";
import { z } from "zod";
const getProgress = async (userId: string, courseId: string) => {
  const publishedChapters = await db
    .select({ id: chapters.id })
    .from(chapters)
    .where(
      and(eq(chapters.courseId, courseId), eq(chapters.isPublished, true))
    );
  const publishedChapterIds = publishedChapters.map((ch) => ch.id);
  const [validCompletedChapters] = await db
    .select({ count: count() })
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        inArray(userProgress.chapterId, publishedChapterIds),
        eq(userProgress.isCompleted, true)
      )
    );
  const progressPercentage =
    (validCompletedChapters.count / publishedChapterIds.length) * 100;
  return progressPercentage;
};
export const browseCourseRoute = createTRPCRouter({
  //   getProgress: protectedProcedure
  //     .input(
  //       z.object({
  //         courseId: z.string(),
  //       })
  //     )
  //     .query(async ({ input, ctx }) => {
  //       const publishedChapters = await db
  //         .select({ id: chapters.id })
  //         .from(chapters)
  //         .where(
  //           and(
  //             eq(chapters.courseId, input.courseId),
  //             eq(chapters.isPublished, true)
  //           )
  //         );
  //       const publishedChapterIds = publishedChapters.map((ch) => ch.id);
  //       const [validCompletedChapters] = await db
  //         .select({ count: count() })
  //         .from(userProgress)
  //         .where(
  //           and(
  //             eq(userProgress.userId, ctx.auth.user.id),
  //             inArray(userProgress.chapterId, publishedChapterIds),
  //             eq(userProgress.isCompleted, true)
  //           )
  //         );
  //       const progressPercentage =
  //         (validCompletedChapters.count / publishedChapterIds.length) * 100;
  //       return progressPercentage;
  //     }),
  getMany: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        categoryId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { search, categoryId } = input;
      const conditions = [
        eq(courses.isPublished, true),
        categoryId ? eq(courses.categoryId, categoryId) : undefined,
        search ? ilike(courses.title, `%${search}%`) : undefined,
      ].filter(Boolean);
      const myCourses = await db
        .select({
          id: courses.id,
          title: courses.title,
          categoryName: category.name,
          imageUrl: courses.imageUrl,
          price: courses.price,
          purchasedId: purchase.id,
          createdAt: courses.createdAt,
        })
        .from(courses)
        .where(and(...conditions))
        .innerJoin(
          chapters,
          and(eq(chapters.courseId, courses.id), eq(chapters.isPublished, true))
        )
        .innerJoin(category, eq(category.id, courses.categoryId))
        .leftJoin(
          purchase,
          and(
            eq(purchase.userId, ctx.auth.user.id),
            eq(purchase.courseId, courses.id)
          )
        )
        .orderBy(desc(courses.createdAt));
      const courseWithProgress = await Promise.all(
        myCourses.map(async (course) => {
          const [{ chapterCount }] = await db
            .select({ chapterCount: count() })
            .from(chapters)
            .where(
              and(
                eq(chapters.courseId, course.id),
                eq(chapters.isPublished, true)
              )
            );
          let progress: number | null = null;
          if (course?.purchasedId) {
            progress = await getProgress(ctx.auth.user.id, course.id);
          }

          return {
            ...course,
            chapterCount,
            progress,
          };
        })
      );
      return courseWithProgress;
    }),
});
