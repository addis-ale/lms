import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { CreateCourseView } from "@/app/modules/courses/ui/views/create-course-view";
import { BackLink } from "@/components/back-link";
import { auth } from "@/lib/auth";

const Createpage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <>
      <BackLink href="/teacher/courses" label="Back to my courses" />
      <CreateCourseView />
    </>
  );
};

export default Createpage;
