import { db } from "@/db";
import { courses } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { titleInsertSchema } from "../schema";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
export const coursesRoute = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
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
          message: "Agent not found",
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
