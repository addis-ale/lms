"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fireConfetti } from "@/lib/confettii";
import { useTRPC } from "@/trpc/client";

interface Props {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
}
export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
}: Props) => {
  const Icon = isCompleted ? XCircle : CheckCircle;
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
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
        if (!isCompleted && !nextChapterId) {
          fireConfetti();
        }
        if (!isCompleted && nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
        toast.success("progress updated");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const onClick = () => {
    updateProgress.mutate({
      chapterId,
      isCompleted: !isCompleted,
    });
  };
  return (
    <Button
      onClick={onClick}
      type="button"
      disabled={updateProgress.isPending}
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
    >
      {isCompleted ? "Not completed" : "Mark as complete"}
      <Icon className="size-4 ml-2" />
    </Button>
  );
};
