import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { CourseSidebar } from "@/app/modules/browser/ui/components/course-detail-sidebar";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CourseDetailNavbar } from "@/app/modules/browser/ui/components/course-detail-navbar";

interface Props {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}
const CourseDetailLayout = async ({ children, params }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }
  const { courseId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.browseCourse.getOne.queryOptions({
      id: courseId,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p> pending</p>}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <SidebarProvider>
            <div className="">
              <CourseSidebar courseId={courseId} />
            </div>
            <main className="w-full">
              <CourseDetailNavbar />
              {children}
            </main>
          </SidebarProvider>
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};
export default CourseDetailLayout;
