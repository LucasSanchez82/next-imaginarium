"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  addCompteSchema,
  editCompteSchema,
  editCompteSchemaWithId,
} from "../zodSchemas/compteSchema";
import { z } from "zod";

export const addCompteToDb = async (user: FormData) => {
  const safeUser = addCompteSchema.safeParse(
    Object.fromEntries(user.entries())
  );
  if (safeUser.success) {
    const compte = await prisma.user.create({ data: safeUser.data });
    console.log(compte);
    revalidatePath("/comptes");
    return `${compte.name} a bien été ajouté`;
  } else {
    console.error("Erreur de type AddCompteToDb() : ", safeUser.error);
    throw Error("données du formulaire invalides", safeUser.error);
  }
};

export const deleteCompteFromDb = async (id: string) => {
  if (id) {
    try {
      await prisma.user.delete({ where: { id } });
      revalidatePath("/comptes");
      return "compte supprimé";
    } catch (error) {
      console.error("Erreur prisma deleteCompteFromDb() : ", error);
      throw Error("Erreur lors de la suppression du compte en base de données", error instanceof Error ? error : undefined);
    }
  } else throw new Error("id invalide");
};

export const editCompteToDb = async (
  data: z.infer<typeof editCompteSchemaWithId>
) => {
  const safeUser = editCompteSchemaWithId.safeParse(data);
  console.log("edit Compte to db 😊😊");
  if (safeUser.success) {
    const editableUser = safeUser.data;
    const editeduser = await prisma.user.update({
      where: { id: editableUser.id },
      data: editableUser,
    });
    revalidatePath("/comptes");
  } else {
    console.error("Erreur de type EditCompteToDb() : ", safeUser.error);
    throw Error("données du formulaire invalides", safeUser.error);
  }
};
