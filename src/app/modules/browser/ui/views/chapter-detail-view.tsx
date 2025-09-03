"use client";

import { Banner } from "@/components/banner";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { VideoPlayer } from "../components/video-player";
import { CourseEnrollButton } from "../components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "../components/course-progress-button";

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
  const { data: attachments } = useSuspenseQuery(
    trpc.attachments.getMany.queryOptions({ courseId })
  );
  const isLocked = !chapter.isFree && !course.isPurchased;
  console.log("Is locked", course);
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
          <div className="">
            <div className="p-4 flex flex-col md:flex-row items-center justify-between">
              <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
              {course.isPurchased ? (
                <CourseProgressButton
                  chapterId={chapterId}
                  courseId={courseId}
                  nextChapterId={nextChapter?.id}
                  isCompleted={!!userProgress.isCompleted}
                />
              ) : (
                <CourseEnrollButton
                  courseId={courseId}
                  price={+course.price!}
                />
              )}
            </div>
            <Separator />
            <div>
              <Preview value={chapter.description!} />
            </div>
            {course.isPurchased && attachments.length && (
              <>
                <Separator />
                <div className="p-4">
                  {attachments.map((attachment) => (
                    <a
                      href={attachment.url}
                      key={attachment.id}
                      target="_blank"
                      className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                    >
                      <File />
                      <p className="line-clamp-1 truncate">{attachment.name}</p>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
