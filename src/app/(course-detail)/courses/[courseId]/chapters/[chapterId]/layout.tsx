import { CourseDetailNavbar } from "@/app/modules/browser/ui/components/course-detail-navbar";
import { CourseSidebar } from "@/app/modules/browser/ui/components/course-detail-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface Props {
  params: Promise<{ chapterId: string; courseId: string }>;
  children: React.ReactNode;
}
const ChapterPage = async ({ params, children }: Props) => {
  const { chapterId, courseId } = await params;
  return (
    <SidebarProvider>
      <CourseDetailNavbar />
      <main className="w-full">
        <CourseSidebar courseId={courseId} />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default ChapterPage;
