import { TableEnfant } from "@/components/dataTableComponent";
import { configRequestEnfantPrismaType } from "@/types/enfantType";
import { PrismaClient } from "@prisma/client";

const page = async () => {
  const prisma = new PrismaClient();
  const limit = { skip: 0, take: 10 };
  const configRequestPrisma: configRequestEnfantPrismaType = {
    select: {
      id: true,
      dateNaissance: true,
      idReferent: true,
      email: true,
      telephone: true,
      nom: true,
      prenom: true,
      _count: { select: { document: true, edtSemaine: true } },
      referent: { select: { email: true } },
      edtSemaine: { select: { id: true } },
  }
  };
  const enfants = await prisma.enfant.findMany({
    take: limit.take,
    orderBy: { id: "desc" },
    ...configRequestPrisma
  });
  console.log(enfants[0]);

  const enfantsCount = await prisma.enfant.count();
  const nbPages = Math.ceil(enfantsCount / limit.take);

  return (
    <>
      <TableEnfant
        configRequestPrisma={configRequestPrisma}
        enfants={enfants}
        limit={limit}
        nbPages={nbPages}
      />
    </>
  );
};

export default page;
