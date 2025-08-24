import { ComponentType, SVGProps } from "react";

interface Props {
  title: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}
export const IconBadge = ({ title, icon: Icon }: Props) => {
  return (
    <div className="flex items-center gap-x-2">
      <span className="p-2 bg-blue-400/30 rounded-full">
        {<Icon className="size-5" />}
      </span>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
};
