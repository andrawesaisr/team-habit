import { z } from "zod";

export const emailSchema = z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .max(255, "Email is too long")
    .email("Enter a valid email");

export const passwordSchema = z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be 128 characters or fewer");

export const loginSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        rememberMe: z.boolean().optional(),
        callbackURL: z.string().url("Callback URL must be a valid URL").optional()
    })
    .strict();

export const registerSchema = loginSchema
    .extend({
        name: z
            .string({ required_error: "Name is required" })
            .min(1, "Name cannot be empty")
            .max(120, "Name is too long"),
        image: z.string().url("Image must be a valid URL").max(2048, "Image URL is too long").optional()
    })
    .strict();

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
