"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface Props {
  courseId: string;
  price: number;
}

export const CourseEnrollButton = ({ courseId, price }: Props) => {
  return (
    <Button size={"sm"} className="w-full md:w-auto">
      Enroll for {formatPrice(price)}{" "}
    </Button>
  );
};
