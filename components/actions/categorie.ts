"use server";

import { categorieSchema } from "@/app/(connected)/categorie/zodSchemas";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authWrapper } from "./authWrapper";

/**
 * Processes the tags by querying the database for existing tags and creating new tags if necessary.
 *
 * @param frontTags - An array of tags to be processed.
 * @returns An array of objects containing the IDs of the processed tags.
 */
const processTags = async (frontTags: string[]) => {
  const [commonsDbTags, biggerId] = await prisma.$transaction([
    prisma.tag.findMany({
      select: { libelle: true, id: true },
      where: { libelle: { in: frontTags } },
    }),
    prisma.tag.findFirst({ select: { id: true }, orderBy: { id: "desc" } }),
  ]);
  const unCommonsDbTags = frontTags.filter((tag) =>
    commonsDbTags.every((t) => t.libelle !== tag)
  );
  const tagsGoingToBeCreated = unCommonsDbTags.map((tag, index) => ({
    libelle: tag,
    id: (biggerId?.id || 0) + index + 1,
  }));
  const createdTags = await prisma.tag.createMany({
    data: tagsGoingToBeCreated,
    skipDuplicates: true,
  });

  return [
    ...tagsGoingToBeCreated.map((tag) => ({ idTag: tag.id })),
    ...commonsDbTags.map((tag) => ({ idTag: tag.id })),
  ];
};
export const upSertCategorieToDb = async (
  categorieObj: z.infer<typeof categorieSchema>,
  id: number | undefined = undefined
) => {
  const parsedCategorie = categorieSchema.safeParse(categorieObj);
  console.log({ categorieObj });
  if (parsedCategorie.success) {
    const {
      color: couleur,
      important,
      libelle,
      description,
      tags,
    } = parsedCategorie.data;
    const isAlreadyCategorie = await prisma.categorie.findFirst({
      where: { libelle },
    });
      const frontTags = tags.map((tag) => tag.libelle);
      const reliedTags = await processTags(frontTags);
      console.log({isAlreadyCategorie, id: !!id})
      if (!isAlreadyCategorie || id) {
        try {
          const createdCategorie = await prisma.categorie.upsert({
            where: {id, libelle: id ? undefined : libelle},
            create: {
              couleur,
              important,
              libelle,
              description,
              tags: {
                createMany: {
                  data: reliedTags,
                },
              },
            },
            update: {
              couleur,
              important,
              libelle,
              description,
              // tags: {
              //   updateMany: [
              //     {
              //       data: { idTag: reliedTags[0].idTag },
              //       where: {  },
              //     }
              //   ],
              // },
            }
          });
          revalidatePath("/categorie");
          return `Categorie ${createdCategorie.libelle} ajouté avec succès`;
        } catch (error) {
          console.error("🚀 ~ addCategorie ~ error:", error);
          throw Error("Erreur Serveur lors de l'ajoût de la categorie");
        }
      } else throw Error("La categorie existe déjà");
  } else {
    throw Error("le type de categorie est incorrecte", parsedCategorie.error);
  }
};

export const getCategoriesFromDb = async () => {
  const categories = await prisma.categorie.findMany();
  return categories;
};

export const deleteCategorieFromDb = async (categorieId: number) => {
  await authWrapper(async (session) => {
    if (session?.user.isAdmin) {
      const selectedCategorie = await prisma.categorie.findUnique({
        where: { id: categorieId },
        include: { tags: true },
      });
      if (selectedCategorie) {
        try {
          if (selectedCategorie.tags.length > 0) {
            await prisma.$transaction([
              ...selectedCategorie.tags.map((tag) =>
                prisma.categorieTag.delete({
                  where: {
                    idCategorie_idTag: {
                      idCategorie: tag.idCategorie,
                      idTag: tag.idTag,
                    },
                  },
                })
              ),
            ]);
          }
        } catch (error) {
          console.error("🚀 ~ deleteCategorie ~ error:", error);
          console.log({ selectedCategorie });

          throw Error(
            "Erreur Serveur lors de la suppression des tags reliés la categorie"
          );
        }
        try {
          const categorie = await prisma.categorie.delete({
            where: { id: categorieId },
          });
          revalidatePath("/categorie");
          return `Categorie ${categorie.libelle} supprimé avec succès`;
        } catch (error) {
          console.error("🚀 ~ deleteCategorie ~ error:", error);
          throw Error("Erreur Serveur lors de la suppression de la categorie");
        }
      } else throw Error("La categorie n'existe pas");
    } else
      throw Error("Vous n'avez pas les droits pour supprimer une categorie");
  });
};
