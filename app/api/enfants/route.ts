import { enfantSchema } from "@/types/enfantSchemas";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const newBody = {...body, dateNaissance: new Date(body.dateNaissance)}
  console.log('body', newBody);
  const safeValues = enfantSchema.safeParse(newBody);
  if (safeValues.success) {
    const datas = safeValues.data;
    try {
      const prisma = new PrismaClient();
      await prisma.enfant.create({
        data: {
          ...datas,
        },
      });
      return NextResponse.json(
        { success: "Enfant ajouté avec succès" },
        { status: 200 }
      );
    } catch (error) {
      console.log("Error", error);
      return NextResponse.json(
        { error: "Erreur du serveur à ajouter l'enfant" },
        { status: 500 }
      );
    }
  } else {
    console.error(safeValues.error);
    console.log('body', body);
    return NextResponse.json({
      error: `Informations enfant corrompus :\n${safeValues.error.message}`,
    }, {status: 401});
  }
};
