import { prisma } from "@/lib/prisma";
import { z } from "zod";
const categoriesLibelles = async () => {
  const categories = await prisma.categorie.findMany();
  return categories.map((categorie) => categorie.libelle);
};
const eventSchemaBase = z.object({
  title: z
    .string({ required_error: "Obligatoire" })
    .min(3, { message: "doit contenir plus de 3 caracteres" })
    .max(50, { message: "doit contenir moins de 50 caracteres" })
    .describe("Titre de l'événement"),
  description: z
    .string()
    .nullable()
    .describe("Description de l'événement")
    .optional(),
});

const eventSchema = eventSchemaBase
  .extend({
    start: z.coerce.date().describe("Date de début de l'événement"),
    end: z.coerce.date().describe("Date de fin de l'événement")
  })
  .refine((data) => data.start < data.end, {
    message: "La date de début doit être avant la date de fin",
    path: ["dateDebut", "dateFin"],
  });

export type CalendarEvent = {
  id?: number;
  title: string;
  description?: string | null;
  start: Date;
  end: Date;
  idCategorie?: number | null;
};
export default eventSchema;
