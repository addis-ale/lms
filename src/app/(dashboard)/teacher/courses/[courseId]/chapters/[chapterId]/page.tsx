import { BackLink } from "@/components/back-link";
import { ChapterIdView } from "@/app/modules/chapters/ui/views/chapter-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
}

const ChapterIdPage = async ({ params }: Props) => {
  const queryClient = getQueryClient();
  const { courseId, chapterId } = await params;
  await Promise.all([
    void queryClient.prefetchQuery(
      trpc.chapters.getOne.queryOptions({
        id: chapterId,
        courseId: courseId,
      })
    ),
    void queryClient.prefetchQuery(
      trpc.chapters.getMux.queryOptions({
        chapterId,
      })
    ),
  ]);

  return (
    <>
      <BackLink
        label="Back to course setup"
        href={`/teacher/courses/${courseId}`}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>loading</p>}>
          <ErrorBoundary fallback={<p>error</p>}>
            <ChapterIdView courseId={courseId} chapterId={chapterId} />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default ChapterIdPage;
