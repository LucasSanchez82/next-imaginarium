import { type ClassValue, clsx } from "clsx";
import { getServerSession } from "next-auth";
import { twMerge } from "tailwind-merge";
import { authOptions } from "./auth";

export type flashDataType = {isError: boolean, message: string};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isVerified = async () => {
  const session = await getServerSession(authOptions);
  return !!session?.user.isVerified;
};

export const isAdmin = async () => {
  const session = await getServerSession(authOptions);
  return !!session?.user.isAdmin;
};


export class flashDatas {
  static getAll = async () => {
    const session = await getServerSession(authOptions);

    if (session?.flashDatas) {
      return session.flashDatas;
    } else {
      return [];
    }
  };

  static addMany = async (flashDatas: flashDataType[]) => {
    const session = await getServerSession(authOptions);

    if (session?.flashDatas) {
      session.flashDatas = [...flashDatas, ...session.flashDatas];
    }
  };

  static addOne = async (flashData: flashDataType) => {
    await this.addMany([flashData]);
  }

  static deleteAll = async () => {
    const session = await getServerSession(authOptions);

    delete session?.flashDatas;
  };
}
