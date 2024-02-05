"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { PropsWithChildren, use, useEffect } from "react";

//

export function SubmitButton({
  children,
  onload,
}: PropsWithChildren<{ onload?: () => any }>) {
  const { pending } = useFormStatus();
  const content = children ?? "Submit";
  useEffect(() => {
    if (pending && onload) {
      onload();
    }
  })

  return (
    <Button className="rounded cursor-pointer p-1" type="submit">
      {pending ? "..." : content}
    </Button>
  );
}
