"use client";

import { IconBadge } from "@/components/icon-badge";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Eye, LayoutDashboardIcon } from "lucide-react";
import { ChapterTitle } from "../components/title-form";
import { ChapterDescriptionForm } from "../components/chapter-description-form";
import { ChapterAccessForm } from "../components/chapter-access-form";

interface Props {
  courseId: string;
  chapterId: string;
}
export const ChapterIdView = ({ chapterId, courseId }: Props) => {
  const trpc = useTRPC();
  const { data: chapter } = useSuspenseQuery(
    trpc.chapters.getOne.queryOptions({
      id: chapterId,
      courseId: courseId,
    })
  );
  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const initialChapterTitleData = {
    title: chapter.title,
  };
  const initialChapterDescData = {
    description: chapter.description ?? "",
  };
  const initialChapterAccessData = {
    isFree: chapter.isFree ?? false,
  };
  return (
    <div className="px-6">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-bold">Chapter Creation</h1>
          <p className="text-sm text-muted-foreground">
            Complete all fields {completionText}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-y-4">
            <IconBadge
              icon={LayoutDashboardIcon}
              title={"Customize your chapter"}
            />
            <div className="flex flex-col space-y-4">
              <ChapterTitle
                initialData={initialChapterTitleData}
                chapterId={chapterId}
                courseId={courseId}
              />
              <ChapterDescriptionForm
                initialData={initialChapterDescData}
                chapterId={chapterId}
                courseId={courseId}
              />
            </div>
            <IconBadge icon={Eye} title={"Access Settings"} />
            <div>
              <ChapterAccessForm
                initialData={initialChapterAccessData}
                chapterId={chapterId}
                courseId={courseId}
              />
            </div>
          </div>
          {/* second column */}
          <div className="flex flex-col gap-y-4"></div>
        </div>
      </div>
    </div>
  );
};
