"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons";
import { useFilter } from "@/hooks/use-filter";
interface Props {
  label: string;
  icon?: IconType;
  value?: string;
}
export const CategoryItem = ({ label, icon: Icon, value }: Props) => {
  const [filter, setFilter] = useFilter();
  const isActive = value === filter.category;
  return (
    <Button
      onClick={() => setFilter({ category: value })}
      className={cn(
        "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
        isActive && "border-sky-700 bg-sky-200/20 text-sky-800"
      )}
      variant={"outline"}
      type="button"
    >
      {Icon && <Icon size={20} />}
      <span className="truncate">{label}</span>
    </Button>
  );
};
