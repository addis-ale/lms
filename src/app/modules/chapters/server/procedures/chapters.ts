import { db } from "@/db";
import { chapters, courses } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";

export const chaptersRoute = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [course] = await db
        .select({
          userId: courses.userId,
        })
        .from(courses)
        .where(
          and(
            eq(courses.id, input.courseId),
            eq(courses.userId, ctx.auth.user.id)
          )
        );
      if (!course) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      }
      const [lastChapter] = await db
        .select({
          position: chapters.position,
        })
        .from(chapters)
        .where(eq(chapters.courseId, input.courseId))
        .orderBy(desc(chapters.position))
        .limit(1);
      const newPosition = lastChapter ? (lastChapter?.position ?? 0) + 1 : 0;

      const [createdChapter] = await db
        .insert(chapters)
        .values({
          title: input.title,
          courseId: input.courseId,
          position: newPosition,
        })
        .returning();
      return createdChapter;
    }),
  getMany: baseProcedure
    .input(
      z.object({
        courseId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const courseChapters = await db
        .select()
        .from(chapters)
        .where(eq(chapters.courseId, input.courseId))
        .orderBy(asc(chapters.position));
      return courseChapters;
    }),
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
        courseId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const [courseChapter] = await db
        .select()
        .from(chapters)
        .where(
          and(eq(chapters.id, input.id), eq(chapters.courseId, input.courseId))
        );
      if (!courseChapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter not found",
        });
      }
      return courseChapter;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        courseId: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        videoUrl: z.string().optional(),
        isPublished: z.boolean().optional(),
        isFree: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        courseId,
        title,
        description,
        videoUrl,
        isPublished,
        isFree,
      } = input;
      const [course] = await db
        .select({ userId: courses.userId })
        .from(courses)
        .where(
          and(eq(courses.id, courseId), eq(courses.userId, ctx.auth.user.id))
        );
      if (!course) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      }
      const [updatedChapter] = await db
        .update(chapters)
        .set({
          title,
        })
        .where(and(eq(chapters.id, id), eq(chapters.courseId, courseId)))
        .returning();
      if (!updatedChapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter not found",
        });
      }
      return updatedChapter;
    }),
  reorder: protectedProcedure
    .input(
      z.object({
        orders: z.array(
          z.object({
            id: z.string(),
            position: z.number(),
          })
        ),
        courseId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [course] = await db
        .select({ userId: courses.userId })
        .from(courses)
        .where(
          and(
            eq(courses.id, input.courseId),
            eq(courses.userId, ctx.auth.user.id)
          )
        );
      if (!course) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      }
      const chapterIds = input.orders.map((c) => c.id);
      const validChapters = await db
        .select({ id: chapters.id })
        .from(chapters)
        .where(
          and(
            inArray(chapters.id, chapterIds),
            eq(chapters.courseId, input.courseId)
          )
        );

      if (validChapters.length !== chapterIds.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid chapter IDs",
        });
      }

      // Update positions in parallel
      await Promise.all(
        input.orders.map(({ id, position }) =>
          db.update(chapters).set({ position }).where(eq(chapters.id, id))
        )
      );

      return { success: true };
    }),
});
