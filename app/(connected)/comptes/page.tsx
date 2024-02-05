import { prisma } from "@/lib/prisma";
import RegisterForm from "../creer-compte/form";
import { TableCompte } from "./comptesTables";
import { AddEnfantFormDialog } from "./addCompteForm";

export default async function Page() {
  const comptes = await prisma.user.findMany();
  return (
    <>
      <h1>salut</h1>
      <AddEnfantFormDialog />
      <TableCompte comptes={comptes} />
    </>
  );
}
