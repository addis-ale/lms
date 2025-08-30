import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { CourseSidebar } from "@/app/modules/browser/ui/components/course-detail-sidebar";
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

  return (
    <SidebarProvider>
      <div className="">
        <CourseSidebar courseId={courseId} />
      </div>
      <main className="w-full">
        <CourseDetailNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
};
export default CourseDetailLayout;
