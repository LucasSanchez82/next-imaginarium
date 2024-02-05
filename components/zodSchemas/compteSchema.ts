import { User } from '@prisma/client'
import { z } from 'zod'

type AddCompteType = Omit<User, 'id' | 'createdAt' | 'updatedAt'> 
const required = {required_error: 'requis'}
const minRequired = (nb: number) => ({message: `minimum ${nb} caractères`})
export const addCompteSchema = z.object({
    name: z.string(required).min(2, minRequired(2)).describe('Nom de l\'utilisateur'),
    email: z.string(required).email().toLowerCase(),
    password: z.string(required).min(6, minRequired(6)).describe('Mot de passe'),
    // image: z.string(required).url().optional(),
})

export const editCompteSchema = addCompteSchema.omit({password: true}).extend({
    isAdmin: z.boolean().optional().describe('Est-ce un admin ?'),
    isVerified: z.boolean().optional().describe('Est-ce un compte vérifié ?'),
})