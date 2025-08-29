import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";

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
  return <div>{children}</div>;
};
export default CourseDetailLayout;
