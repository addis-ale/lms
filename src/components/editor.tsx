"use client";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";
interface Props {
  onChange: (value: string) => void;
  value: string;
}
export const Editor = ({ onChange, value }: Props) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );
  return (
    <div className="bg-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
};
