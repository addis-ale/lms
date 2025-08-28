"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CourseListHeader = () => {
  return (
    <>
      <div className="px-4 mt-8">
        <Link href={"/teacher/create"}>
          <Button className="">New Course</Button>
        </Link>
      </div>
    </>
  );
};
