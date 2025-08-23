"use client";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { PenIcon } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { titleInsertSchema } from "../../schema";
import { useTRPC } from "@/trpc/client";
interface Props {
  initialData?: {
    title: string;
  };
  courseId?: string;
}

export const TitleForm = ({ initialData, courseId }: Props) => {
  const isEdit = !!courseId && !!initialData;
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openEdit, setOpenEdit] = useState(false);
  const form = useForm<z.infer<typeof titleInsertSchema>>({
    resolver: zodResolver(titleInsertSchema),
    defaultValues: {
      title: initialData?.title ?? "",
    },
  });
  const onSubmit = (data: z.infer<typeof titleInsertSchema>) => {
    if (isEdit) {
      updateCourse.mutate({ ...data, id: courseId });
    }
    createCourse.mutate(data);
  };

  //const queryClient = useQueryClient();
  const createCourse = useMutation(
    trpc.courses.create.mutationOptions({
      onSuccess: async (data) => {
        //TODO: invalidate query get many course
        // await queryClient.invalidateQueries(trpc.courses.getMany.queryOptions({}))
        toast.success("Course Created!");
        router.push(`/teacher/courses/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const updateCourse = useMutation(
    trpc.courses.update.mutationOptions({
      onSuccess: async () => {
        //TODO: invalidate queries get many courses
        if (courseId)
          await queryClient.invalidateQueries(
            trpc.courses.getOne.queryOptions({ id: courseId })
          );
        setOpenEdit(false);
        toast.success("Course title updated!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  if (isEdit) {
    return (
      <div className="bg-blue-400/10 p-3 ">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-md">Course title</h3>
              {openEdit ? (
                <Button
                  variant={"outline"}
                  onClick={() => setOpenEdit(false)}
                  disabled={updateCourse.isPending || createCourse.isPending}
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  className=""
                  variant={"outline"}
                  onClick={() => setOpenEdit(true)}
                  disabled={updateCourse.isPending || createCourse.isPending}
                >
                  <PenIcon className="size-5" /> Edit
                </Button>
              )}
            </div>
            {!openEdit && (
              <span className="text-muted-foreground text-md">
                {initialData.title}
              </span>
            )}
          </div>
          {openEdit && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-xl space-y-4"
              >
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
                          placeholder="e.g. Advanced Web Development"
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
  } else
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-xl space-y-8"
        >
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="e.g. Advanced Web Development"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  What will you teach in this course?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-x-4">
            <Link href={"/teacher/courses"}>
              <Button type="button" variant={"ghost"}>
                Cancel
              </Button>
            </Link>
            <Button className="" type="submit">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    );
};
