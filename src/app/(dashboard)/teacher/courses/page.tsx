import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { SearchParams } from "nuqs";
import { CourseView } from "@/app/modules/courses/ui/views/courses-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { loadSearchParams } from "@/app/modules/courses/params";
import { auth } from "@/lib/auth";
interface Props {
  searchParams: Promise<SearchParams>;
}
const CoursePage = async ({ searchParams }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  const filters = await loadSearchParams(searchParams);
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.courses.getMyCourse.queryOptions({ ...filters })
  );
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loaing</p>}>
          <ErrorBoundary fallback={<p>error</p>}>
            <CourseView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default CoursePage;
