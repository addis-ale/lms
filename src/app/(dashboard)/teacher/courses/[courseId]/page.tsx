import { CourseIdView } from "@/app/modules/courses/ui/views/course-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
interface Props {
  params: Promise<{ courseId: string }>;
}

const Page = async ({ params }: Props) => {
  const { courseId } = await params;
  const queryClient = getQueryClient();
  await Promise.all([
    void queryClient.prefetchQuery(
      trpc.courses.getOne.queryOptions({ id: courseId })
    ),
    void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions()),
    void queryClient.prefetchQuery(
      trpc.attachments.getMany.queryOptions({ courseId })
    ),
    void queryClient.prefetchQuery(
      trpc.chapters.getMany.queryOptions({ courseId })
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading</p>}>
        <ErrorBoundary fallback={<p>error</p>}>
          <CourseIdView courseId={courseId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
