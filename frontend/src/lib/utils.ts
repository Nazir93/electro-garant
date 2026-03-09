import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
  }
  return phone;
}

export function isWorkingHours(): boolean {
  const now = new Date();
  const moscowOffset = 3 * 60;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const moscow = new Date(utc + moscowOffset * 60000);
  const hour = moscow.getHours();
  const day = moscow.getDay();
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}
