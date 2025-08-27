import { z } from "zod";
export const chapterTitleInsertSchema = z.object({
  title: z.string(),
});
export const chapterDescriptionInsertSchema = z.object({
  description: z.string().min(1),
});
export const chapterAccessInsertSchema = z.object({
  isFree: z.boolean(),
});
export const chapterVideoInsertSchema = z.object({
  videoUrl: z.string().min(1),
});
