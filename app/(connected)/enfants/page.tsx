import React from "react";
import AddEnfantForm from "./addEnfantForm";
import { PrismaClient } from "@prisma/client";
import { DialogAddEnfantForm } from "./dialogAddEnfantForm";
import { TableDemo } from "@/components/dataTableComponent";

const page = async () => {
  const prisma = new PrismaClient();
  const enfants = await prisma.enfant.findMany()
  return (
    <>
      <h1>Enfants</h1>
      <DialogAddEnfantForm />
      <TableDemo />
    </>
  );
};

export default page;
