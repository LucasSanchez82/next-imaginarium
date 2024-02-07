"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./ui/button";
import { ButtonHTMLAttributes, PropsWithChildren, use, useEffect } from "react";
import { cn } from "@/lib/utils";

//

export function SubmitButton({
  children,
  onload,
  className
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { onload?: () => any}>) {
  const { pending } = useFormStatus();
  const content = children ?? "Submit";
  useEffect(() => {
    if (pending && onload) {
      onload();
    }
  })

  return (
    <Button className={cn("rounded cursor-pointer p-1", className)} type="submit">
      {pending ? "..." : content}
    </Button>
  );
}
