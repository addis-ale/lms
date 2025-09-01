import { db } from "@/db"; // your Drizzle instance
import { chapters } from "@/db/schema"; // your chapters table
import { asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ courseId: string }>;
}

const CourseDetailPage = async ({ params }: Props) => {
  const { courseId } = await params;

  // fetch only the first chapter
  const [firstChapter] = await db
    .select({ id: chapters.id })
    .from(chapters)
    .where(eq(chapters.courseId, courseId))
    .orderBy(asc(chapters.position)) // ensure correct order
    .limit(1)
    .execute();

  if (!firstChapter) {
    redirect("/");
  }
  redirect(`/courses/${courseId}/chapters/${firstChapter.id}`);
};

export default CourseDetailPage;
