import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const SignupSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export const ProjectSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z.string().min(20, "La description doit contenir au moins 20 caractères"),
  price: z.number().min(1000, "Le prix minimum est 1000 CFA"),
});

export const PaymentSchema = z.object({
  amount: z.number().positive("Le montant doit être positif"),
  projectId: z.string().min(1, "ID du projet requis"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Numéro de téléphone invalide"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
export type SignupFormData = z.infer<typeof SignupSchema>;
export type ProjectFormData = z.infer<typeof ProjectSchema>;
export type PaymentFormData = z.infer<typeof PaymentSchema>;
