import {
  copyFileSync,
  createReadStream,
  existsSync,
  readFileSync,
  statSync,
} from "fs";
import { writeFile } from "fs/promises";
import { readFile } from "fs";
import { getStaticPaths } from "next/dist/build/templates/pages";
import { NextResponse } from "next/server";
import { join } from "path";

export const POST = async (req: Request) => {
  const body = await req.formData();
  const file = body.get("file");
  if (!(file instanceof File))
    return NextResponse.json(
      { error: "Erreur: N'est pas un fichier" },
      { status: 500 }
    );

  const byte = await file.arrayBuffer();
  const buffer = Buffer.from(byte); //buffer = donnees temporaires
  console.log("server Buffer", buffer.toString("base64"));

  const uploadDir = join("./", "upload", "dossierEnfant");
  const fullFilePath = join(uploadDir, file.name);
  const fileNameWithoutExtension = file.name.split(".")[0].toLowerCase();
  const fileExtension = file.name.split(".").pop()!.toLowerCase();

  if (fileExtension != "pdf")
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
      copyFileSync(
        fullFilePath,
        join(uploadDir, `${fileNameWithoutExtension}(${i}).pdf`)
      );
    } else {
      //sinon on upload direct
      writeFile(fullFilePath, uploadDir);
    }
    // await writeFile(fullFilePath, buffer);

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
  const buffer = readFile(
    "E:\\rapport code\\next-imaginarium\\upload\\dossierEnfant\\photo.pdf"
  , 'base64', (err, data) => {
      if(err){
        console.log('error', err);
        return null
      }else {
        console.log('data', data);
        
        return data
      }
  });
  console.log(buffer);
  
  const response = new NextResponse(buffer);
  response.headers.set("content-type", "application/pdf");
  return response;
};
