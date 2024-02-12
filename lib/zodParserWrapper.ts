import { ZodSchema, z } from "zod";

export const zodParserWrapper = async <SchemaType extends z.ZodObject<any, any>>(
  {
    zodSchema,
    toParse,
    error,
  }: { zodSchema: SchemaType; toParse: any; error?: string },
  fn: (safeCategorie: z.infer<typeof zodSchema>) => any
) => {
  const parsedCategorie = zodSchema.safeParse(toParse);
  if (parsedCategorie.success) {
    const {
      color: couleur,
      important,
      libelle,
      description,
      tags,
    } = parsedCategorie.data;
    return await fn(parsedCategorie.data);
  } else {
    throw Error(
      error || "Les valeurs de types ne correspondent pas",
      parsedCategorie.error
    );
  }
};
