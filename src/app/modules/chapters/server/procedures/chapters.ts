import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { chapters, courses, muxData } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { Mux } from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});
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
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
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
      const [toDeleteChapter] = await db
        .select()
        .from(chapters)
        .where(
          and(eq(chapters.id, input.id), eq(chapters.courseId, input.courseId))
        );

      if (!toDeleteChapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "chapter not found to delete.",
        });
      }
      if (toDeleteChapter.videoUrl) {
        const [existingMuxData] = await db
          .select({ assetId: muxData.assetId })
          .from(muxData)
          .where(eq(muxData.chapterId, toDeleteChapter.id));
        if (existingMuxData.assetId) {
          await mux.video.assets.delete(existingMuxData.assetId);
        }
      }
      const [deletedChapter] = await db
        .delete(chapters)
        .where(
          and(eq(chapters.id, input.id), eq(chapters.courseId, input.courseId))
        )
        .returning();
      const publishedChaptersIncourse = await db
        .select()
        .from(chapters)
        .where(
          and(
            eq(chapters.courseId, input.courseId),
            eq(chapters.isPublished, true)
          )
        );
      if (!publishedChaptersIncourse.length) {
        await db
          .update(courses)
          .set({
            isPublished: false,
          })
          .where(eq(courses.id, input.courseId));
      }
      return deletedChapter;
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
          description,
          isFree,
          videoUrl,
          isPublished,
        })
        .where(and(eq(chapters.id, id), eq(chapters.courseId, courseId)))
        .returning();
      if (!updatedChapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter not found",
        });
      }
      if (videoUrl) {
        const [existingMuxData] = await db
          .select()
          .from(muxData)
          .where(eq(muxData.chapterId, id));
        if (existingMuxData) {
          await mux.video.assets.delete(existingMuxData.assetId);
          await db.delete(muxData).where(eq(muxData.id, existingMuxData.id));
        }
        const asset = await mux.video.assets.create({
          inputs: [{ url: videoUrl }],
          playback_policy: ["public"],
          video_quality: "basic",
          test: false,
        });
        await db.insert(muxData).values({
          assetId: asset.id,
          chapterId: id,
          playbackId: asset.playback_ids?.[0]?.id,
        });
      }
      return updatedChapter;
    }),
  getMux: baseProcedure
    .input(
      z.object({
        chapterId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const [existingMuxData] = await db
        .select()
        .from(muxData)
        .where(eq(muxData.chapterId, input.chapterId));
      if (!existingMuxData) {
        return null;
      }
      return existingMuxData;
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
