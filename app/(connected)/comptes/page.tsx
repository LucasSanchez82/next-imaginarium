import { prisma } from "@/lib/prisma";
import RegisterForm from "../creer-compte/form";
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
