import { z } from 'zod';

export const categoriaSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(80, 'Máximo 80 caracteres'),
  tipo: z.enum(['CAFE', 'EQUIPO']),
});

export type CategoriaFormValues = z.infer<typeof categoriaSchema>;

export const categoriaDefaults: CategoriaFormValues = {
  nombre: '',
  tipo: 'CAFE',
};
