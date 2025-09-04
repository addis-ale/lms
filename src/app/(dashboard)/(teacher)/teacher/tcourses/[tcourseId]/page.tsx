import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CourseIdView } from "@/app/modules/courses/ui/views/course-id-view";
import { BackLink } from "@/components/back-link";
import { getQueryClient, trpc } from "@/trpc/server";
interface Props {
  params: Promise<{ tcourseId: string }>;
}

const Page = async ({ params }: Props) => {
  const { tcourseId } = await params;

  const queryClient = getQueryClient();
  await Promise.all([
    void queryClient.prefetchQuery(
      trpc.courses.getOne.queryOptions({ id: tcourseId })
    ),
    void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions()),
    void queryClient.prefetchQuery(
      trpc.attachments.getMany.queryOptions({ courseId: tcourseId })
    ),
    void queryClient.prefetchQuery(
      trpc.chapters.getMany.queryOptions({ courseId: tcourseId })
    ),
  ]);

  return (
    <>
      <BackLink href="/teacher/tcourses" label="Back to my courses" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading</p>}>
          <ErrorBoundary fallback={<p>error</p>}>
            <CourseIdView courseId={tcourseId} />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default Page;
