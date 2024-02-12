import { z } from "zod";

export const categorieSchema = z.object({
  libelle: z.string({ required_error: "Obligatoire" }).describe("titre"),
  description: z.string().optional().describe("description"),
  color: z
    .string()
    .toLowerCase()
    .regex(/^#[0-9A-F]{6}$/i, {
      message: "doit etre au format couleur hexadecimal : #ffffff",
    })
    .default("#3788d8")
    .describe("couleur"),
  important: z.coerce.boolean().default(false).describe("important"),
  tags: z.array(z.object({
    libelle: z.string().describe("libelle").toLowerCase(),
  })),
});
