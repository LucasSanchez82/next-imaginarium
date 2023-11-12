import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import React from "react";
import Form from "../form";
import Link from "next/link";

const page = async ({ params }: { params: { idEnfant: string } }) => {
  const prisma = new PrismaClient();
  const enfantEtDocuments = await prisma.enfant.findUnique({
    select: {
      nom: true,
      prenom: true,
      document: true,
    },
    where: {
      id: params.idEnfant,
    },
  });
  if (enfantEtDocuments) {
    const { document, nom, prenom } = enfantEtDocuments;
    return (
      <>
        <Form idEnfant={params.idEnfant} />
        {document.length > 0 ? (
          <ul>
            {document.map((el) => (
              <li>
                <Link target="_blank" href={"/api/enfants/dossier/" + el.libelleDocument}>
                {el.libelleDocument}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <h3 className="bg-red-400 font-bold rounded w-3/4 m-auto text-center">
            Aucun document trouvé pour {nom} {prenom}
          </h3>
        )}
      </>
    );
  } else {
    return <h2 className="bg-red-400 bold ">aucun enfant trouvé</h2>;
  }
};

export default page;
