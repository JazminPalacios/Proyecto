import clsx, { type ClassValue } from 'clsx';

/** Une clases condicionales (wrapper mínimo sobre clsx). */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
