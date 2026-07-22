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
import { cafeSchema, cafeDefaults, type CafeFormValues } from '../../schemas/cafe.schema';
import { useCreateCafe, useUpdateCafe } from '../../hooks/useCafes';
import { useCategorias } from '../../hooks/useCategorias';
import { uploadImage, removeImage } from '../../services/storage.service';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../lib/format';
import type { Cafe, CafeInput } from '../../types/cafe';

const toNull = (v: string): string | null => (v.trim() === '' ? null : v.trim());

interface Props {
  open: boolean;
  onClose: () => void;
  record: Cafe | null;
}

export function CafeFormModal({ open, onClose, record }: Props) {
  const isEdit = Boolean(record);
  const toast = useToast();
  const create = useCreateCafe();
  const update = useUpdateCafe();
  const categorias = useCategorias({ tipo: 'CAFE' });

  const [file, setFile] = useState<File | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CafeFormValues>({ resolver: zodResolver(cafeSchema), defaultValues: cafeDefaults });

  useEffect(() => {
    if (!open) return;
    setFile(null);
    if (record) {
      setCurrentUrl(record.imagen);
      reset({
        nombre: record.nombre,
        descripcion: record.descripcion ?? '',
        origen: record.origen ?? '',
        region: record.region ?? '',
        proceso: record.proceso ?? '',
        altitud: record.altitud ?? '',
        variedad: record.variedad ?? '',
        notas: record.notas ?? '',
        precio: String(record.precio),
        categoria_id: record.categoria_id ?? '',
        disponible: record.disponible,
      });
    } else {
      setCurrentUrl(null);
      reset(cafeDefaults);
    }
  }, [open, record, reset]);

  const onSubmit = async (values: CafeFormValues) => {
    setSaving(true);
    try {
      let imagen = currentUrl;
      if (file) imagen = await uploadImage(file, 'cafes');

      const input: CafeInput = {
        nombre: values.nombre.trim(),
        descripcion: toNull(values.descripcion),
        origen: toNull(values.origen),
        region: toNull(values.region),
        proceso: toNull(values.proceso),
        altitud: toNull(values.altitud),
        variedad: toNull(values.variedad),
        notas: toNull(values.notas),
        precio: Number(values.precio),
        imagen,
        categoria_id: values.categoria_id === '' ? null : values.categoria_id,
        disponible: values.disponible,
      };

      if (isEdit && record) {
        await update.mutateAsync({ id: record.id, input });
        if (record.imagen && record.imagen !== imagen) await removeImage(record.imagen);
        toast.success('Café actualizado');
      } else {
        await create.mutateAsync(input);
        toast.success('Café creado');
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
      title={isEdit ? 'Editar café' : 'Nuevo café'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button form="cafe-form" type="submit" loading={saving}>
            {isEdit ? 'Guardar cambios' : 'Crear café'}
          </Button>
        </>
      }
    >
      <form
        id="cafe-form"
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
        <Field label="Origen" error={errors.origen?.message}>
          <Input placeholder="Ej. Colombia" {...register('origen')} />
        </Field>
        <Field label="Región" error={errors.region?.message}>
          <Input placeholder="Ej. Huila" {...register('region')} />
        </Field>
        <Field label="Proceso" error={errors.proceso?.message}>
          <Input placeholder="Ej. Lavado" {...register('proceso')} />
        </Field>
        <Field label="Altitud" error={errors.altitud?.message}>
          <Input placeholder="Ej. 1.800 msnm" {...register('altitud')} />
        </Field>
        <Field label="Variedad" error={errors.variedad?.message}>
          <Input placeholder="Ej. Caturra" {...register('variedad')} />
        </Field>
        <Field label="Precio (₲)" required error={errors.precio?.message}>
          <Input type="number" min="0" step="1" {...register('precio')} />
        </Field>
        <Field label="Notas de cata" error={errors.notas?.message} className="sm:col-span-2">
          <Textarea placeholder="Chocolate, caramelo, cítricos…" {...register('notas')} />
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
