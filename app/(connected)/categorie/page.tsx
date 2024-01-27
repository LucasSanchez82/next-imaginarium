import React from "react";
import FormCategorie from "./form";
import { prisma } from "@/lib/prisma";

const page = async () => {
  const categories = await prisma.categorie.findMany();
  return <>
  <h1>Hello world</h1>
  <FormCategorie />
  <h2>categories : </h2>
  <ul>
    {categories.map((categorie) => (
      <li key={categorie.id} className={`rounded p-1 m-1 ${categorie.important && 'underline'}`} style={{backgroundColor: categorie.couleur ?? '#3788d8'}} >
        {categorie.libelle} : {categorie.description}
      </li>
    ))}
  </ul>
  </>;
};

export default page;