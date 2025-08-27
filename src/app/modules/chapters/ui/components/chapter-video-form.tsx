"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { PenIcon, PlusCircle, VideoIcon } from "lucide-react";
import { z } from "zod";
import MuxPlayer from "@mux/mux-player-react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { FileUpload } from "@/components/file-upload";
import { chapterVideoInsertSchema } from "../../schema";

interface Props {
  initialData: {
    videoUrl: string;
    playbackId: string;
  };
  courseId: string;
  chapterId: string;
}

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [openEdit, setOpenEdit] = useState(false);

  const onSubmit = (data: z.infer<typeof chapterVideoInsertSchema>) => {
    updateChapter.mutate({ ...data, id: chapterId, courseId });
  };

  //const queryClient = useQueryClient();

  const updateChapter = useMutation(
    trpc.chapters.update.mutationOptions({
      onSuccess: async () => {
        //TODO: invalidate queries get many courses
        if (courseId)
          await Promise.all([
            queryClient.invalidateQueries(
              trpc.chapters.getOne.queryOptions({ id: chapterId, courseId })
            ),
            queryClient.invalidateQueries(
              trpc.chapters.getMany.queryOptions({ courseId })
            ),
          ]);
        setOpenEdit(false);
        toast.success("Chapter updated!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  return (
    <div className="bg-blue-400/10 p-3 ">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-md">Chapter Video</h3>
            {openEdit && (
              <Button
                variant={"outline"}
                onClick={() => setOpenEdit(false)}
                disabled={updateChapter.isPending}
              >
                Cancel
              </Button>
            )}
            {!openEdit && !!initialData?.videoUrl && (
              <Button
                className=""
                variant={"outline"}
                onClick={() => setOpenEdit(true)}
                disabled={updateChapter.isPending}
              >
                <PenIcon className="size-5" /> Edit
              </Button>
            )}
            {!openEdit && !!!initialData?.videoUrl && (
              <Button
                className=""
                variant={"outline"}
                onClick={() => setOpenEdit(true)}
                disabled={updateChapter.isPending}
              >
                <PlusCircle className="size-5" /> Add an image
              </Button>
            )}
          </div>
          {!openEdit && (
            <div>
              {!!initialData?.videoUrl ? (
                <div className="relative aspect-video mt-2">
                  <MuxPlayer playbackId={initialData.playbackId} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                  <VideoIcon className="h-10 w-10 text-slate-500" />
                </div>
              )}
            </div>
          )}
        </div>
        {openEdit && (
          <div className="">
            <FileUpload
              endpoint="chapterVideo"
              onChange={(url) => {
                if (url) {
                  onSubmit({ videoUrl: url });
                }
              }}
            />
            <div className="text-xs text-muted-foreground mt-4 text-center">
              Upload this chapter&apos;s video
            </div>
          </div>
        )}
      </div>
      {initialData.videoUrl && !openEdit && (
        <div className="text-xs text-muted-foreground mt-2">
          Video can take a few minutes to process. Refresh the page if video
          does not appear.
        </div>
      )}
    </div>
  );
};
