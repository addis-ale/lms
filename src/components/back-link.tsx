import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  href: string;
  label: string;
}
export const BackLink = ({ href, label }: Props) => {
  return (
    <div className="p-6 ">
      <div className="flex items-center justify-between">
        <Link
          href={href}
          className="flex items-center text-sm hover:opacity-75 transition font-semibold"
        >
          <ArrowLeft className="size-4 mr-2" />
          {label}
        </Link>
      </div>
    </div>
  );
};
