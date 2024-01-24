"use client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";

export const SubmitButton = () => {
  const { pending, data } = useFormStatus();
  useEffect(() => {
    console.log(data);
  }, [data]);
  return <Button type="submit" aria-disabled={pending}>{pending ? "..." : "Ajouter"}</Button>;
};
