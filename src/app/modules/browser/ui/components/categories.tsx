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
  return (
    <ScrollArea className="">
      <div className="flex items-center gap-x-2 pb-2 overflow-x-auto w-full">
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
  );
};
