import { getSpecificEnfants } from "@/components/actions/enfant";
import { TableEnfant } from "@/components/dataTableComponent";
import { configRequestEnfantPrismaType } from "@/types/enfantType";
const page = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
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
      _count: { select: { document: true } },
      referent: { select: { email: true } },
    },
  };
  const searchEnfant =
    typeof searchParams?.searchEnfant === "string"
      ? searchParams?.searchEnfant
      : "";
  const enfants = await getSpecificEnfants(
    searchEnfant,
    limit,
    false,
    configRequestPrisma
  );
  return (
    <>
      <TableEnfant
        configRequestPrisma={configRequestPrisma}
        enfants={enfants?.enfants || []}
        limit={limit}
        nbPages={1}
      />
    </>
  );
};

export default page;
