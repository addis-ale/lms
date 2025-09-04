import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { SearchParams } from "nuqs";
import {
  CourseView,
  CourseViewError,
  CourseViewLoading,
} from "@/app/modules/courses/ui/views/courses-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { loadSearchParams } from "@/app/modules/courses/params";
interface Props {
  searchParams: Promise<SearchParams>;
}
const CoursePage = async ({ searchParams }: Props) => {
  const filters = await loadSearchParams(searchParams);
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.courses.getMyCourse.queryOptions({ ...filters })
  );
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<CourseViewLoading />}>
          <ErrorBoundary fallback={<CourseViewError />}>
            <CourseView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default CoursePage;
