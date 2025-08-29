"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Categories } from "../components/categories";
import { useFilter } from "@/hooks/use-filter";

export const BrowserView = () => {
  const [filter] = useFilter();
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions()
  );
  const { data: myCourses } = useSuspenseQuery(
    trpc.browseCourse.getMany.queryOptions({
      search: filter.search,
      categoryId: filter.category,
    })
  );
  console.log(myCourses);
  return (
    <div className="mt-8 p-6 w-full">
      <Categories categories={categories} />
    </div>
  );
};
