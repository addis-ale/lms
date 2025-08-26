import { db } from "@/db";
import { attachments, courses } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const attachmentsRoute = createTRPCRouter({
  create: protectedProcedure
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
  getMany: baseProcedure
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
  remove: protectedProcedure
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
});
