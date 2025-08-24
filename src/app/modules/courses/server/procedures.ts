import { db } from "@/db";
import { category, courses } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { titleInsertSchema } from "../schema";
import { z } from "zod";
import { and, asc, eq } from "drizzle-orm";
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
