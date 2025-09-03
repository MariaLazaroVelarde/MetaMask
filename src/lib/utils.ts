import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Función utilitaria para combinar clases de Tailwind y condicionales
export function cn(...inputs: ClassValue[]) {
  // Combina las clases usando clsx y resuelve conflictos con twMerge
  return twMerge(clsx(inputs))
}