import { readFile, readdir } from "fs/promises";
import { useRouter } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export const GET = async (
  request: NextRequest,
  { params }: { params: { filename: string } }
) => {
  const filename = params.filename;

  const uploadDir = join("./", "upload", "dossierEnfant");
  const readDir = await readdir(uploadDir);
  const isExist = readDir.includes(filename + '.pdf');
  if(isExist){
    console.log(readDir);
    
    console.log(join(uploadDir, readDir[6]));
    
      const buffer = await readFile(join(uploadDir, readDir[0]));
      console.log(join("./", ".."));
    
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });
  }else {
    return NextResponse.json('Erreur 404: fichier non trouvé',{status: 500})
  }
};
