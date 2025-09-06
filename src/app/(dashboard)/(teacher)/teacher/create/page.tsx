import { CreateCourseView } from "@/app/modules/courses/ui/views/create-course-view";
import { BackLink } from "@/components/back-link";

const Createpage = async () => {
  return (
    <>
      <BackLink href="/teacher/tcourses" label="Back to my courses" />
      <CreateCourseView />
    </>
  );
};

export default Createpage;
