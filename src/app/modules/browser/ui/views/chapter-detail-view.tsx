"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export const ChapterDetailView = ({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) => {
  const trpc = useTRPC();
  const { data: chapter } = useSuspenseQuery(
    trpc.chapters.getOne.queryOptions({
      id: chapterId,
      courseId,
    })
  );
  const { data: isPurchased } = useQuery(
    trpc.browseCourse.isPurchased.queryOptions({
      courseId,
    })
  );
  return <div>hello chapter</div>;
};
