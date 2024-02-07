"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./ui/button";
import { ButtonHTMLAttributes, PropsWithChildren, use, useEffect } from "react";
import { cn } from "@/lib/utils";

//

export function SubmitButton({
  children,
  onload,
  classname,
  buttonProps
}: PropsWithChildren<{ onload?: () => any, classname?: string; buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>}>) {
  const { pending } = useFormStatus();
  const content = children ?? "Submit";
  useEffect(() => {
    if (pending && onload) {
      onload();
    }
  })

  return (
    <Button {...buttonProps} className={cn("rounded cursor-pointer p-1", classname)} type="submit">
      {pending ? "..." : content}
    </Button>
  );
}
