import { z } from "zod";

const eventSchema = z.object({
    title: z.string(),
    description: z.string(),
});

export default eventSchema;
