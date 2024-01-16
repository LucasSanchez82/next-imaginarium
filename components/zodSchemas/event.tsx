import { z } from "zod";

const eventSchema = z
  .object({
    title: z
      .string({ required_error: "Obligatoire" })
      .min(3, { message: "doit contenir plus de 3 caracteres" })
      .describe("Titre de l'événement"),
    description: z.string().describe("Description de l'événement").optional(),
    dateDebut: z.coerce
      .date({
        required_error: "Obligatoire",
        invalid_type_error: "date invalide",
      })
      .describe("Date de début de l'événement"),
    dateFin: z.coerce
      .date({
        required_error: "Obligatoire",
        invalid_type_error: "date invalide",
        description: "test",
      })
      .describe("Date de fin de l'événement"),
  })
  .refine((data) => data.dateDebut < data.dateFin, {
    message: "La date de début doit être avant la date de fin",
    path: ["dateDebut", "dateFin"],
  });
export type CalendarEvent = {
  title: string;
  description?: string;
  dateDebut: Date;
  dateFin: Date;
};
export default eventSchema;
