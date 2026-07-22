import { z } from 'zod';

// Campo de texto opcional: se acepta cadena vacía; en el submit se convierte a null.
const optionalText = z.string().trim().max(2000);

const precio = z
  .string()
  .trim()
  .min(1, 'El precio es obligatorio')
  .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, 'Ingresá un precio válido (≥ 0)');

export const cafeSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(120, 'Máximo 120 caracteres'),
  descripcion: optionalText,
  origen: optionalText,
  region: optionalText,
  proceso: optionalText,
  altitud: optionalText,
  variedad: optionalText,
  notas: optionalText,
  precio,
  categoria_id: z.string(),
  disponible: z.boolean(),
});

export type CafeFormValues = z.infer<typeof cafeSchema>;

export const cafeDefaults: CafeFormValues = {
  nombre: '',
  descripcion: '',
  origen: '',
  region: '',
  proceso: '',
  altitud: '',
  variedad: '',
  notas: '',
  precio: '',
  categoria_id: '',
  disponible: true,
};
