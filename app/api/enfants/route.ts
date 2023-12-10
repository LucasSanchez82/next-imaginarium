import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/utils";
import { enfantSchema } from "@/types/enfantSchemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if(!session?.user) return NextResponse.json({error: 'Erreur, l\'utilisateur doit etre connecte'}, {status: 401});

  const body = await req.json();
  const newBody = {...body, dateNaissance: new Date(body.dateNaissance)}
  const safeValues = enfantSchema.safeParse(newBody);
  if (safeValues.success) {
    const datas = safeValues.data;
    try {
      await prisma.enfant.create({
        data: {
          ...datas,
          idReferent: session.user.id
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
