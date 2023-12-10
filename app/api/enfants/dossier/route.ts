import { addDocumentSchema } from "@/types/documentSchemas";
import { PrismaClient } from "@prisma/client";
import {
  copyFileSync,
  createReadStream,
  existsSync,
  readFileSync,
  statSync,
} from "fs";
import { readFile, readdir, writeFile } from "fs/promises";
import { getStaticPaths } from "next/dist/build/templates/pages";
import { NextResponse } from "next/server";
import { join } from "path";

const addToDatabase = async (document: {
  libelleDocument: string;
  cheminDocument: string;
  idEnfant: string;
}) => {
  const safeDocument = addDocumentSchema.safeParse(document);
  if (safeDocument.success) {
    const prisma = new PrismaClient();
    prisma.document.create({ data: safeDocument.data });
  }
};

export const POST = async (req: Request) => {
  const prisma = new PrismaClient();
  const body = await req.formData();
  const file = body.get("file") as File;
  console.log();
  
  const idEnfant = String(body.get("idEnfant"));
  const nbEnfants = await prisma.enfant.count({ where: { id: idEnfant } });

  if (nbEnfants !== 1) {
    return NextResponse.json(
      {
        error:
          nbEnfants > 1
            ? "Erreur critique, il y a plus de 1 enfant"
            : "Enfant non trouvé",
      },
      { status: 401 }
    );
  }

  if (!(file.constructor.name === "File"))
    return NextResponse.json(
      { error: "Erreur: N'est pas un fichier" },
      { status: 500 }
    );

  const byte = await file.arrayBuffer();
  const buffer = Buffer.from(byte); //buffer = donnees temporaires

  const uploadDir = join("./", "upload", "dossierEnfant");
  const fileNameWithoutExtension = file.name
    .split(".")[0] //on prend la premiere partie avant le .
    .toLowerCase() //tout en minuscule
    .replace(/(?!\w|\s)./g, "") //enlever caracteres speciaux
    .replace(/\s+/g, ""); // enlevers espace vide (espace, tab, entre...)
  const fileExtension = file.name.split(".").pop()!.toLowerCase();
  let safeFileName = `${fileNameWithoutExtension}`;

  let fullFilePath = join(uploadDir, safeFileName + ".pdf");

  if (fileExtension != "pdf" || file.type != "application/pdf")
    return NextResponse.json(
      { error: "ce 'est pas un fichier pdf" },
      { status: 401 }
    );
  try {
    if (existsSync(fullFilePath)) {
      // est ce que le fichier existe deja ?
      // si oui on veut ex: document(1).pdf
      let i = 1;
      while (
        existsSync(join(uploadDir, `${fileNameWithoutExtension}(${i}).pdf`))
      ) {
        i++;
      }
      safeFileName = `${fileNameWithoutExtension}(${i})`;
      fullFilePath = join(uploadDir, safeFileName + ".pdf");
      writeFile(fullFilePath, buffer);
    } else {
      //sinon on upload direct
      writeFile(fullFilePath, buffer);
    }

    await prisma.document.create({
      data: {
        idEnfant,
        cheminDocument: fullFilePath,
        libelleDocument: safeFileName,
      },
    });

    return NextResponse.json(
      {
        message: "Fichier téléchargé avec succès",
        type: file.constructor.name,
        buffer: buffer,
        path: fullFilePath,
        name: file.name,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors du nommage et telechargement du fichier" },
      { status: 500 }
    );
  }
};

export const GET = async (req: Request, res: Response) => {
  const uploadDir = join("./", "upload", "dossierEnfant");
  const readDir = await readdir(uploadDir);
  const buffer = await readFile(join(uploadDir, readDir[10]));

  console.log(buffer);
  console.log(join(uploadDir, readDir[1]));

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
};
