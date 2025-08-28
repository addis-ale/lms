import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";
export type CategoryGetMany =
  inferRouterOutputs<AppRouter>["categories"]["getMany"];
export type CategoryGetOne =
  inferRouterOutputs<AppRouter>["categories"]["getOne"];
export type MyCourseGetMany =
  inferRouterOutputs<AppRouter>["courses"]["getMyCourse"]["items"];
