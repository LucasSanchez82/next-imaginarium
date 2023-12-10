import { authOptions } from "@/lib/auth";
import { flashDatas } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { PropsWithChildren } from "react";


const isConnectedWrapper = async ({ children }: PropsWithChildren) => {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return <>{children}</>;
  } else {
    await flashDatas.addOne({
      isError: true,
      message: "Vous devez être connecte pour acceder a cette page",
    });
  }
};

export default isConnectedWrapper;
