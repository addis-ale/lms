"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "../components/column";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { EmptyState } from "@/components/empty-state";
import { DataPagination } from "@/components/data-pagination";
import { useMyCourseFilter } from "../../hooks/use-course-filter";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

export const CourseView = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = useMyCourseFilter();
  const { data: myCourses } = useSuspenseQuery(
    trpc.courses.getMyCourse.queryOptions({ ...filters })
  );
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4 mt-8">
      <DataTable columns={columns} data={myCourses.items} />
      <DataPagination
        page={filters.page}
        totalPages={myCourses.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
      {myCourses.items.length === 0 && (
        <EmptyState
          title="Create your first course"
          description="You don’t have any courses yet. Start by creating your first course and begin sharing your knowledge."
        />
      )}
    </div>
  );
};
export const CourseViewLoading = () => {
  return (
    <LoadingState
      title="Loading Courses"
      description="This may take a few seconds"
    />
  );
};
export const CourseViewError = () => {
  return (
    <ErrorState
      title="Error Loading Courses"
      description="Something went wrong please try again..."
    />
  );
};
