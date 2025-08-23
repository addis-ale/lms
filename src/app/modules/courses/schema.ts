import { z } from "zod";
export const titleInsertSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});
export const corseTitleUpdateSchema = titleInsertSchema.extend({
  id: z.string().min(1, { message: "Id is required" }),
});
export const descriptionInsertSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});
export const courseDescriptionUpdateSchema = descriptionInsertSchema.extend({
  id: z.string().min(1, { message: "Id is required" }),
});
