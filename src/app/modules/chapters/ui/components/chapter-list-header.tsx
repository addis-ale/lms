import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  courseId: string;
}
export const ChapterListHeader = ({ courseId }: Props) => {
  return (
    <div className="p-6 ">
      <div className="flex items-center justify-between">
        <Link
          href={`/teacher/courses/${courseId}`}
          className="flex items-center text-sm hover:opacity-75 transition font-semibold"
        >
          <ArrowLeft className="size-4 mr-2" /> Back to course setup
        </Link>
      </div>
    </div>
  );
};
