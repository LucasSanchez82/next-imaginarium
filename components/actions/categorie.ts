"use server";

import {
  categorieSchema,
  categorieWithIdAndTagsSchema,
  categorieAndMiniTagsSchema,
} from "@/app/(connected)/categorie/zodSchemas";
import { prisma } from "@/lib/prisma";
import { zodParserWrapper } from "@/lib/zodParserWrapper";
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
const parsedCategorieProcessWrapper = async (
  categorieObj: z.infer<typeof categorieSchema>,
  fn: (safeCategorie: z.infer<typeof categorieSchema>) => any
) => {
  return await zodParserWrapper(
    {
      zodSchema: categorieSchema,
      toParse: categorieObj,
      error: "le type de categorie est incorrecte",
    },
    fn
  );
};
const parsedEditCategorieProcessWrapper = async (
  {
    categorieObjNew,
    categorieObjOld,
  }: {
    categorieObjOld: z.infer<typeof categorieWithIdAndTagsSchema>;
    categorieObjNew: z.infer<typeof categorieAndMiniTagsSchema>;
  },
  fn: (safeCategories: {
    categorieObjOld: z.infer<typeof categorieWithIdAndTagsSchema>;
    categorieObjNew: z.infer<typeof categorieAndMiniTagsSchema>;
  }) => any
) => {
  return await zodParserWrapper(
    {
      toParse: categorieObjOld,
      zodSchema: categorieWithIdAndTagsSchema,
      error: "La type de [ancienne categorie] est invalide",
    },
    async (safeCategorieOld) => {
      return await zodParserWrapper(
        {
          toParse: categorieObjNew,
          zodSchema: categorieAndMiniTagsSchema,
          error: "La type de [nouvelle categorie] est invalide",
        },
        async (safeCategorieNew) => {
          return await fn({
            categorieObjOld: safeCategorieOld,
            categorieObjNew: safeCategorieNew,
          });
        }
      );
    }
  );
};
export const addCategorieToDb = async (
  categorieObj: z.infer<typeof categorieSchema>
) => {
  return parsedCategorieProcessWrapper(
    categorieObj,
    async ({ color: couleur, important, libelle, tags, description }) => {
      const isAlreadyCategorie = await prisma.categorie.findFirst({
        where: { libelle },
      });
      const frontTags = tags.map((tag) => tag.libelle);
      const reliedTags = await processTags(frontTags);
      if (!isAlreadyCategorie) {
        try {
          const createdCategorie = await prisma.categorie.create({
            data: {
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
          });
          revalidatePath("/categorie");
          return `Categorie ${createdCategorie.libelle} ajouté avec succès`;
        } catch (error) {
          console.error("🚀 ~ addCategorie ~ error:", error);
          throw Error("Erreur Serveur lors de l'ajoût de la categorie");
        }
      } else throw Error("La categorie existe déjà");
    }
  );
};

export const editCategorieInDb = async (
  categorieObjOld: z.infer<typeof categorieWithIdAndTagsSchema>,
  categorieNew: z.infer<typeof categorieAndMiniTagsSchema>
) => {
  return await parsedEditCategorieProcessWrapper(
    { categorieObjOld: categorieObjOld, categorieObjNew: categorieNew }, //passed unSafed data
    async ({
      categorieObjOld: safeCategorieOld,
      categorieObjNew: safeCategorieNew,
    }) => {
      const existingCategorie = await prisma.categorie.findFirst({
        where: {
          id: safeCategorieOld.id,
          libelle: safeCategorieOld.libelle,
        },
        include: { tags: { include: { tag: true } } },
      });
      if (existingCategorie) {
        const deletedTagsValues: { libelle: string; id: number }[] = [];
        const sameTagsValues: string[] = [];
        const createdtagsValues: string[] = safeCategorieNew.tags.filter(
          (tag) =>
            existingCategorie.tags.every(
              (existingtag) => existingtag.tag.libelle !== tag
            )
        );
        existingCategorie.tags.forEach((existingtag) => {
          if (
            safeCategorieNew.tags.every(
              (newTag) => newTag !== existingtag.tag.libelle
            )
          ) {
            deletedTagsValues.push({
              libelle: existingtag.tag.libelle,
              id: existingtag.tag.id,
            });
          } else {
            sameTagsValues.push(existingtag.tag.libelle);
          }
        });

        try {
          const updatedCategorie = await prisma.categorie.update({
            where: { id: existingCategorie.id },
            data: {
              couleur: safeCategorieNew.couleur,
              important: safeCategorieNew.important,
              libelle: safeCategorieNew.libelle,
              description: safeCategorieNew.description,
              tags: {
                createMany: {
                  data: await processTags(createdtagsValues),
                },
                deleteMany: [
                  ...deletedTagsValues.map((tag) => ({
                    idTag: tag.id,
                    idCategorie: existingCategorie.id,
                  })),
                ],
              },
            },
          });
          revalidatePath("/categorie");
        } catch (error) {
          console.error("🚀 ~ editCategorieInDb ~ error:", error);
          throw Error("Erreur Serveur lors de la modification de la categorie");
        }
      } else throw Error("Categorie introuvable");
    }
  );
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
