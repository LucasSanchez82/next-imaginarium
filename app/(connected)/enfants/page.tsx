import { TableEnfant } from "@/components/dataTableComponent";
import { prisma } from '@/lib/utils';
import { configRequestEnfantPrismaType } from "@/types/enfantType";
const page = async () => {
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
    },
  };
  const enfants = await prisma.enfant.findMany({
    take: limit.take,
    orderBy: { id: "desc" },
    ...configRequestPrisma,
  });

  // const enfantsCount = await prisma.enfant.count();
  // const nbPages = Math.ceil(enfantsCount / limit.take);

  return (
    <>
      <TableEnfant
        configRequestPrisma={configRequestPrisma}
        enfants={enfants}
        limit={limit}
        nbPages={1}
      />
    </>
  );
};

export default page;
