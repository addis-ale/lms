import { CourseDetailNavbar } from "@/app/modules/browser/ui/components/course-detail-navbar";
import { CourseSidebar } from "@/app/modules/browser/ui/components/course-detail-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ chapterId: string; courseId: string }>;
  children: React.ReactNode;
}
const ChapterPage = async ({ params, children }: Props) => {
  const { courseId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <SidebarProvider>
      <CourseSidebar courseId={courseId} />
      <main className="w-full">
        <CourseDetailNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default ChapterPage;
