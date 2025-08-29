"use client";

import { PanelLeftCloseIcon, PanelLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { SearchInput } from "@/components/search-input";
import { usePathname } from "next/navigation";

export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const pathName = usePathname();
  const isBrowserPage = pathName === "/browse";
  return (
    <>
      <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background mt-8">
        <Button className="size-9" variant={"outline"} onClick={toggleSidebar}>
          {state === "collapsed" || isMobile ? (
            <PanelLeftIcon className="size-4" />
          ) : (
            <PanelLeftCloseIcon className="size-4" />
          )}
        </Button>
        {isBrowserPage && <SearchInput />}
      </nav>
    </>
  );
};
