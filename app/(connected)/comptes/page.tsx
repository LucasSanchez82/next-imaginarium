import { prisma } from "@/lib/prisma";
import { TableCompte } from "./comptesTables";
import { AddEnfantFormDialog } from "./addCompteForm";

export default async function Page() {
  const comptes = await prisma.user.findMany();
  return (
    <>
      <AddEnfantFormDialog />
      <TableCompte comptes={comptes} />
    </>
  );
}
