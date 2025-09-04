import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronDownIcon,
  GraduationCap,
  LogIn,
  LogOutIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const DashboardUserButton = () => {
  const router = useRouter();
  const pathName = usePathname();
  const isTeacherPage = pathName.startsWith("/teacher");
  const isPlayerPage = pathName.includes("/tchapter");
  const isMobile = useIsMobile();
  const { data, isPending } = authClient.useSession();
  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };
  if (isPending) {
    return null;
  }
  if (!data?.user) {
    return (
      <Link
        href={"/sign-in"}
        className="w-full gap-2 flex items-center justify-center rounded-md p-2 bg-primary/50 hover:bg-linear-to-r/oklch border-[#5D6B68]/10"
      >
        <LogIn className="size-5" />
        Sign In
      </Link>
    );
  }
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger
          asChild
          className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2"
        >
          <div>
            {data.user.image ? (
              <Avatar>
                <AvatarImage src={data.user.image} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            ) : (
              <GeneratedAvatar
                seed={data.user.name}
                variant="initials"
                className="size-9 mr-3"
              />
            )}
            <div className="flex flex-col gap-0.5 overflow-hidden text-left flex-1 min-w-0 ">
              <p className="text-sm truncate w-full">{data.user.name}</p>
              <p className="text-xs truncate w-full">{data.user.email}</p>
            </div>
            <ChevronDownIcon className="size-4 shrink-0" />
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription>{data.user.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            {isTeacherPage || isPlayerPage ? (
              <Link href={"/"} className="w-full">
                <Button className="w-full">
                  <BookOpen className="size-4 text-white" />
                  Student Mode
                </Button>
              </Link>
            ) : (
              <Link href={"/teacher/tcourses"} className="w-full">
                <Button className="w-full">
                  <GraduationCap className="size-4 text-white" />
                  Teacher Mode
                </Button>
              </Link>
            )}
            <Button variant={"outline"} onClick={onLogout}>
              <LogOutIcon className="size-4 text-black" />
              Exit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
        {data.user.image ? (
          <Avatar>
            <AvatarImage src={data.user.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={data.user.name}
            variant="initials"
            className="size-9 mr-3"
          />
        )}
        <div className="flex flex-col gap-0.5 overflow-hidden text-left flex-1 min-w-0 ">
          <p className="text-sm truncate w-full">{data.user.name}</p>
          <p className="text-xs truncate w-full">{data.user.email}</p>
        </div>
        <ChevronDownIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium truncate">{data.user.name}</span>
            <span className="text-sm font-normal text-muted-foreground truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isTeacherPage || isPlayerPage ? (
          <DropdownMenuItem
            className="cursor-pointer flex items-center justify-between"
            asChild
          >
            <Link href={"/"}>
              Student Mode
              <BookOpen />
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="cursor-pointer flex items-center justify-between"
            asChild
          >
            <Link href={"/teacher/tcourses"}>
              Teacher Mode
              <GraduationCap />
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer flex items-center justify-between"
          onClick={onLogout}
        >
          <LogOutIcon className="size-4 text-black" />
          Exit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
