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
export const imageUrlInsertSchema = z.object({
  imageUrl: z.string().min(1, { message: "imageUrl is required" }),
});
export const categoryInsertSchema = z.object({
  categoryId: z.string().min(1, { message: "imageUrl is required" }),
});
