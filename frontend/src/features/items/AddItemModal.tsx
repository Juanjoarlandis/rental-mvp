/* -------------------------------------------------------------------------- */
/*  src/features/items/AddItemModal.tsx                                       */
/* -------------------------------------------------------------------------- */
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
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

const priceRegex = /^\d+([.,]\d{1,2})?$/; // hasta 2 decimales

const schema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().max(500).optional(),
  price_per_h: z
    .string()
    .regex(priceRegex, 'Precio inválido')
    .transform(v => Number(v.replace(',', '.'))),
  categories: z.array(z.number()).min(1, 'Selecciona al menos una categoría'),
  image: z
    .instanceof(File)
    .refine(f => f.size < 5 * 1024 * 1024, 'Máx. 5 MB')
    .optional()
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
    defaultValues: { categories: [] }
  });

  /* --------------------------- preview de imagen -------------------------- */
  const file = watch('image');
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file && file instanceof File) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [file]);

  /* ------------------------------- submit --------------------------------- */
  async function onSubmit(data: FormData) {
    if (!token) {
      toast.error('Debes haber iniciado sesión');
      return;
    }
    try {
      /* 1.- subimos imagen (opcional) */
      let image_url: string | undefined;
      if (data.image) {
        const fd = new FormData();
        fd.append('file', data.image);
        const up = await api.post<{ url: string }>('/upload/', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        image_url = up.data.url;
      }

      /* 2.- creamos ítem */
      await api.post('/items/', {
        name: data.name,
        description: data.description,
        price_per_h: data.price_per_h,
        categories: data.categories,
        image_url
      });

      toast.success('¡Producto publicado!');
      reset();         // limpia formulario
      onCreated();     // refresca listado en el padre
      onClose();       // cierra modal
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
            {/* -------------------------------------------------------------- */}
            {/*  Panel: alto máx. 90 vh, flex-col, scroll solo en el body     */}
            {/* -------------------------------------------------------------- */}
            <Dialog.Panel className="flex w-full max-w-2xl max-h-[90vh] flex-col overflow-x-hidden rounded-xl bg-white shadow-xl">
              {/* ---------- Header (fijo) ---------- */}
              <div className="flex items-center justify-between border-b px-6 py-4">
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
              </div>

              {/* ---------- Formulario (scrollable) ---------- */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex-1 overflow-y-auto px-6 py-8 grid gap-6 md:grid-cols-2"
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
                  {/* Imagen */}
                  <div>
                    <label className="block text-sm font-medium">Imagen</label>

                    <label className="mt-1 flex h-48 w-full cursor-pointer items-center justify-center rounded border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-brand hover:text-brand">
                      {preview ? (
                        <img
                          src={preview}
                          alt="preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex flex-col items-center gap-1">
                          <PhotoIcon className="h-8 w-8" />
                          <span>PNG, JPG · máx. 5 MB</span>
                        </span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={e =>
                          setValue('image', e.target.files?.[0] as File)
                        }
                      />
                    </label>
                    {errors.image && (
                      <p className="text-xs text-red-600">
                        {errors.image.message}
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
                    Publicar
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
