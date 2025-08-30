"use client";

import { LogOutIcon, PanelLeftCloseIcon, PanelLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";

export const CourseDetailNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  return (
    <>
      <nav className="flex  justify-between items-center p-5 border-b bg-background mt-8">
        <Button className="size-9" variant={"outline"} onClick={toggleSidebar}>
          {state === "collapsed" || isMobile ? (
            <PanelLeftIcon className="size-4" />
          ) : (
            <PanelLeftCloseIcon className="size-4" />
          )}
        </Button>
        <Link href="/">
          <Button>
            <LogOutIcon />
            Exit
          </Button>
        </Link>
      </nav>
    </>
  );
};
