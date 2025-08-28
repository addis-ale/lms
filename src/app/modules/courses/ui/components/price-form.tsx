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
import { priceInsertSchema } from "../../schema";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
interface Props {
  initialData?: {
    price: string;
  };
  courseId: string;
}

export const PriceForm = ({ initialData, courseId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [openEdit, setOpenEdit] = useState(false);
  const form = useForm<z.infer<typeof priceInsertSchema>>({
    resolver: zodResolver(priceInsertSchema),
    defaultValues: {
      price: initialData?.price ?? "",
    },
  });
  const onSubmit = (data: z.infer<typeof priceInsertSchema>) => {
    updateCourse.mutate({ ...data, id: courseId });

    // createCourse.mutate(data);
  };

  //const queryClient = useQueryClient();

  const updateCourse = useMutation(
    trpc.courses.update.mutationOptions({
      onSuccess: async () => {
        //TODO: invalidate queries get many courses
        if (courseId)
          await Promise.all([
            queryClient.invalidateQueries(
              trpc.courses.getMyCourse.queryOptions({})
            ),
            queryClient.invalidateQueries(
              trpc.courses.getOne.queryOptions({ id: courseId })
            ),
          ]);
        setOpenEdit(false);
        toast.success("Course price updated!");
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
            <h3 className="font-semibold text-md">Course Price</h3>
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
              {!!initialData?.price ? (
                <span className="text-muted-foreground text-md">
                  {formatPrice(Number(initialData?.price))}
                </span>
              ) : (
                <span className="text-muted-foreground text-md italic">
                  No Price
                </span>
              )}
            </div>
          )}
        </div>
        {openEdit && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="price"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={"0.01"}
                        className="bg-white"
                        placeholder="Set a price for your course"
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
