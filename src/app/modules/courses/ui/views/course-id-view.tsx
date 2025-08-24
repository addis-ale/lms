"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { CircleDollarSign, LayoutDashboardIcon, ListCheck } from "lucide-react";
import { TitleForm } from "../components/title-form";
import { DescriptionForm } from "../components/description-form";
import { ImageForm } from "../components/image-form";
import { CategoryForm } from "../components/category-form";
import { CategoryGetOne } from "../../types";
import { PriceForm } from "../components/price-form";

interface Props {
  courseId: string;
}
export const CourseIdView = ({ courseId }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.courses.getOne.queryOptions({ id: courseId })
  );
  const { data: categories } = useQuery(
    trpc.courses.getManyCategory.queryOptions()
  );
  const requiredFields = [
    data.title,
    data.description,
    data.imageUrl,
    data.price,
    data.categoryId,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
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
  return (
    <div className="p-6 mt-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-bold">Course setup</h1>
          <p className="text-sm text-muted-foreground">
            Complete all fields {completionText}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-2">
              <span className="p-2 bg-blue-400/30 rounded-full">
                <LayoutDashboardIcon className="size-5" />
              </span>
              <h2 className="text-xl font-semibold">Customize your course</h2>
            </div>
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
            <div>
              <div className="flex items-center gap-x-2">
                <span className="p-2 bg-blue-400/30 rounded-full">
                  <ListCheck className="size-5" />
                </span>
                <h2 className="text-xl font-semibold">Course chapters</h2>
              </div>
              <div>TODO</div>
            </div>
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <span className="p-2 bg-blue-400/30 rounded-full">
                  <CircleDollarSign className="size-5" />
                </span>
                <h2 className="text-xl font-semibold">Sell your course</h2>
              </div>
              <PriceForm initialData={initialPriceData} courseId={courseId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
