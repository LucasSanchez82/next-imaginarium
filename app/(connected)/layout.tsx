import AutoForm from "@/components/ui/auto-form";
import { toast } from "@/components/ui/use-toast";
import { authOptions } from "@/lib/auth";
import { flashDatas } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

const isConnectedWrapper = async ({ children }: PropsWithChildren) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    await flashDatas.addOne({isError: true, message: 'Vous devez être connecte pour acceder a cette page'});
  } else {
    return <>{children}</>;
  }
};

export default isConnectedWrapper;
