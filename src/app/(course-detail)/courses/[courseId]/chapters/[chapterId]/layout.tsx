import { CourseDetailNavbar } from "@/app/modules/browser/ui/components/course-detail-navbar";
import { CourseSidebar } from "@/app/modules/browser/ui/components/course-detail-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{ chapterId: string; courseId: string }>;
  children: React.ReactNode;
}
const ChapterPage = async ({ params, children }: Props) => {
  const { chapterId, courseId } = await params;

  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(
      trpc.browseCourse.isPurchased.queryOptions({
        courseId,
      })
    ),
    queryClient.prefetchQuery(
      trpc.browseCourse.getOne.queryOptions({
        id: courseId,
      })
    ),
  ]);
  return (
    <SidebarProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>loading</p>}>
          <ErrorBoundary fallback={<p>Error</p>}>
            <CourseDetailNavbar />
            <main className="w-full">
              <CourseSidebar courseId={courseId} />
              {children}
            </main>
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </SidebarProvider>
  );
};

export default ChapterPage;
