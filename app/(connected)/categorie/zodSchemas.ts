import { nullable, z } from "zod";
const color = z
  .string()
  .toLowerCase()
  .regex(/^#[0-9A-F]{6}$/i, {
    message: "doit etre au format couleur hexadecimal : #ffffff",
  })
  .default("#3788d8")
  .describe("couleur");

export const categorieSchema = z.object({
  libelle: z.string({ required_error: "Obligatoire" }).describe("titre"),
  description: z.string().describe("description").optional().nullable(),
  color: color,
  important: z.coerce.boolean().default(false).describe("important"),
  tags: z.array(
    z.object({
      libelle: z.string().describe("libelle").toLowerCase(),
    })
  ),
});

const categorieTagSchema = {
  idTag: z.number(),
  idCategorie: z.number(),
};

const tagSchema = z.object({
  id: z.number(),
  libelle: z.string(),
  description: z.string().nullable(),
  couleur: z.string().nullable(),
});
export const categorieWithIdAndTagsSchema = categorieSchema
  .omit({ color: true })
  .extend({
    id: z.number(),
    couleur: color.nullable(),
    tags: z.array(
      z.object({
        ...categorieTagSchema,
        tag: tagSchema,
      })
    ),
  });

export const categorieAndMiniTagsSchema = categorieWithIdAndTagsSchema.omit({tags: true, id: true}).extend({
  tags: z.array(z.string())
});
