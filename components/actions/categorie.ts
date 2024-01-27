"use server"

import { categorieSchema } from "@/app/(connected)/categorie/zodSchemas"
import { prisma } from "@/lib/prisma"
import { Categorie } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const addCategorieToDb = async (categorieFormData: FormData) => {
    try {
        const categorieObj = Object.fromEntries(categorieFormData)
        
        const parsedCategorie = categorieSchema.safeParse(categorieObj)
        if(parsedCategorie.success) {
            const {color: couleur, important, libelle, description} = parsedCategorie.data
            const categorieAdded = await prisma.categorie.create({
                data: {couleur, important, libelle, description}
            })
            
            revalidatePath('/categorie');
            return categorieAdded
        }else {
            throw Error(parsedCategorie.error.message)
        }
    } catch (error) {
        console.error("🚀 ~ addCategorie ~ error:", error)
        throw Error('Error while adding categorie')
    }
}

export const getCategoriesFromDb = async () => {
    const categories = await prisma.categorie.findMany()
    console.log("🚀 ~ getCategories ~ categories", categories);
    return categories
}