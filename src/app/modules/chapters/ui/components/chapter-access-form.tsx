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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useTRPC } from "@/trpc/client";

import { chapterAccessInsertSchema } from "../../schema";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
interface Props {
  initialData: {
    isFree: boolean;
  };
  courseId: string;
  chapterId: string;
}

export const ChapterAccessForm = ({
  initialData,
  courseId,
  chapterId,
}: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [openEdit, setOpenEdit] = useState(false);
  const form = useForm<z.infer<typeof chapterAccessInsertSchema>>({
    resolver: zodResolver(chapterAccessInsertSchema),
    defaultValues: {
      isFree: !!initialData?.isFree,
    },
  });
  const toggleEdit = () => {
    setOpenEdit((prev) => !prev);
  };
  const onSubmit = (data: z.infer<typeof chapterAccessInsertSchema>) => {
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
            <h3 className="font-semibold text-md">Chapter Access</h3>
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
            <div
              className={cn(
                "text-sm mt-2",
                !initialData?.isFree && "text-slate-500 italic"
              )}
            >
              {initialData?.isFree ? (
                <span className="text-muted-foreground text-md">
                  This chapter is free for preview
                </span>
              ) : (
                <span className="text-muted-foreground text-md italic">
                  This chapter is not free
                </span>
              )}
            </div>
          )}
        </div>
        {openEdit && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="isFree"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 bg-white">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormDescription>
                        Check this box if you want to make this chapter free for
                        preview
                      </FormDescription>
                    </div>
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
