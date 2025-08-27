"use client";
import { useMemo } from "react";
import "react-quill-new/dist/quill.bubble.css";
import dynamic from "next/dynamic";
interface Props {
  value: string;
}
export const Preview = ({ value }: Props) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );
  return <ReactQuill theme="bubble" value={value} readOnly />;
};
