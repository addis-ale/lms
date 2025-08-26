"use client";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
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
import { chaptersInsertSchema } from "../../schema";
import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
interface Props {
  initialData?: {
    title: string;
  }[];
  courseId: string;
}

export const ChaptersForm = ({ initialData, courseId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const toggleCreating = () => {
    setIsCreating((prev) => !prev);
  };
  const form = useForm<z.infer<typeof chaptersInsertSchema>>({
    resolver: zodResolver(chaptersInsertSchema),
    defaultValues: {
      title: "",
    },
  });
  const onSubmit = (data: z.infer<typeof chaptersInsertSchema>) => {
    createChapter.mutate({ ...data, courseId: courseId });

    // createCourse.mutate(data);
  };

  //const queryClient = useQueryClient();

  const createChapter = useMutation(
    trpc.courses.createCourseChapter.mutationOptions({
      onSuccess: async () => {
        //TODO: invalidate queries get many courses
        if (courseId)
          await queryClient.invalidateQueries(
            trpc.courses.getCourseChapters.queryOptions({ courseId: courseId })
          );
        toggleCreating();
        toast.success("Course chapter created!");
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
            <h3 className="font-semibold text-md">Course chapters</h3>
            <Button
              variant={"outline"}
              onClick={toggleCreating}
              disabled={createChapter.isPending}
            >
              {isCreating ? (
                <>Cancel</>
              ) : (
                <>
                  <PlusCircle className="size-5" /> Add a chapter
                </>
              )}
            </Button>
          </div>
        </div>
        {isCreating && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter title</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="e.g. Introduction to the course"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={createChapter.isPending} type="submit">
                Create
              </Button>
            </form>
          </Form>
        )}
        {!isCreating && (
          <div
            className={cn(
              "text-sm mt-2",
              !initialData?.length && "text-slate-500 italic"
            )}
          >
            {!initialData?.length && "No chapters"}
            {/* TODO: list of chapters */}
          </div>
        )}{" "}
        {!isCreating && (
          <p className="text-sm text-muted-foreground mt-4">
            Drag and drop to reorder the chapters
          </p>
        )}
      </div>
    </div>
  );
};
