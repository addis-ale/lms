import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type getManyCategories =
  inferRouterOutputs<AppRouter>["categories"]["getMany"];
export type GetManyCourses =
  inferRouterOutputs<AppRouter>["browseCourse"]["getMany"];
export type GetOneCourse = GetManyCourses[number];
