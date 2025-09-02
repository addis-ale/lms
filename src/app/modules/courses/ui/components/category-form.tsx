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
import { categoryInsertSchema } from "../../schema";
import { useTRPC } from "@/trpc/client";
import { Combobox } from "@/components/ui/combobox";
interface Props {
  initialData?: {
    categoryId: string;
  };
  courseId: string;
  options: { label: string; value: string }[];
}

export const CategoryForm = ({ initialData, courseId, options }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [openEdit, setOpenEdit] = useState(false);
  const form = useForm<z.infer<typeof categoryInsertSchema>>({
    resolver: zodResolver(categoryInsertSchema),
    defaultValues: {
      categoryId: initialData?.categoryId ?? "",
    },
  });
  const onSubmit = (data: z.infer<typeof categoryInsertSchema>) => {
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
        toast.success("Course category updated!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const selectedOption = options.find(
    (option) => option.value === initialData?.categoryId
  );
  return (
    <div className="bg-blue-400/10 p-3 ">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-md">Course Category</h3>
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
              {!!initialData?.categoryId ? (
                <span className="text-muted-foreground text-md">
                  {selectedOption?.label}
                </span>
              ) : (
                <span className="text-muted-foreground text-md italic">
                  No Category
                </span>
              )}
            </div>
          )}
        </div>
        {openEdit && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="categoryId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Category</FormLabel>
                    <FormControl>
                      <Combobox options={options} {...field} />
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
