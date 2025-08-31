"use client";

import { GetManyCourses } from "../app/modules/browser/types";
import CourseCard from "./course-card";

interface Props {
  items: GetManyCourses;
}
const CoursesList = ({ items }: Props) => {
  return (
    <div className="">
      <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id}>
            <CourseCard
              imageUrl={item.imageUrl!}
              price={item.price!}
              category={item.categoryName}
              id={item.id}
              title={item.title}
              chapterCount={item.chapterCount}
              progress={item.progress}
            />
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground">
          No courses found
        </div>
      )}
    </div>
  );
};

export default CoursesList;
