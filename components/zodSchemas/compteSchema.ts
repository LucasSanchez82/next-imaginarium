import { User } from '@prisma/client'
import { z } from 'zod'

type AddCompteType = Omit<User, 'id' | 'createdAt' | 'updatedAt'> 
const required = {required_error: 'requis'}
const minRequired = (nb: number) => ({message: `minimum ${nb} caractères`})
export const addCompteSchema = z.object({
    name: z.string(required).min(2, minRequired(2)).describe('Nom de l\'utilisateur'),
    email: z.string(required).email().toLowerCase(),
    password: z.string(required).min(6, minRequired(6)).describe('Mot de passe'),
})

export const editCompteSchema = addCompteSchema.omit({password: true}).extend({
    isAdmin: z.boolean().optional().describe('Est-ce un admin ?'),
    isVerified: z.boolean().optional().describe('Est-ce un compte vérifié ?'),
    image: z.string(required).url().optional(),
})

export const editCompteSchemaWithId = editCompteSchema.extend({
    id: z.string().uuid()
})

export const confirmPasswordSchema = z.object({
    oldPassword: z.string(required).describe('Ancien mot de passe'),
    newPassword: z.string(required).min(6, minRequired(6)).describe('Nouveau mot de passe'),
    confirmPassword: z.string(required).min(6, minRequired(6)).describe('Confirmation du mot de passe'),
  })