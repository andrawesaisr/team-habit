import { z } from "zod";

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be 128 characters or fewer");

const emailSchema = z.string().email("Email must be valid").max(255, "Email is too long").min(1, "Email is required")
export const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, "Name cannot be empty")
            .max(120, "Name is too long"),
        email: emailSchema,
        password: passwordSchema,
        image: z
            .string()
            .url("Image must be a valid URL")
            .max(2048, "Image URL is too long")
            .optional(),
        callbackURL: z
            .string()
            .url("callbackURL must be a valid URL")
            .optional(),
        rememberMe: z.boolean().optional()
    })
    .strict();

export const loginSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        rememberMe: z.boolean().optional(),
        callbackURL: z
            .string()
            .url("callbackURL must be a valid URL")
            .optional()
    })
    .strict();

export type RegisterPayload = z.infer<typeof registerSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
