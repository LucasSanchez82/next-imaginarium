import { Regex } from "lucide-react";
import { z } from "zod";

const eventSchema = z
  .object({
    title: z
      .string({ required_error: "Obligatoire" })
      .min(3, { message: "doit contenir plus de 3 caracteres" })
      .max(50, { message: "doit contenir moins de 50 caracteres" })
      .describe("Titre de l'événement"),
    description: z.string().nullable().describe("Description de l'événement").optional(),
    color: z.string().regex(/^#[0-9a-f]{6}$/i, {message: "format de couleur incorrect ()"}).optional().nullable().describe("Couleur de l'événement"),
    start: z.coerce
      .date({
        required_error: "Obligatoire",
        invalid_type_error: "date invalide",
      })
      .describe("Date de début de l'événement"),
    end: z.coerce
      .date({
        required_error: "Obligatoire",
        invalid_type_error: "date invalide",
        description: "test",
      })
      .describe("Date de fin de l'événement"),
  })
  .refine((data) => data.start < data.end, {
    message: "La date de début doit être avant la date de fin",
    path: ["dateDebut", "dateFin"],
  });
export type CalendarEvent = {
  id?: number;
  title: string;
  description?: string | null;
  color?: null | string;
  start: Date;
  end: Date;
};
export default eventSchema;
