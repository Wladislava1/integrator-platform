import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Укажите ФИО")
      .max(255, "ФИО слишком длинное"),
    email: z.string().trim().email("Некорректный email"),
    password: z.string().min(6, "Пароль не короче 6 символов"),
    confirmPassword: z.string().min(6, "Повторите пароль"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Некорректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Укажите ФИО").max(255),
  email: z.string().trim().email("Некорректный email"),
});

export const themeSchema = z.object({
  theme: z.enum(["light", "dark"]),
});
