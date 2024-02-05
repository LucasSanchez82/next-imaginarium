"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/utils";
import { enfantSchema } from "@/types/enfantSchemas";
import { configRequestEnfantPrismaType, getEnfant } from "@/types/enfantType";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const getSpecificEnfants = async (
  searchEnfant: string,
  limit: { skip: number; take: number },
  refreshPages = false,
  configRequestPrisma: configRequestEnfantPrismaType
) => {
  const session = await getServerSession(authOptions);
  if (session?.user) {
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
        ...configRequestPrisma,
      };
      enfants = await prisma.enfant.findMany({
        ...options,
        ...limit,
        orderBy: { id: "desc" },
      });
      if (refreshPages)
        nbEnfants = await prisma.enfant.count({ where: options.where });
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
        ...configRequestPrisma,
      };
      enfants = await prisma.enfant.findMany({
        ...options,
        ...limit,
        orderBy: { id: "desc" },
      });
      if (refreshPages)
        nbEnfants = await prisma.enfant.count({ where: options.where });
    }

    if (refreshPages) {
      const nbPages = Math.ceil(nbEnfants / (limit.take - limit.skip));
      return { enfants, nbPages };
    } else {
      return { enfants };
    }
  }
};

export const addEnfantServer = async (values: {
  nom: string;
  prenom: string;
  dateNaissance: Date;
  telephone?: string | undefined;
  email?: string | undefined;
}) => {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const parsedValues = enfantSchema.safeParse(values);
    if (parsedValues.success) {
      const datas = parsedValues.data;
      try {
        await prisma.enfant.create({
          data: {
            ...datas,
            idReferent: session.user.id,
          },
        });
        revalidatePath("/enfants");
        return "Enfant ajouté avec succès";
      } catch (error) {
        console.error("Error", error);
        throw Error("Erreur du serveur à ajouter l'enfant");
      }
    } else {
      console.error("🚀 ~ parsedValues:", parsedValues);

      throw Error(`Informations enfant corrompus `);
    }
  }
};

export const deleteEnfantServer = async (id: number) => {
  const session = await getServerSession(authOptions);
  if (session?.user) {
      let enfant;
      try{
        enfant = await prisma.enfant.findUnique({ where: { id } });
      }catch(error){
        console.error("🚀 ~ file: enfant.ts:120 ~ deleteEnfantServer ~ error:", error)
        throw Error("Erreur du serveur à trouver l'enfant par l'identifiant");
      }
      if (enfant) {
        if((enfant.idReferent === session.user.id) || session.user.isAdmin){

          try {
            const deletedEnfant = await prisma.enfant.delete({
              where: {
                id,
              },
            });
            revalidatePath("/enfants");
            return `[${deletedEnfant.prenom} ${deletedEnfant.nom}] supprimé avec succès`;
          } catch (error) {
            console.error("🚀 ~ file: enfant.ts:131 ~ deleteEnfantServer ~ error:", error)
            throw Error("Erreur du serveur à supprimer l'enfant");
          }
        }else throw Error("Erreur, vous n'avez pas les droits pour supprimer cet enfant");
      } else {
        throw Error("Erreur, l'enfant n'existe pas");
      }
  } else {
    throw Error("Erreur, l'utilisateur doit etre connecte");
  }
};
