"use client";

import { Banner } from "@/components/banner";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { VideoPlayer } from "../components/video-player";

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
  const { data: course } = useSuspenseQuery(
    trpc.courses.getOne.queryOptions({
      id: courseId,
    })
  );
  const { data: userProgress } = useSuspenseQuery(
    trpc.chapters.getProgress.queryOptions({ chapterId })
  );
  const { data: nextChapter } = useSuspenseQuery(
    trpc.chapters.getNext.queryOptions({
      courseId,
      currentChapterId: chapterId,
    })
  );
  const { data: muxData } = useSuspenseQuery(
    trpc.chapters.getMux.queryOptions({
      chapterId,
    })
  );
  const isLocked = !chapter.isFree || course.isPurchased;

  const completeOnEnd = course.isPurchased && !userProgress?.isCompleted;

  return (
    <div>
      <div>
        {userProgress.isCompleted && (
          <Banner
            label="You already completed this chapter"
            variant={"success"}
          />
        )}
        {isLocked && (
          <Banner
            label="You neet to purchase this course to watch this chapter"
            variant={"warning"}
          />
        )}
        <div className="flex flex-col max-w-4xl mx-auto pb-20">
          <div className="p-4">
            <VideoPlayer
              chapterId={chapterId}
              title={chapter.title}
              courseId={courseId}
              nextChapterId={nextChapter?.id}
              playbackId={muxData?.playbackId ?? ""}
              isLocked={isLocked}
              completeOnEnd={completeOnEnd}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
