"use server";

import { authOptions } from "@/lib/auth";
import { configRequestEnfantPrismaType, getEnfant } from "@/types/enfantType";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

export const getSpecificEnfants = async (
  searchEnfant: string,
  limit: { skip: number; take: number },
  refreshPages = false,
  configRequestPrisma: configRequestEnfantPrismaType
) => {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const prisma = new PrismaClient();
    const names = searchEnfant.split(" ");

    let enfants: getEnfant[] = [];
    let nbEnfants = 0;

    if (names.length === 2) {
      //chercher Jhon Doe ou Doe Jhon
      const [first, second] = names;
      const options = {
        where: {
          OR: [
            {
              nom: { contains: first },
              prenom: { contains: second },
            },
            {
              nom: { contains: second },
              prenom: { contains: first },
            },
          ],
        },
        ...configRequestPrisma
      };
      enfants = await prisma.enfant.findMany({
        ...options,
        ...limit,
        orderBy: { id: "desc" },
      });
      if (refreshPages) nbEnfants = await prisma.enfant.count({where : options.where});
    } else if (names.length === 1) {
      //chercher Jhon ou Doe
      const name = names[0];
      const options = {
        where: {
          OR: [
            {
              nom: { contains: name },
            },
            {
              prenom: { contains: name },
            },
          ],
        },
        ...configRequestPrisma
      };
      enfants = await prisma.enfant.findMany({
        ...options,
        ...limit,
        orderBy: { id: "desc" },
      });
      if (refreshPages) nbEnfants = await prisma.enfant.count({where : options.where});
    }

    if (refreshPages) {
      const nbPages = Math.ceil(nbEnfants / (limit.take - limit.skip));
      return { enfants, nbPages };
    } else {
      console.log("😭😭");
      console.log(refreshPages);
    }
    return { enfants };
  }
};

