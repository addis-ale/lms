"use client";

import { useRouter } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboardIcon,
  ListCheck,
  Loader2,
} from "lucide-react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { TitleForm } from "../components/title-form";
import { DescriptionForm } from "../components/description-form";
import { ImageForm } from "../components/image-form";
import { CategoryForm } from "../components/category-form";
import { CategoryGetOne } from "../../types";
import { PriceForm } from "../components/price-form";
import { IconBadge } from "@/components/icon-badge";
import { AttachmentForm } from "../components/attachment-form";
import { ChaptersForm } from "../components/chapters-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "@/app/modules/chapters/ui/components/chapter-actions";
import { useConfirm } from "@/hooks/use-confirm";
import { fireConfetti } from "@/lib/confettii";

interface Props {
  courseId: string;
}
export const CourseIdView = ({ courseId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data } = useSuspenseQuery(
    trpc.courses.getOne.queryOptions({ id: courseId })
  );
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions()
  );
  const { data: courseAttachments } = useSuspenseQuery(
    trpc.attachments.getMany.queryOptions({
      courseId: courseId,
    })
  );
  const { data: courseChapters } = useSuspenseQuery(
    trpc.chapters.getMany.queryOptions({
      courseId: courseId,
    })
  );
  const requiredFields = [
    data.title,
    data.description,
    data.imageUrl,
    data.price,
    data.categoryId,
    courseChapters?.some((chapter) => chapter.isPublished),
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);
  const removeCourse = useMutation(
    trpc.courses.remove.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.courses.getOne.queryOptions({ id: courseId })
          ),
          // TODO:invalidate get many course
        ]);

        router.push(`/teacher/courses/`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const publishCourse = useMutation(
    trpc.courses.update.mutationOptions({
      onSuccess: async (updatedCourse) => {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.courses.getOne.queryOptions({ id: courseId })
          ),
          // TODO:invalidate get many course
        ]);
        if (updatedCourse.isPublished) {
          fireConfetti();
        }
      },
      onError: (error) => {
        toast.message(error.message);
      },
    })
  );
  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `The following action will remove this chapter`
  );
  const handleRemoveChapter = async () => {
    const ok = await confirmRemove();
    if (!ok) return;

    await removeCourse.mutateAsync({ id: courseId });
  };
  const handlePublishCourse = (isPublished: boolean) => {
    if (isPublished) {
      publishCourse.mutate({
        id: courseId,
        isPublished: false,
      });
    } else {
      publishCourse.mutate({
        id: courseId,
        isPublished: true,
      });
    }
  };
  const initialTitleData = {
    title: data?.title,
  };
  const initialDescData = {
    description: data?.description ?? "",
  };
  const initalImageData = {
    imageUrl: data?.imageUrl ?? "",
  };
  const initialCatData = {
    categoryId: data?.categoryId ?? "",
  };
  const initialPriceData = {
    price: data?.price ?? "",
  };
  const initialCourseAttachmentData = courseAttachments?.map((attachment) => ({
    url: attachment?.url,
    name: attachment?.name,
    id: attachment?.id,
  }));
  const initialChaptersData = courseChapters?.map((chapter) => ({
    title: chapter.title,
    id: chapter.id,
    isPublished: chapter?.isPublished ?? false,
    isFree: chapter?.isFree ?? false,
  }));
  return (
    <>
      <RemoveConfirmation />
      {!data.isPublished && (
        <Banner
          variant={"warning"}
          label="This course is unpublished, It will not be visible to the students"
        />
      )}
      <div className="p-6 mt-8 relative">
        {/* make full screen blocking component and reuse it */}
        {(removeCourse.isPending || publishCourse.isPending) && (
          <div className="absolute h-full w-full bg-slate-500/20 runded-md top-0 right-0 flex items-center justify-center">
            <Loader2 className="animate-spin size-6" />
          </div>
        )}
        <div className="flex flex-col space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-bold">Course setup</h1>
              <p className="text-sm text-muted-foreground">
                Complete all fields {completionText}
              </p>
            </div>
            <ChapterActions
              onPublish={handlePublishCourse}
              disabled={
                !isComplete || removeCourse.isPending || publishCourse.isPending
              }
              isPublished={data?.isPublished ?? false}
              onRemove={handleRemoveChapter}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-y-4">
              <IconBadge
                icon={LayoutDashboardIcon}
                title={"Customize your course"}
              />
              <div className=" flex flex-col space-y-4">
                <TitleForm courseId={courseId} initialData={initialTitleData} />
                <DescriptionForm
                  initialData={initialDescData}
                  courseId={courseId}
                />
                <ImageForm initialData={initalImageData} courseId={courseId} />
                <CategoryForm
                  initialData={initialCatData}
                  courseId={courseId}
                  options={(categories || [])?.map((cat: CategoryGetOne) => ({
                    label: cat.name,
                    value: cat.id,
                  }))}
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-6">
              <div className="flex flex-col gap-y-4">
                <IconBadge icon={ListCheck} title={"Course chapters"} />
                <ChaptersForm
                  initialData={initialChaptersData || []}
                  courseId={courseId}
                />
              </div>
              <div className="flex flex-col gap-y-4">
                <IconBadge icon={CircleDollarSign} title="Sell your course" />
                <PriceForm initialData={initialPriceData} courseId={courseId} />
              </div>
              <div className="flex flex-col gap-y-4">
                <IconBadge icon={File} title="Resources & Attachments" />
                <AttachmentForm
                  initialData={initialCourseAttachmentData || []}
                  courseId={courseId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
