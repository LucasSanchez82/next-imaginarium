"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { PropsWithChildren, use, useEffect } from "react";
import { cn } from "@/lib/utils";

//

export function SubmitButton({
  children,
  onload,
  classname
}: PropsWithChildren<{ onload?: () => any, classname?: string; }>) {
  const { pending } = useFormStatus();
  const content = children ?? "Submit";
  useEffect(() => {
    if (pending && onload) {
      onload();
    }
  })

  return (
    <Button className={cn("rounded cursor-pointer p-1", classname)} type="submit">
      {pending ? "..." : content}
    </Button>
  );
}
