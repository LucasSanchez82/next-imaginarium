import { z } from "zod";

const eventSchema = z.object({
    title: z.string({required_error: 'Obligatoire'}).min(3, {message: 'doit contenir plus de 3 caracteres'}).describe('Titre de l\'événement'),
    description: z.string().describe('Description de l\'événement').optional(),
});
export type CalendarEvent = {
    title: string;
    description?: string;
}
export default eventSchema;
