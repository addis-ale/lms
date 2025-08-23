"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { ImageIcon, PenIcon, PlusCircle } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { imageUrlInsertSchema } from "../../schema";
import { useTRPC } from "@/trpc/client";
import Image from "next/image";
import { FileUpload } from "./file-upload";
interface Props {
  initialData?: {
    imageUrl: string;
  };
  courseId: string;
}

export const ImageForm = ({ initialData, courseId }: Props) => {
  console.log(!!initialData?.imageUrl);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [openEdit, setOpenEdit] = useState(false);

  const onSubmit = (data: z.infer<typeof imageUrlInsertSchema>) => {
    console.log(data);
    updateCourse.mutate({ ...data, id: courseId });
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
            {openEdit && (
              <Button
                variant={"outline"}
                onClick={() => setOpenEdit(false)}
                disabled={updateCourse.isPending}
              >
                Cancel
              </Button>
            )}
            {!openEdit && !!initialData?.imageUrl && (
              <Button
                className=""
                variant={"outline"}
                onClick={() => setOpenEdit(true)}
                disabled={updateCourse.isPending}
              >
                <PenIcon className="size-5" /> Edit
              </Button>
            )}
            {!openEdit && !!!initialData?.imageUrl && (
              <Button
                className=""
                variant={"outline"}
                onClick={() => setOpenEdit(true)}
                disabled={updateCourse.isPending}
              >
                <PlusCircle className="size-5" /> Add an image
              </Button>
            )}
          </div>
          {!openEdit && (
            <div>
              {!!initialData?.imageUrl ? (
                <div className="relative aspect-video mt-2">
                  <Image
                    src={initialData.imageUrl}
                    alt="uploaded image"
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                  <ImageIcon className="h-10 w-10 text-slate-500" />
                </div>
              )}
            </div>
          )}
        </div>
        {openEdit && (
          <div className="">
            <FileUpload
              endpoint="courseImage"
              onChange={(url) => {
                if (url) {
                  console.log("url", url);
                  onSubmit({ imageUrl: url });
                }
              }}
            />
            <div className="text-xs text-muted-foreground mt-4 text-center">
              16:9 aspect ratio is recommended
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
