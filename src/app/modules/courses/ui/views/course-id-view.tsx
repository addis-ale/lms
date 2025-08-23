"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LayoutDashboardIcon } from "lucide-react";
import { TitleForm } from "../components/title-form";
import { DescriptionForm } from "../components/description-form";

interface Props {
  courseId: string;
}
export const CourseIdView = ({ courseId }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.courses.getOne.queryOptions({ id: courseId })
  );
  const initialTitleData = {
    title: data?.title,
  };
  const initialDescData = {
    description: data?.description ?? "",
  };
  return (
    <div className="p-6 mt-8">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Course setup</h1>
          <p className="text-sm text-muted-foreground">Complete all fields</p>
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center gap-x-2">
            <span className="p-2 bg-blue-400/30 rounded-full">
              <LayoutDashboardIcon className="size-5" />
            </span>
            <h2 className="text-xl font-semibold">Customize your course</h2>
          </div>
          <div className="max-w-sm flex flex-col space-y-4">
            <TitleForm courseId={courseId} initialData={initialTitleData} />
            <DescriptionForm
              initialData={initialDescData}
              courseId={courseId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
