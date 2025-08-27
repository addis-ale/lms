"use client";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { PenIcon } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { chapterTitleInsertSchema } from "../../schema";
interface Props {
  initialData: {
    title: string;
  };
  courseId: string;
  chapterId: string;
}

export const ChapterTitle = ({ initialData, courseId, chapterId }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof chapterTitleInsertSchema>>({
    resolver: zodResolver(chapterTitleInsertSchema),
    defaultValues: {
      title: initialData?.title ?? "",
    },
  });
  const onSubmit = (data: z.infer<typeof chapterTitleInsertSchema>) => {
    updateChapter.mutate({ ...data, id: chapterId, courseId: courseId });
  };

  const updateChapter = useMutation(
    trpc.chapters.update.mutationOptions({
      onSuccess: async () => {
        //TODO: invalidate queries get many courses

        await Promise.all([
          queryClient.invalidateQueries(
            trpc.chapters.getOne.queryOptions({ id: chapterId, courseId })
          ),
          queryClient.invalidateQueries(
            trpc.chapters.getMany.queryOptions({ courseId })
          ),
        ]);
        setIsEditing(false);
        toast.success("Chapter title updated!");
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
            <h3 className="font-semibold text-md">Chapter title</h3>
            <Button
              variant={"outline"}
              onClick={toggleEdit}
              disabled={updateChapter.isPending}
            >
              {isEditing ? (
                <>Cancel</>
              ) : (
                <>
                  <PenIcon className="size-5" /> Edit
                </>
              )}
            </Button>
          </div>
          {!isEditing && (
            <span className="text-muted-foreground text-md">
              {initialData.title}
            </span>
          )}
        </div>
        {isEditing && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        type="text"
                        placeholder="e.g. Introdution to the course"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={updateChapter.isPending} type="submit">
                Save
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};
