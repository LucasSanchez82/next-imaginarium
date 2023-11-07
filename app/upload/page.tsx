import React from "react";
import Form from "./form";
import { readFile, readdir } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { promises as fs } from 'fs';
const page = async () => {
  const dirs = await readdir(join("./", "upload", "dossierEnfant"));
  console.log("dirs", dirs);
  const filePath = join(process.cwd(), "upload", "dossierEnfant", dirs[3]);
  console.log(filePath);

  //   const buffer = await readFile(filePath);
    const buffer = await fs.readFile('E:\\rapport code\\next-imaginarium\\upload\\dossierEnfant\\photo.pdf', 'base64');
    console.log(buffer);
    

  return (
    <>
      <h1>Upload</h1>
      <Form />
    </>
  );
};

export default page;
