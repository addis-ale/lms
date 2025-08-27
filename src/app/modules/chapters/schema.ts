import { z } from "zod";
export const chapterTitleInsertSchema = z.object({
  title: z.string(),
});
