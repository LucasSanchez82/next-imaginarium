import { TableEnfant } from "@/components/dataTableComponent";
import { PrismaClient } from "@prisma/client";
import { DialogAddEnfantForm } from "./dialogAddEnfantForm";

const page = async () => {
  const prisma = new PrismaClient();
  const limit = {skip: 0, take: 10};
  const enfants = await prisma.enfant.findMany({ take: limit.take });
  const enfantsCount = await prisma.enfant.count();
  const nbPages = Math.ceil(enfantsCount / limit.take);

  return (
    <>
      <h1>Enfants</h1>
      <DialogAddEnfantForm />
      <TableEnfant enfants={enfants} limit={limit} nbPages={nbPages} />
    </>
  );
};

export default page;
