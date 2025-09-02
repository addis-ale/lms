"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Categories } from "../components/categories";
import { useFilter } from "@/hooks/use-filter";
import CoursesList from "@/components/courses-list";

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
  return (
    <div className="mt-2 p-6 w-full space-y-4 md:space-y-6">
      <Categories categories={categories} />

      <CoursesList items={myCourses} />
    </div>
  );
};
