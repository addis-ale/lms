"use client";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChapterActionProps {
  disabled: boolean;
  isPublished: boolean;
  onRemove: () => void;
  onPublish: (value: boolean) => void;
}
export const ChapterActions = ({
  disabled,

  isPublished,
  onRemove,
  onPublish,
}: ChapterActionProps) => {
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={() => onPublish(isPublished)}
        disabled={disabled}
        variant={"outline"}
        size={"sm"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button size={"sm"} variant={"destructive"} onClick={onRemove}>
        <Trash />
      </Button>
    </div>
  );
};
