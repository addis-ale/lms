import { CreateCourseView } from "@/app/modules/courses/ui/views/create-course-view";
import { BackLink } from "@/components/back-link";

const Createpage = () => {
  return (
    <>
      <BackLink href="/teacher/courses" label="Back to my courses" />
      <CreateCourseView />
    </>
  );
};

export default Createpage;
