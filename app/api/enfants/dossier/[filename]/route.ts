import { readFile, readdir } from "fs/promises";
import { useRouter } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export const GET = async (
  request: NextRequest,
  { params }: { params: { filename: string } }
) => {
  try {
    const filename = params.filename;

    const uploadDir = join("./", "upload", "dossierEnfant");
    const readDir = await readdir(uploadDir);
    const isExist = readDir.includes(filename + '.pdf');
    if (isExist) {
      console.log(readDir);

      console.log(join(uploadDir, filename + '.pdf'));

      const buffer = await readFile(join(uploadDir, filename + '.pdf'));
      console.log(join("./", ".."));

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });
    } else {
      return NextResponse.json("Erreur 404: fichier non trouvé", {
        status: 500,
      });
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
