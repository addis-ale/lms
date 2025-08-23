import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";
export type CategoryGetMany =
  inferRouterOutputs<AppRouter>["courses"]["getManyCategory"];
export type CategoryGetOne =
  inferRouterOutputs<AppRouter>["courses"]["getOneCategory"];
