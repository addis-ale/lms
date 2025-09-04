import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props {
  numberOfItems: number;
  label: string;
  icon: LucideIcon;
  variant?: "default" | "success";
}
export const InfoCard = ({
  numberOfItems,
  label,
  icon: Icon,
  variant,
}: Props) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
      <div
        className={cn(
          " p-2 rounded-full",
          variant === "success" ? "bg-teal-500/20" : "bg-sky-500/20"
        )}
      >
        <Icon
          className={cn(
            "size-6",
            variant === "success" ? "text-teal-500" : "text-sky-500"
          )}
        />
      </div>
      <div>
        <p className="font-medium">{label}</p>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span>{numberOfItems}</span>
          <span>
            {numberOfItems === 1 || numberOfItems === 0 ? "Course" : "Courses"}
          </span>
        </div>
      </div>
    </div>
  );
};
