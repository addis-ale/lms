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
import { descriptionInsertSchema } from "../../schema";
import { useTRPC } from "@/trpc/client";
import { Textarea } from "@/components/ui/textarea";
interface Props {
  initialData?: {
    description: string;
  };
  courseId: string;
}

export const DescriptionForm = ({ initialData, courseId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [openEdit, setOpenEdit] = useState(false);
  const form = useForm<z.infer<typeof descriptionInsertSchema>>({
    resolver: zodResolver(descriptionInsertSchema),
    defaultValues: {
      description: initialData?.description ?? "",
    },
  });
  const onSubmit = (data: z.infer<typeof descriptionInsertSchema>) => {
    updateCourse.mutate({ ...data, id: courseId });

    // createCourse.mutate(data);
  };

  //const queryClient = useQueryClient();

  const updateCourse = useMutation(
    trpc.courses.update.mutationOptions({
      onSuccess: async () => {
        //TODO: invalidate queries get many courses
        if (courseId)
          await queryClient.invalidateQueries(
            trpc.courses.getOne.queryOptions({ id: courseId })
          );
        setOpenEdit(false);
        toast.success("Course description updated!");
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
            <h3 className="font-semibold text-md">Course Description</h3>
            {openEdit ? (
              <Button
                variant={"outline"}
                onClick={() => setOpenEdit(false)}
                disabled={updateCourse.isPending}
              >
                Cancel
              </Button>
            ) : (
              <Button
                className=""
                variant={"outline"}
                onClick={() => setOpenEdit(true)}
                disabled={updateCourse.isPending}
              >
                <PenIcon className="size-5" /> Edit
              </Button>
            )}
          </div>
          {!openEdit && (
            <div>
              {!!initialData?.description ? (
                <span className="text-muted-foreground text-md">
                  {initialData?.description}
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
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="max-w-xl space-y-4"
            >
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="bg-white"
                        placeholder="e.g. This course is about..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={updateCourse.isPending} type="submit">
                Save
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};
