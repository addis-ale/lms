"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Eye, LayoutDashboardIcon, Loader2, VideoIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { useTRPC } from "@/trpc/client";
import { ChapterTitle } from "../components/title-form";
import { ChapterDescriptionForm } from "../components/chapter-description-form";
import { ChapterAccessForm } from "../components/chapter-access-form";
import { ChapterVideoForm } from "../components/chapter-video-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "../components/chapter-actions";
import { useConfirm } from "@/hooks/use-confirm";

interface Props {
  courseId: string;
  chapterId: string;
}
export const ChapterIdView = ({ chapterId, courseId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: chapter } = useSuspenseQuery(
    trpc.chapters.getOne.queryOptions({
      id: chapterId,
      courseId: courseId,
    })
  );
  const { data: muxData } = useSuspenseQuery(
    trpc.chapters.getMux.queryOptions({
      chapterId,
    })
  );
  const removeChapter = useMutation(
    trpc.chapters.remove.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.chapters.getMany.queryOptions({ courseId })
          ),
          queryClient.invalidateQueries(
            trpc.chapters.getOne.queryOptions({ id: chapterId, courseId })
          ),
        ]);

        router.push(`/teacher/courses/${courseId}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const publishChapter = useMutation(
    trpc.chapters.update.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.chapters.getMany.queryOptions({ courseId })
          ),
          queryClient.invalidateQueries(
            trpc.chapters.getOne.queryOptions({ id: chapterId, courseId })
          ),
        ]);
      },
      onError: (error) => {
        toast.message(error.message);
      },
    })
  );
  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `The following action will remove this chapter`
  );
  const handleRemoveChapter = async () => {
    const ok = await confirmRemove();
    if (!ok) return;

    await removeChapter.mutateAsync({ id: chapterId, courseId });
  };
  const handlePublishChapter = (isPublished: boolean) => {
    if (isPublished) {
      publishChapter.mutate({
        id: chapterId,
        courseId,
        isPublished: false,
      });
    } else {
      publishChapter.mutate({
        id: chapterId,
        courseId,
        isPublished: true,
      });
    }
  };
  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);
  const initialChapterTitleData = {
    title: chapter.title,
  };
  const initialChapterDescData = {
    description: chapter.description ?? "",
  };
  const initialChapterAccessData = {
    isFree: chapter.isFree ?? false,
  };
  const initialChapterVideoData = {
    videoUrl: chapter.videoUrl ?? "",
    playbackId: muxData?.playbackId ?? "",
  };
  return (
    <>
      <RemoveConfirmation />
      {!chapter.isPublished && (
        <Banner
          variant={"warning"}
          label="This chapter is unpublished, It will not be visible in the course"
        />
      )}
      <div className="px-6 pb-6 relative">
        {/* make full screen blocking component and reuse it */}
        {(removeChapter.isPending || publishChapter.isPending) && (
          <div className="absolute h-full w-full bg-slate-500/20 runded-md top-0 right-0 flex items-center justify-center">
            <Loader2 className="animate-spin size-6" />
          </div>
        )}
        <div className="flex flex-col space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-bold">Chapter Creation</h1>
              <p className="text-sm text-muted-foreground">
                Complete all fields {completionText}
              </p>
            </div>
            <ChapterActions
              onPublish={handlePublishChapter}
              disabled={
                !isComplete ||
                removeChapter.isPending ||
                publishChapter.isPending
              }
              isPublished={chapter?.isPublished ?? false}
              onRemove={handleRemoveChapter}
            />
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
            <div className="flex flex-col gap-y-4">
              <IconBadge icon={VideoIcon} title={"Add a video"} />
              <div className="flex flex-col space-y-4">
                <ChapterVideoForm
                  initialData={initialChapterVideoData}
                  chapterId={chapterId}
                  courseId={courseId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
