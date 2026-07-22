import { z } from 'zod';

const optionalText = z.string().trim().max(2000);

const precio = z
  .string()
  .trim()
  .min(1, 'El precio es obligatorio')
  .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, 'Ingresá un precio válido (≥ 0)');

export const equipoSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(120, 'Máximo 120 caracteres'),
  descripcion: optionalText,
  marca: optionalText,
  precio,
  categoria_id: z.string(),
  disponible: z.boolean(),
});

export type EquipoFormValues = z.infer<typeof equipoSchema>;

export const equipoDefaults: EquipoFormValues = {
  nombre: '',
  descripcion: '',
  marca: '',
  precio: '',
  categoria_id: '',
  disponible: true,
};
