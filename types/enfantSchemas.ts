import z from "zod";

export const addEnfantSchema = z.object({
  nom: z
    .string({ required_error: "nom est requis" })
    .min(2, { message: " doit faire au moins 2 caracteres" })
    .describe("Nom :"),
  prenom: z
    .string({ required_error: "prenom est requis" })
    .min(2, { message: "doit faire au moins 2 caracteres" })
    .describe("Prenom :"),
  telephone: z
    .string()
    .regex(/0\d{1}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}/, {
      message: "doit etre composé de 10 chiffres",
    })
    .trim()
    .describe("Telephone :")
    .optional(),
  email: z
    .string()
    .email({ message: "doit etre un email" })
    .toLowerCase()
    .describe("Email :")
    .optional(),
  dateNaissance: z
    .string({ required_error: "Date de naissance obligatoire" })
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
      message: "La date doit être au format jj/mm/aaaa",
    })
    .refine(
      (dateString) => {
        const [day, month, year] = dateString.split("/");
        const date = new Date(`${year}-${month}-${day}`);
        return !isNaN(date.getTime());
      },
      {
        message: "La date doit être au format jj/mm/aaaa",
      }
    ),
});

export const enfantSchema = z.object({
  nom: z
    .string({ required_error: "nom est requis" })
    .min(2, { message: " doit faire au moins 2 caracteres" })
    .describe("Nom :"),
  prenom: z
    .string({ required_error: "prenom est requis" })
    .min(2, { message: "doit faire au moins 2 caracteres" })
    .describe("Prenom :"),
  telephone: z.coerce
    .string()
    .regex(/0\d{1}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}/, {
      message: "doit etre composé de 10 chiffres",
    })
    .trim()
    .describe("Telephone :")
    .optional(),
  email: z
    .string()
    .email({ message: "doit etre un email" })
    .toLowerCase()
    .describe("Email :")
    .optional(),
  dateNaissance: z.date({ required_error: "Date de naissance obligatoire" }),
});
