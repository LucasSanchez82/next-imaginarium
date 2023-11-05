import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nom doit contenir au moins 3 caracteres" })
    .describe("Nom"),
  email: z
    .string()
    .min(3, { message: "Email doit contenir au moins 3 caracteres" })
    .email({ message: "Doit avoir la forme d'un email" })
    .toLowerCase()
    .describe("Email"),
  password: z
    .string()
    .min(6, { message: "Mot de passe doit contenir au moins 6 caracteres" })
    .describe("Mot de passe"),
  // verifPassword: z.string().min(6, {message: 'Mot de passe doit contenir au moins 6 caracteres' }).describe('Verification mot de passe'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(3, { message: "Email doit contenir au moins 3 caracteres" })
    .email({ message: "Doit avoir la forme d'un email" })
    .toLowerCase()
    .describe("Email"),
  password: z
    .string()
    .min(6, { message: "Mot de passe doit contenir au moins 6 caracteres" })
    .describe("Mot de passe"),
});

export const sessionSchema = z.object({
  id: z.string().min(1), //obliger de mettre id
  email: z.string().min(3),
  name: z.string().min(3),
  isAdmin: z.boolean(),
  isVerified: z.boolean(),
});