import { z } from "zod";
export const chapterTitleInsertSchema = z.object({
  title: z.string(),
});
export const chapterDescriptionInsertSchema = z.object({
  description: z.string().min(1),
});
