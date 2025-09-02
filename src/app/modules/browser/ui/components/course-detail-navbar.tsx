"use client";

import Link from "next/link";
import { LogOutIcon, PanelLeftCloseIcon, PanelLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
export const CourseDetailNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  return (
    <>
      <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background mt-8 justify-between ">
        <Button className="size-9" variant={"outline"} onClick={toggleSidebar}>
          {state === "collapsed" || isMobile ? (
            <PanelLeftIcon className="size-4" />
          ) : (
            <PanelLeftCloseIcon className="size-4" />
          )}
        </Button>
        <Link href="/search">
          <Button>
            <LogOutIcon />
            Exit
          </Button>
        </Link>
      </nav>
    </>
  );
};
