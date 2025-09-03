"use client";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { CourseProgress } from "@/components/course-progress";
interface Props {
  courseId: string;
}

export const CourseSidebar = ({ courseId }: Props) => {
  const trpc = useTRPC();
  const pathName = usePathname();
  const { data: course } = useQuery(
    trpc.browseCourse.getOne.queryOptions({
      id: courseId,
    })
  );
  const { data: isPurchased } = useQuery(
    trpc.browseCourse.isPurchased.queryOptions({
      courseId,
    })
  );
  if (!course) {
    return null;
  } else
    return (
      <Sidebar>
        <SidebarHeader className="text-sidebar-accent-foreground mt-8">
          <Link href={`/courses/${course.id}`} className="">
            <h1 className="text-2xl font-semibold p-2 mx-auto">
              {course.title}
            </h1>
          </Link>
        </SidebarHeader>
        <div className="px-4 py-2 ">
          <Separator className="opacity-10 text-[#5D6868]" />
        </div>
        {isPurchased && (
          <div className="mt-10">
            <CourseProgress variant="success" value={course.progressCount} />
          </div>
        )}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {course.chapters.map((chapter) => (
                  <SidebarMenuItem key={chapter.chapters.id}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                        pathName?.includes(chapter.chapters.id) &&
                          "bg-linear-to-r/oklch border-[#5D6B68]/10",
                        chapter.userProgress?.isCompleted &&
                          "bg-gradient-to-r from-blue-500 to-sky-500"
                      )}
                      isActive={pathName?.includes(chapter.chapters.id)}
                    >
                      <Link
                        href={`/courses/${courseId}/chapters/${chapter.chapters.id}`}
                      >
                        {!chapter.chapters.isFree && !isPurchased ? (
                          <Lock />
                        ) : chapter.userProgress?.isCompleted ? (
                          <CheckCircle />
                        ) : (
                          <PlayCircle />
                        )}
                        <span className="text-sm font-medium tracking-tight">
                          {chapter.chapters.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <div className="px-4 py-2 ">
            <Separator className="opacity-10 text-[#5D6868]" />
          </div>
          {/* <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                      pathName === item.href &&
                        "bg-linear-to-r/oklch border-[#5D6B68]/10"
                    )}
                    isActive={pathName === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
        </SidebarContent>
        {/* <SidebarFooter className="text-white">
        <DashboardUserButton />
      </SidebarFooter> */}
      </Sidebar>
    );
};
