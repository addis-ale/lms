"use client";
import { GetOneCourse } from "@/app/modules/browser/types";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface Props {
  item: GetOneCourse;
}

const CourseCard = ({ item }: Props) => {
  return (
    <Link href={`/courses/${item.id}`}>
      <div className="group hover:shadow-sm overflow-hidden transition border rounded-lg p-3 ">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image src={item.imageUrl!} alt={item.title} fill />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {item.title}
          </div>
          <p className="text-xs text-muted-foreground">{item.categoryName}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-2 text-slate-500">
              <div className="bg-sky-500/20 p-2 rounded-full">
                <BookOpen className="text-sky-500 size-5" />
              </div>
              <div className="flex items-center gap-x-1">
                <span>{item.chapterCount}</span>
                <span>{item.chapterCount === 1 ? "Chapter" : "Chapters"}</span>
              </div>
            </div>
          </div>
          {item.progress !== null ? (
            <div>TODO: Progress component</div>
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700">
              {formatPrice(+item.price!)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
