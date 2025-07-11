/* -------------------------------------------------------------------------- */
/*  src/features/items/AddItemModal.tsx                                       */
/* -------------------------------------------------------------------------- */
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import useCategories, { Category } from '../categories/useCategories';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../api';

/* -------------------------------------------------------------------------- */
/*                               schema + types                               */
/* -------------------------------------------------------------------------- */

const MB = 1024 * 1024;
const MAX_IMAGES = 6;

const priceRegex = /^\d+([.,]\d{1,2})?$/; // hasta 2 decimales

const schema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().max(500).optional(),
  price_per_h: z
    .string()
    .regex(priceRegex, 'Precio inválido')
    .transform(v => Number(v.replace(',', '.'))),
  categories: z.array(z.number()).min(1, 'Selecciona al menos una categoría'),
  images: z
    .array(
      z
        .instanceof(File)
        .refine(f => f.size <= 5 * MB, 'Cada imagen máx. 5 MB')
    )
    .min(1, 'Al menos 1 imagen')
    .max(MAX_IMAGES, `Máx. ${MAX_IMAGES} imágenes`)
});

type FormData = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void; // callback para refrescar listado
};

/* -------------------------------------------------------------------------- */
/*                           Componente principal                             */
/* -------------------------------------------------------------------------- */
export default function AddItemModal({ open, onClose, onCreated }: Props) {
  const { data: cats } = useCategories();
  const { token } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { categories: [], images: [] }
  });

  /* --------------------------- previews dinámicos -------------------------- */
  const files = watch('images'); // File[]
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL); // cleanup
  }, [files]);

  /* ------------------------------- submit --------------------------------- */
  async function onSubmit(data: FormData) {
    if (!token) {
      toast.error('Debes haber iniciado sesión');
      return;
    }

    try {
      /* 1.- subimos imágenes (paralelo) */
      let image_urls: string[] = [];
      if (data.images.length) {
        const uploads = await Promise.all(
          data.images.map(async img => {
            const fd = new FormData();
            fd.append('file', img);
            const r = await api.post<{ url: string }>('/upload/', fd, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            return r.data.url;
          })
        );
        image_urls = uploads;
      }

      /* 2.- creamos ítem */
      await api.post('/items/', {
        name: data.name,
        description: data.description,
        price_per_h: data.price_per_h,
        categories: data.categories,
        image_urls           // 🔥 ahora array
      });

      toast.success('¡Producto publicado!');
      reset();
      onCreated();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail ?? 'Error al crear producto');
    }
  }

  /* ------------------------------------------------------------------------ */
  /*                                   UI                                     */
  /* ------------------------------------------------------------------------ */
  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        onClose={() => {
          reset();
          onClose();
        }}
        className="relative z-50"
      >
        {/* ---------- Backdrop ---------- */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* ---------- Wrapper ---------- */}
        <div className="fixed inset-0 grid place-items-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-150"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="flex w-full max-w-2xl max-h-[90vh] flex-col overflow-x-hidden rounded-xl bg-white shadow-xl">
              {/* ---------- Header ---------- */}
              <header className="flex items-center justify-between border-b px-6 py-4">
                <Dialog.Title className="text-lg font-semibold">
                  Nuevo producto
                </Dialog.Title>
                <button
                  type="button"
                  className="rounded p-1 text-gray-500 hover:bg-gray-100"
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </header>

              {/* ---------- Form (scrollable) ---------- */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto px-6 py-8 md:grid-cols-2"
              >
                {/* --------------------------- Columna 1 --------------------------- */}
                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium">Nombre</label>
                    <input
                      {...register('name')}
                      className="form-input mt-1 w-full"
                      placeholder="Taladro Bosch 800 W"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium">
                      Descripción
                    </label>
                    <textarea
                      {...register('description')}
                      rows={5}
                      className="form-input mt-1 w-full resize-none"
                      placeholder="Añade detalles técnicos, estado, accesorios incluidos…"
                    />
                    {errors.description && (
                      <p className="text-xs text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Precio */}
                  <div>
                    <label className="block text-sm font-medium">
                      Precio / hora (€)
                    </label>
                    <input
                      {...register('price_per_h')}
                      className="form-input mt-1 w-full"
                      placeholder="3.5"
                      inputMode="decimal"
                    />
                    {errors.price_per_h && (
                      <p className="text-xs text-red-600">
                        {errors.price_per_h.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* --------------------------- Columna 2 --------------------------- */}
                <div className="space-y-4">
                  {/* Imágenes */}
                  <div>
                    <label className="block text-sm font-medium">
                      Imágenes ({files.length}/{MAX_IMAGES})
                    </label>

                    {/* zona de drop / input */}
                    <label className="mt-1 flex min-h-[4rem] w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 hover:border-brand hover:text-brand">
                      <PhotoIcon className="h-8 w-8" />
                      <span className="mt-1">
                        PNG, JPG · máx. 5 MB c/u · hasta {MAX_IMAGES}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={e =>
                          setValue(
                            'images',
                            [...(e.target.files ?? [])] as File[],
                            { shouldValidate: true }
                          )
                        }
                      />
                    </label>

                    {/* previews */}
                    {previews.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {previews.map((src, i) => (
                          <div key={i} className="relative">
                            <img
                              src={src}
                              alt={`preview ${i + 1}`}
                              className="h-24 w-full rounded object-cover"
                            />
                            <button
                              type="button"
                              title="Eliminar"
                              onClick={() => {
                                const copy = [...files];
                                copy.splice(i, 1);
                                setValue('images', copy, { shouldValidate: true });
                              }}
                              className="absolute right-0 top-0 rounded-bl bg-black/60 p-0.5 text-white transition-colors hover:bg-black/80"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {errors.images && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.images.message as string}
                      </p>
                    )}
                  </div>

                  {/* Categorías */}
                  <div>
                    <p className="mb-1 text-sm font-medium">Categorías</p>
                    <div className="flex flex-wrap gap-2">
                      {cats.map((c: Category) => {
                        const selected = watch('categories').includes(c.id);
                        return (
                          <button
                            type="button"
                            key={c.id}
                            onClick={() => {
                              const current = new Set(watch('categories'));
                              selected
                                ? current.delete(c.id)
                                : current.add(c.id);
                              setValue('categories', [...current]);
                            }}
                            className={
                              selected
                                ? 'rounded-full bg-brand px-3 py-0.5 text-xs text-white'
                                : 'rounded-full border px-3 py-0.5 text-xs text-gray-600'
                            }
                          >
                            {c.name}
                          </button>
                        );
                      })}
                    </div>
                    {errors.categories && (
                      <p className="text-xs text-red-600">
                        {errors.categories.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* --------------------------- Footer --------------------------- */}
                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    className="btn--ghost"
                    onClick={() => {
                      reset();
                      onClose();
                    }}
                  >
                    Cancelar
                  </button>
                  <button className="btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Publicando…' : 'Publicar'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
