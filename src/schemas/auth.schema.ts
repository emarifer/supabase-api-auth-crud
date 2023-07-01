import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .trim(),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    })
    .trim(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .trim(),
});

export type regSchema = typeof registerSchema;

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email is not valid",
    })
    .trim(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .trim(),
});

export type logSchema = typeof loginSchema;

/*
 * EXPORTAR (Y LUEGO IMPORTAR) SÓLO EL TIPO EN TYPESCRIPT. VER:
 * https://stackoverflow.com/questions/44079820/what-is-export-type-in-typescript#44079887
 */
