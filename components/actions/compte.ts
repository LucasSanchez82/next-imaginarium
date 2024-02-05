"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { addCompteSchema } from "../zodSchemas/compteSchema";

export const addCompteToDb = async (user: FormData) => {
  const safeUser = addCompteSchema.safeParse(
    Object.fromEntries(user.entries())
  );
  if (safeUser.success) {
    const compte = await prisma.user.create({ data: safeUser.data });
    console.log(compte);
    revalidatePath("/comptes");
    return `${compte.name} a bien été ajouté`;
  } else throw new Error("données du formulaire invalides", safeUser.error);
};

export const deleteCompteFromDb = async (id: string) => {
  if (id) {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/comptes");
    return "compte supprimé";
  } else throw new Error("id invalide");
};
