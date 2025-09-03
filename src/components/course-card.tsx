"use client";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "./course-progress";

interface Props {
  imageUrl: string;
  price: string;
  category: string;
  id: string;
  title: string;
  chapterCount: number;
  progress: number | null;
}

const CourseCard = ({
  imageUrl,
  price,
  category,
  id,
  title,
  chapterCount,
  progress,
}: Props) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm overflow-hidden transition border rounded-lg p-3 ">
        <div className="relative aspect-video rounded-md overflow-hidden">
          <Image src={imageUrl} alt={title} width={500} height={400} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-2 text-slate-500">
              <div className="bg-sky-500/20 p-2 rounded-full">
                <BookOpen className="text-sky-500 size-5" />
              </div>
              <div className="flex items-center gap-x-1">
                <span>{chapterCount}</span>
                <span>{chapterCount === 1 ? "Chapter" : "Chapters"}</span>
              </div>
            </div>
          </div>
          <div>
            {progress !== null ? (
              <CourseProgress
                size="sm"
                value={progress}
                variant={progress === 100 ? "success" : "default"}
              />
            ) : (
              <p className="text-md md:text-sm font-medium text-slate-700">
                {formatPrice(+price!)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
