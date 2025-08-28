import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type getManyCategories =
  inferRouterOutputs<AppRouter>["categories"]["getMany"];
