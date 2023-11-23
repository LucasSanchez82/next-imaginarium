"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import React from "react";

const Form = ({ idEnfant }: { idEnfant: string }) => {
  const router = useRouter();
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const form = event.target;
    if (form instanceof HTMLFormElement) {
      const formDatas = new FormData(form);
      formDatas.append("idEnfant", idEnfant);

      const response = await fetch("/api/enfants/dossier", {
        method: "POST",
        body: formDatas,
      });
      const res = await response.json();

      if (response.ok) {
        toast({
          variant: "default",
          title: res.message || "Image telecharge avec succes",
        });
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur lors du telechargement",
          description: res.error || "",
        });
      }
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="md:w-8/12 lg:w-5/12 px-8 py-10 m-auto flex flex-col items-center"
    >
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="file">Dossier enfant</Label>
        <Input id="file" name="file" type="file" accept=".pdf" />
      </div>
      <div>
        <Input type="submit" value="telecharger" />
      </div>
    </form>
  );
};

export default Form;
