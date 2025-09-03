"use client";
import { fireConfetti } from "@/lib/confettii";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import MuxPlayer from "@mux/mux-player-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
interface Props {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}
export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: Props) => {
  const [isReady, setIsReady] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const updateProgress = useMutation(
    trpc.chapters.updateProgress.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.courses.getOne.queryOptions({ id: courseId })
          ),
          queryClient.invalidateQueries(
            trpc.browseCourse.getOne.queryOptions({
              id: courseId,
            })
          ),
          queryClient.invalidateQueries(
            trpc.browseCourse.getMany.queryOptions({})
          ),
        ]);
        if (!nextChapterId) {
          fireConfetti();
        }
        toast.success("progress updated");
        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const onEnd = async () => {
    if (completeOnEnd) {
      updateProgress.mutate({
        chapterId,
        isCompleted: true,
      });
    }
  };
  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="size-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="size-8 text-secondary" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
};
