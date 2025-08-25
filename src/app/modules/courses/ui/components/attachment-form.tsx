"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { File, Loader2, PlusCircle, TrashIcon } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { attachmentsInsertSchema } from "../../schema";
import { useTRPC } from "@/trpc/client";
import { FileUpload } from "./file-upload";
interface Props {
  initialData: {
    url: string;
    name: string;
    id: string;
  }[];
  courseId: string;
}

export const AttachmentForm = ({ initialData, courseId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [openEdit, setOpenEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onSubmit = (data: z.infer<typeof attachmentsInsertSchema>) => {
    updateCourse.mutate({
      ...data,
      courseId: courseId,
      name: data.url.split("/").pop() ?? "",
    });
  };

  //const queryClient = useQueryClient();

  const updateCourse = useMutation(
    trpc.courses.createAttachments.mutationOptions({
      onSuccess: async () => {
        //TODO: invalidate queries get many courses
        if (courseId)
          await queryClient.invalidateQueries(
            trpc.courses.getCourseAttachments.queryOptions({
              courseId: courseId,
            })
          );
        setOpenEdit(false);
        toast.success("Course cover image updated!");
      },
      onError: (error) => {
        toast.error(error.message);
        setDeletingId(null);
      },
    })
  );
  const removeAttachment = useMutation(
    trpc.courses.removeAttachment.mutationOptions({
      onSuccess: async () => {
        if (courseId)
          await queryClient.invalidateQueries(
            trpc.courses.getCourseAttachments.queryOptions({
              courseId: courseId,
            })
          );
        setOpenEdit(false);
        setDeletingId(null);
        toast.success("Attachement deleted!");
      },

      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const handleDeleteBtn = async (id: string) => {
    setDeletingId(id);
    removeAttachment.mutate({ id });
  };
  return (
    <div className="bg-blue-400/10 p-3 ">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-md">Course Attachments</h3>
            {openEdit && (
              <Button
                variant={"outline"}
                onClick={() => setOpenEdit(false)}
                disabled={updateCourse.isPending}
              >
                Cancel
              </Button>
            )}
            {!openEdit && (
              <Button
                className=""
                variant={"outline"}
                onClick={() => setOpenEdit(true)}
                disabled={updateCourse.isPending}
              >
                <PlusCircle className="size-5" /> Add a file
              </Button>
            )}
          </div>
          {!openEdit && (
            <>
              {initialData?.length === 0 && (
                <p className="text-sm mt-2 text-slate-500 italic">
                  No attachments yet
                </p>
              )}
              {initialData?.length > 0 && (
                <div className="space-y-2">
                  {initialData.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <File className="size-4 mr-2 shrink-0" />
                        <p className="text-xs truncate min-w-0">
                          {attachment.name}
                        </p>
                      </div>

                      {deletingId === attachment.id && (
                        <div>
                          <Loader2 className="size-4 animate-spin text-red-500" />
                        </div>
                      )}
                      {deletingId !== attachment.id && (
                        <Button
                          className=""
                          variant={"destructive"}
                          onClick={() => handleDeleteBtn(attachment.id)}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        {openEdit && (
          <div className="">
            <FileUpload
              endpoint="courseAttachment"
              onChange={(url) => {
                if (url) {
                  onSubmit({ url: url });
                }
              }}
            />
            <div className="text-xs text-muted-foreground mt-4 text-center">
              Add anything your students might need to complete the course.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
