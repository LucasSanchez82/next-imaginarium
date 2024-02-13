"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  addCompteSchema,
  confirmPasswordSchema,
  editCompteSchema,
  editCompteSchemaWithId,
} from "../zodSchemas/compteSchema";
import { z } from "zod";
import { authWrapper } from "./authWrapper";
import { compare, hash } from "bcryptjs";

export const addCompteToDb = async (user: FormData) => {
  const safeUser = addCompteSchema.safeParse(
    Object.fromEntries(user.entries())
  );
  if (safeUser.success) {
    let hashedPassword: string | null = null;
    try{
      hashedPassword = await hash(safeUser.data.password, 12);
    }catch(error){
      console.error("Erreur bcrypt addCompteToDb() : ", error);
      throw Error(
        "Erreur lors du hashage du mot de passe",
        error instanceof Error ? error : undefined
      );
    }
    if(hashedPassword){
      try{
        const compte = await prisma.user.create({ data: {...safeUser.data, password: hashedPassword} });
        revalidatePath("/comptes");
        return `${compte.name} a bien été ajouté`;
      }catch(error){
        console.error("Erreur prisma addCompteToDb() : ", error);
        throw Error(
          "Erreur lors de l'ajout du compte en base de données",
          error instanceof Error ? error : undefined
        );
      }
    }else throw Error("Mot de passe hashé null");
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
      throw Error(
        "Erreur lors de la suppression du compte en base de données",
        error instanceof Error ? error : undefined
      );
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

const resetPasswordProcess = async (
  oldPassword: string,
  newPassword: string
) => {
  return await authWrapper(async (session) => {
    if (session) {
      const oldUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      });
      if (oldUser) {
        const passwordMatch = await compare(oldPassword, oldUser?.password);
        console.log({
          oldPassword,
          oldUserDb: oldUser?.password,
          passwordMatch,
        });
        if (passwordMatch) {
          const hashedpassword = await hash(newPassword, 12);
          await prisma.user.update({
            where: { id: session?.user.id },
            data: {
              password: hashedpassword,
            },
          });
          return "Mot de passe modifié avec succès";
        } else throw Error("Mot de passe incorrect");
      } else throw Error("Utilisateur introuvable");
    } else throw Error("Session invalide : vous devez être connecté");
  });
};

export const resetPassword = async (
  data: z.infer<typeof confirmPasswordSchema>
) => {
  const safeData = confirmPasswordSchema.safeParse(data);
  if (safeData.success) {
    const { oldPassword, newPassword, confirmPassword } = safeData.data;
    if (newPassword === confirmPassword) {
      return await resetPasswordProcess(oldPassword, newPassword);
    } else {
      throw new Error("les mots de passe ne correspondent pas");
    }
  } else {
    console.error("Erreur de type resetPassword() : ", safeData.error);
    throw Error("données du formulaire invalides", safeData.error);
  }
};
