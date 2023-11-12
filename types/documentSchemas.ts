import { z } from "zod";

export const addDocumentSchema = z.object({
    idEnfant: z.string().min(1),
    cheminDocument: z.string().min(3),
    libelleDocument: z.string().min(3),
})