import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { titleInsertSchema } from "../../schema";
import { db } from "@/db";
import { chapters, courses, muxData } from "@/db/schema";
import { z } from "zod";
import { and, eq, inArray, isNotNull, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { Mux } from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});
export const coursesRoute = createTRPCRouter({
  create: protectedProcedure
    .input(titleInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdCourse] = await db
        .insert(courses)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();
      return createdCourse;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        categoryId: z.string().optional(),
        price: z.string().optional(),
        isPublished: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, isPublished, ...rest } = input;

      const updateData: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(rest)) {
        if (typeof value !== "undefined") {
          updateData[key] = value;
        }
      }

      const [course] = await db
        .select()
        .from(courses)
        .where(and(eq(courses.id, id), eq(courses.userId, ctx.auth.user.id)));

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      if (typeof isPublished !== "undefined") {
        if (isPublished) {
          const publishedChapters = await db
            .select()
            .from(chapters)
            .where(
              and(eq(chapters.courseId, id), eq(chapters.isPublished, true))
            );

          if (
            !(rest.title ?? course.title) ||
            !(rest.description ?? course.description) ||
            !(rest.categoryId ?? course.categoryId) ||
            !(rest.imageUrl ?? course.imageUrl) ||
            !(rest.price ?? course.price) ||
            publishedChapters.length === 0
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Missing required fields before publishing",
            });
          }
        }

        const [finalCourse] = await db
          .update(courses)
          .set({ isPublished })
          .where(eq(courses.id, id))
          .returning();

        return finalCourse;
      }

      const [updateCourse] = await db
        .update(courses)
        .set(updateData)
        .where(and(eq(courses.id, id), eq(courses.userId, ctx.auth.user.id)))
        .returning();

      return updateCourse;
    }),

  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [course] = await db
        .select()
        .from(courses)
        .where(
          and(eq(courses.id, input.id), eq(courses.userId, ctx.auth.user.id))
        );
      if (!course) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      }
      const courseChaptersWithVideoUrl = await db
        .select()
        .from(chapters)
        .where(
          and(
            eq(chapters.courseId, input.id),
            isNotNull(chapters.videoUrl),
            ne(chapters.videoUrl, "")
          )
        );

      if (courseChaptersWithVideoUrl.length) {
        const muxDatas = await db
          .select({ assetId: muxData.assetId })
          .from(muxData)
          .where(
            inArray(
              muxData.chapterId,
              courseChaptersWithVideoUrl.map((ch) => ch.id)
            )
          );

        if (muxDatas.length) {
          await Promise.all(
            muxDatas.map((data) => mux.video.assets.delete(data.assetId))
          );
        }
        await db.delete(muxData).where(
          inArray(
            muxData.chapterId,
            courseChaptersWithVideoUrl.map((ch) => ch.id)
          )
        );
      }
      await db.delete(chapters).where(eq(chapters.courseId, input.id));
      const [deleteCourse] = await db
        .delete(chapters)
        .where(eq(chapters.id, input.id))
        .returning();

      return deleteCourse;
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [existedCourse] = await db
        .select()
        .from(courses)
        .where(
          and(eq(courses.id, input.id), eq(courses.userId, ctx.auth.user.id))
        );
      if (!existedCourse) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      }
      return existedCourse;
    }),
});
