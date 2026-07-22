import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../components/ui/Modal';
import { Field } from '../../components/ui/Field';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Button } from '../../components/ui/Button';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { equipoSchema, equipoDefaults, type EquipoFormValues } from '../../schemas/equipo.schema';
import { useCreateEquipo, useUpdateEquipo } from '../../hooks/useEquipos';
import { useCategorias } from '../../hooks/useCategorias';
import { uploadImage, removeImage } from '../../services/storage.service';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../lib/format';
import type { Equipo, EquipoInput } from '../../types/equipo';

const toNull = (v: string): string | null => (v.trim() === '' ? null : v.trim());

interface Props {
  open: boolean;
  onClose: () => void;
  record: Equipo | null;
}

export function EquipoFormModal({ open, onClose, record }: Props) {
  const isEdit = Boolean(record);
  const toast = useToast();
  const create = useCreateEquipo();
  const update = useUpdateEquipo();
  const categorias = useCategorias({ tipo: 'EQUIPO' });

  const [file, setFile] = useState<File | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EquipoFormValues>({ resolver: zodResolver(equipoSchema), defaultValues: equipoDefaults });

  useEffect(() => {
    if (!open) return;
    setFile(null);
    if (record) {
      setCurrentUrl(record.imagen);
      reset({
        nombre: record.nombre,
        descripcion: record.descripcion ?? '',
        marca: record.marca ?? '',
        precio: String(record.precio),
        categoria_id: record.categoria_id ?? '',
        disponible: record.disponible,
      });
    } else {
      setCurrentUrl(null);
      reset(equipoDefaults);
    }
  }, [open, record, reset]);

  const onSubmit = async (values: EquipoFormValues) => {
    setSaving(true);
    try {
      let imagen = currentUrl;
      if (file) imagen = await uploadImage(file, 'equipos');

      const input: EquipoInput = {
        nombre: values.nombre.trim(),
        descripcion: toNull(values.descripcion),
        marca: toNull(values.marca),
        precio: Number(values.precio),
        imagen,
        categoria_id: values.categoria_id === '' ? null : values.categoria_id,
        disponible: values.disponible,
      };

      if (isEdit && record) {
        await update.mutateAsync({ id: record.id, input });
        if (record.imagen && record.imagen !== imagen) await removeImage(record.imagen);
        toast.success('Equipo actualizado');
      } else {
        await create.mutateAsync(input);
        toast.success('Equipo creado');
      }
      onClose();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const cats = categorias.data ?? [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? 'Editar equipo' : 'Nuevo equipo'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button form="equipo-form" type="submit" loading={saving}>
            {isEdit ? 'Guardar cambios' : 'Crear equipo'}
          </Button>
        </>
      }
    >
      <form
        id="equipo-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        noValidate
      >
        <Field label="Nombre" required error={errors.nombre?.message} className="sm:col-span-2">
          <Input {...register('nombre')} />
        </Field>
        <Field label="Descripción" error={errors.descripcion?.message} className="sm:col-span-2">
          <Textarea {...register('descripcion')} />
        </Field>
        <Field label="Marca" error={errors.marca?.message}>
          <Input placeholder="Ej. Hario" {...register('marca')} />
        </Field>
        <Field label="Precio (₲)" required error={errors.precio?.message}>
          <Input type="number" min="0" step="1" {...register('precio')} />
        </Field>
        <Field label="Categoría" error={errors.categoria_id?.message}>
          <Select {...register('categoria_id')}>
            <option value="">Sin categoría</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Disponible">
          <Controller
            control={control}
            name="disponible"
            render={({ field }) => (
              <Switch checked={field.value} onChange={field.onChange} label={field.value ? 'Sí' : 'No'} />
            )}
          />
        </Field>
        <Field label="Imagen" className="sm:col-span-2">
          <ImageUpload
            currentUrl={currentUrl}
            file={file}
            onFileChange={setFile}
            onClear={() => {
              setFile(null);
              setCurrentUrl(null);
            }}
          />
        </Field>
      </form>
    </Modal>
  );
}
