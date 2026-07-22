import { useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from './Button';

interface ImageUploadProps {
  /** URL actual guardada (al editar). */
  currentUrl: string | null;
  /** Archivo nuevo seleccionado (aún sin subir). */
  file: File | null;
  onFileChange: (file: File | null) => void;
  /** Quita tanto el archivo nuevo como la imagen actual. */
  onClear: () => void;
}

export function ImageUpload({ currentUrl, file, onFileChange, onClear }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(currentUrl);
    return undefined;
  }, [file, currentUrl]);

  return (
    <div className="flex items-center gap-4">
      <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-black/10 bg-cream">
        {preview ? (
          <img src={preview} alt="Vista previa" className="h-full w-full object-cover" />
        ) : (
          <ImagePlus className="text-ink-soft/50" />
        )}
      </div>
      <div className="flex flex-col items-start gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
        <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
          {preview ? 'Cambiar imagen' : 'Subir imagen'}
        </Button>
        {preview && (
          <button
            type="button"
            onClick={() => {
              onClear();
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
          >
            <X size={14} /> Quitar imagen
          </button>
        )}
        <p className="text-xs text-ink-soft/70">JPG, PNG o WEBP. Máx. recomendado 2&nbsp;MB.</p>
      </div>
    </div>
  );
}
