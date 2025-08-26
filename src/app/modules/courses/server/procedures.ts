import { db } from "@/db";
import { attachments, category, chapters, courses } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { titleInsertSchema } from "../schema";
import { z } from "zod";
import { and, asc, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
export const coursesRoute = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        categoryId: z.string().optional(),
        price: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updatedCourse] = await db
        .update(courses)
        .set(input)
        .where(
          and(eq(courses.id, input.id), eq(courses.userId, ctx.auth.user.id))
        )
        .returning();
      if (!updatedCourse) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }
      return updatedCourse;
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
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }
      return existedCourse;
    }),
  getManyCategory: baseProcedure.query(async () => {
    const categories = await db
      .select()
      .from(category)
      .orderBy(asc(category.name));

    return categories;
  }),
  getOneCategory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const [courseCategory] = await db
        .select()
        .from(category)
        .where(and(eq(category.id, input.id)));
      if (!courseCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No category found",
        });
      }
      return courseCategory;
    }),
  createCourseChapter: protectedProcedure
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
      const newPosition = lastChapter ? lastChapter?.position ?? 0 + 1 : 1;
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
  getCourseChapters: baseProcedure
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
        .orderBy(desc(chapters.position));
      return courseChapters;
    }),
  getCourseAttachments: baseProcedure
    .input(
      z.object({
        courseId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const courseAttachements = await db
        .select()
        .from(attachments)
        .where(eq(attachments.courseId, input.courseId))
        .orderBy(desc(attachments.name));
      return courseAttachements;
    }),
  createAttachments: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        name: z.string(),
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
      const [createdAttachment] = await db
        .insert(attachments)
        .values({
          courseId: input.courseId,
          name: input.name,
          url: input.url,
        })
        .returning();
      return createdAttachment;
    }),
  removeAttachment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [attachment] = await db
        .select({
          courseId: attachments.courseId,
        })
        .from(attachments)
        .where(eq(attachments.id, input.id));
      if (!attachment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Attachment not found",
        });
      }
      const [course] = await db
        .select({
          userId: courses.userId,
        })
        .from(courses)
        .where(
          and(
            eq(courses.id, attachment.courseId),
            eq(courses.userId, ctx.auth.user.id)
          )
        );
      if (!course) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      }
      const [removed] = await db
        .delete(attachments)
        .where(eq(attachments.id, input.id))
        .returning();
      return removed;
    }),
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
});
