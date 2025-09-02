"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useFilter } from "@/hooks/use-filter";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const SearchInput = () => {
  const [{ search }, setSearch] = useFilter(); // Nuqs query state
  const [value, setValue] = useState(search);

  // Sync local input with global state if updated externally
  useEffect(() => {
    setValue(search);
  }, [search]);
  // Update immediately on Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearch({ search: value });
    }
  };

  return (
    <div className="relative">
      <SearchIcon className="size-4 absolute top-3 left-3 text-shadow-slate-600" />
      <Input
        className={cn(
          "rounded-full pl-9 bg-slate-100 focus-visible:ring-slate-200 transition-all duration-300 ease-in-out focus:md:w-[500px] w-[300px]",
          search ? "md:w-[500px]" : "md:w-[300px]"
        )}
        placeholder="Search for a course..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
