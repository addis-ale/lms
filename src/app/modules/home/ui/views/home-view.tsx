"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import CoursesList from "../components/dashboard-course-list";
import { CheckCircle, Clock } from "lucide-react";
import { InfoCard } from "../components/info-card";

export const HomeView = () => {
  const trpc = useTRPC();
  const { data: courses } = useSuspenseQuery(
    trpc.dashboardCourse.getMany.queryOptions()
  );
  const normalizedCourses = courses.completedCourses.map((course) => ({
    ...course,
    createdAt: new Date(course.createdAt),
    updatedAt: new Date(course.updatedAt),
  }));

  const normalizedCoursesInProgress = courses.coursesInProgress.map(
    (course) => ({
      ...course,
      createdAt: new Date(course.createdAt),
      updatedAt: new Date(course.updatedAt),
    })
  );

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={normalizedCoursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={normalizedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList
        courses={{
          completedCourses: normalizedCourses,
          coursesInProgress: normalizedCoursesInProgress,
        }}
      />
    </div>
  );
};
