import { getManyCategories } from "../../types";
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleCameras,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import { IconType } from "react-icons";
import { CategoryItem } from "./category-item";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useFilter } from "@/hooks/use-filter";
import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";
import { SearchInput } from "@/components/search-input";
interface Props {
  categories: getManyCategories;
}
const iconMap: Record<getManyCategories[number]["name"], IconType> = {
  Music: FcMusic,
  Photography: FcOldTimeCamera,
  Fitness: FcSportsMode,
  Accounting: FcSalesPerformance,
  "Computer Science": FcMultipleCameras,
  Filming: FcFilmReel,
  Engineering: FcEngineering,
};
export const Categories = ({ categories }: Props) => {
  const [filter, setFilter] = useFilter();
  const isActive = (filter.category = "");
  return (
    <>
      <ScrollArea className="">
        <div className="flex items-center gap-x-2 pb-2 overflow-x-auto w-full">
          <Button
            onClick={() => setFilter({ category: "" })}
            className={cn(
              "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
              isActive && "border-sky-700 bg-sky-200/20 text-sky-800"
            )}
            variant={"outline"}
            type="button"
          >
            {<Layers size={20} />}
            <span className="truncate">All</span>
          </Button>
          {categories.map((item) => (
            <CategoryItem
              key={item.id}
              label={item.name}
              icon={iconMap[item.name]}
              value={item.id}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <SearchInput />
    </>
  );
};
