import React, { StyleHTMLAttributes } from "react";
import FormCategorie from "./form";
import { prisma } from "@/lib/prisma";
import { CategorieItem } from "../../../components/categorie/categorieItem";

const page = async () => {
    const categories = await prisma.categorie.findMany({include: {tags: {include: {tag: true}}}});
  return (
    <>
      <FormCategorie />
      <h2>Categories : </h2>
      <ul className="flex justify-around items-center flex-wrap">
        {categories.map((categorie) => {
          const backgroundColor: React.CSSProperties = {
            backgroundColor: categorie.couleur ?? "#3788d8",
          };
          return (
            <CategorieItem
              key={categorie.id}
              categorie={categorie}
              backgroundColor={backgroundColor}
            />
          );
        })}
      </ul>
    </>
  );
};

export default page;
