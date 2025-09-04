"use client";

import CourseCard from "@/components/course-card";
import { GetManyDashboardCourses } from "../../types";

interface Props {
  courses: GetManyDashboardCourses;
}

const CoursesList = ({ courses }: Props) => {
  const items = [...courses.coursesInProgress, ...courses.completedCourses];

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id}>
            <CourseCard
              imageUrl={item.imageUrl!}
              price={item.price!}
              category={item.category.name}
              id={item.id}
              title={item.title}
              chapterCount={item.totalChapters}
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
