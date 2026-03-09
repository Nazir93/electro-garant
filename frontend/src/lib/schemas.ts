import { z } from "zod";

export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, "Введите имя")
    .max(100, "Имя слишком длинное"),
  phone: z
    .string()
    .min(10, "Введите корректный номер телефона")
    .max(20, "Номер слишком длинный")
    .regex(/^[\d\s\+\-\(\)]+$/, "Некорректный формат телефона"),
  email: z
    .string()
    .email("Некорректный email")
    .optional()
    .or(z.literal("")),
  service: z.string().optional(),
  message: z.string().max(1000).optional(),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

export const callbackFormSchema = z.object({
  name: z.string().min(2, "Введите имя").max(100),
  phone: z
    .string()
    .min(10, "Введите корректный номер")
    .max(20)
    .regex(/^[\d\s\+\-\(\)]+$/, "Некорректный формат"),
  preferredTime: z.enum(["now", "30min", "evening", "tomorrow"]).optional(),
  honeypot: z.string().max(0).optional(),
});

export type CallbackFormData = z.infer<typeof callbackFormSchema>;

export const calculatorSchema = z.object({
  area: z.number().min(1).max(10000),
  points: z.number().min(1).max(500).optional(),
  cameras: z.number().min(1).max(100).optional(),
  needRecording: z.boolean().optional(),
  name: z.string().min(2).max(100),
  phone: z
    .string()
    .min(10)
    .max(20)
    .regex(/^[\d\s\+\-\(\)]+$/),
  honeypot: z.string().max(0).optional(),
});

export type CalculatorData = z.infer<typeof calculatorSchema>;
