import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ChapterDetailView } from "@/app/modules/browser/ui/views/chapter-detail-view";

interface Props {
  params: Promise<{ courseId: string; chapterId: string }>;
}

const ChapterDetailPage = async ({ params }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }
  const { chapterId, courseId } = await params;
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(
      trpc.chapters.getOne.queryOptions({
        id: chapterId,
        courseId,
      })
    ),
    queryClient.prefetchQuery(
      trpc.courses.getOne.queryOptions({
        id: courseId,
      })
    ),
  ]);
  const course = await queryClient.fetchQuery(
    trpc.courses.getOne.queryOptions({ id: courseId })
  );

  if (course.isPurchased) {
    void queryClient.prefetchQuery(
      trpc.attachments.getMany.queryOptions({ courseId })
    );
  }
  if (
    course.isPurchased ||
    queryClient.getQueryData(
      trpc.chapters.getOne.queryOptions({ id: chapterId, courseId }).queryKey
    )?.isFree
  ) {
    await Promise.all([
      queryClient.prefetchQuery(
        trpc.chapters.getMux.queryOptions({
          chapterId,
        })
      ),
      queryClient.prefetchQuery(
        trpc.chapters.getProgress.queryOptions({ chapterId })
      ),
      queryClient.prefetchQuery(
        trpc.chapters.getNext.queryOptions({
          courseId,
          currentChapterId: chapterId,
        })
      ),
    ]);
    const nextChapter = await queryClient.fetchQuery(
      trpc.chapters.getNext.queryOptions({
        courseId,
        currentChapterId: chapterId,
      })
    );
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>loading</p>}>
        <ErrorBoundary fallback={<p>error</p>}>
          <ChapterDetailView courseId={courseId} chapterId={chapterId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default ChapterDetailPage;