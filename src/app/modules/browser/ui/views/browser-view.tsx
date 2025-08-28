"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Categories } from "../components/categories";

export const BrowserView = () => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions()
  );
  return (
    <div className="mt-8 p-6 w-full">
      <Categories categories={categories} />
    </div>
  );
};
