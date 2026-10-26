import { z } from "zod";

export const registerSchema = z
  .object({
    lastName: z.string().trim().min(1, "Укажите фамилию").max(100),
    firstName: z.string().trim().min(1, "Укажите имя").max(100),
    middleName: z.string().trim().max(100).optional().default(""),
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
  lastName: z.string().trim().min(1, "Укажите фамилию").max(100),
  firstName: z.string().trim().min(1, "Укажите имя").max(100),
  middleName: z.string().trim().max(100).default(""),
  phone: z.string().trim().max(32).default(""),
  gender: z.enum(["male", "female", ""]),
  address: z.string().trim().max(500).default(""),
  birthDate: z.string().trim().max(32).default(""),
});

export const themeSchema = z.object({
  theme: z.enum(["light", "dark", "auto"]),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Введите текущий пароль"),
    newPassword: z
      .string()
      .min(8, "Минимум 8 символов")
      .regex(/\d/, "Нужна хотя бы одна цифра"),
    confirmPassword: z.string().min(8, "Повторите новый пароль"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Новый пароль должен отличаться от текущего",
    path: ["newPassword"],
  });
