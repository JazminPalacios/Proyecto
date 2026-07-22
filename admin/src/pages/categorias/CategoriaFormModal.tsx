import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../components/ui/Modal';
import { Field } from '../../components/ui/Field';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import {
  categoriaSchema,
  categoriaDefaults,
  type CategoriaFormValues,
} from '../../schemas/categoria.schema';
import { useCreateCategoria, useUpdateCategoria } from '../../hooks/useCategorias';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../lib/format';
import { TIPOS } from '../../lib/constants';
import type { Categoria } from '../../types/categoria';

interface Props {
  open: boolean;
  onClose: () => void;
  record: Categoria | null;
}

export function CategoriaFormModal({ open, onClose, record }: Props) {
  const isEdit = Boolean(record);
  const toast = useToast();
  const create = useCreateCategoria();
  const update = useUpdateCategoria();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoriaFormValues>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: categoriaDefaults,
  });

  useEffect(() => {
    if (open) {
      reset(record ? { nombre: record.nombre, tipo: record.tipo } : categoriaDefaults);
    }
  }, [open, record, reset]);

  const saving = create.isPending || update.isPending;

  const onSubmit = async (values: CategoriaFormValues) => {
    try {
      if (isEdit && record) {
        await update.mutateAsync({ id: record.id, input: values });
        toast.success('Categoría actualizada');
      } else {
        await create.mutateAsync(values);
        toast.success('Categoría creada');
      }
      onClose();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar categoría' : 'Nueva categoría'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button form="categoria-form" type="submit" loading={saving}>
            {isEdit ? 'Guardar cambios' : 'Crear'}
          </Button>
        </>
      }
    >
      <form
        id="categoria-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <Field label="Nombre" required error={errors.nombre?.message}>
          <Input placeholder="Ej. Espresso, Cafeteras…" {...register('nombre')} />
        </Field>
        <Field label="Tipo" required error={errors.tipo?.message}>
          <Select {...register('tipo')}>
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </Field>
      </form>
    </Modal>
  );
}
