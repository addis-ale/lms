import { BackLink } from "@/components/back-link";
import { ChapterIdView } from "@/app/modules/chapters/ui/views/chapter-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{
    tcourseId: string;
    tchapterId: string;
  }>;
}

const ChapterIdPage = async ({ params }: Props) => {
  const queryClient = getQueryClient();
  const { tcourseId, tchapterId } = await params;
  await Promise.all([
    void queryClient.prefetchQuery(
      trpc.chapters.getOne.queryOptions({
        id: tchapterId,
        courseId: tcourseId,
      })
    ),
    void queryClient.prefetchQuery(
      trpc.chapters.getMux.queryOptions({
        chapterId: tchapterId,
      })
    ),
  ]);

  return (
    <>
      <BackLink
        label="Back to course setup"
        href={`/teacher/tcourses/${tcourseId}`}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>loading</p>}>
          <ErrorBoundary fallback={<p>error</p>}>
            <ChapterIdView courseId={tcourseId} chapterId={tchapterId} />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default ChapterIdPage;
