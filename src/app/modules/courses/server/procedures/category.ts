import { db } from "@/db";
import { category } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

export const categoriesRoute = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const categories = await db
      .select()
      .from(category)
      .orderBy(asc(category.name));
    return categories;
  }),
  getOne: protectedProcedure
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
});
