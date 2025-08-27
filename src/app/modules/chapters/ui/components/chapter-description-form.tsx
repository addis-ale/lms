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

import { useTRPC } from "@/trpc/client";
import { chapterDescriptionInsertSchema } from "../../schema";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
interface Props {
  initialData?: {
    description: string;
  };
  courseId: string;
  chapterId: string;
}

export const ChapterDescriptionForm = ({
  initialData,
  courseId,
  chapterId,
}: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [openEdit, setOpenEdit] = useState(false);
  const form = useForm<z.infer<typeof chapterDescriptionInsertSchema>>({
    resolver: zodResolver(chapterDescriptionInsertSchema),
    defaultValues: {
      description: initialData?.description ?? "",
    },
  });
  const toggleEdit = () => {
    setOpenEdit((prev) => !prev);
  };
  const onSubmit = (data: z.infer<typeof chapterDescriptionInsertSchema>) => {
    updateChapter.mutate({ ...data, id: chapterId, courseId });
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
            <h3 className="font-semibold text-md">Chapter Description</h3>
            <Button
              variant={"outline"}
              onClick={toggleEdit}
              disabled={updateChapter.isPending}
            >
              {openEdit ? (
                <>Cancel</>
              ) : (
                <>
                  <PenIcon className="size-5" /> Edit
                </>
              )}
            </Button>
          </div>
          {!openEdit && (
            <div>
              {!!initialData?.description ? (
                <span className="text-muted-foreground text-md">
                  <Preview value={initialData?.description} />
                </span>
              ) : (
                <span className="text-muted-foreground text-md italic">
                  No Description
                </span>
              )}
            </div>
          )}
        </div>
        {openEdit && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Description</FormLabel>
                    <FormControl>
                      <Editor {...field} />
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
