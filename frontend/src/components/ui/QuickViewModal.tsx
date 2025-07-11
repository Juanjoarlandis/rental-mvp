import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { Item } from '../../features/items/useItems';
import LazyImage from './LazyImage';
import { resolveImage } from '../../utils';
import clsx from 'clsx';

type Props = {
  open: boolean;
  onClose: () => void;
  item: Item | null;
};

export default function QuickViewModal({ open, onClose, item }: Props) {
  /* -------- si aún no hay datos -------- */
  if (!item) return null;

  /* -------- URL de la imagen -------- */
  const imgSrc = resolveImage(
    item.image_url,
    `https://source.unsplash.com/800x600/?${encodeURIComponent(item.name)}`
  );

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* ---------------- Backdrop ---------------- */}
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

        {/* ---------------- Panel ---------------- */}
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
            <Dialog.Panel
              className="
                flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden
                rounded-xl bg-white shadow-xl
              "
            >
              {/* ---------- Header ---------- */}
              <div className="flex items-center justify-between border-b p-4">
                <Dialog.Title className="text-lg font-semibold">
                  {item.name}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* ---------- Body ---------- */}
              <div
                className="
                  grid gap-6 overflow-y-auto p-6
                  md:grid-cols-2                    /* 1 col → xs-sm | 2 col → ≥ md */
                "
              >
                {/* ----- Imagen ----- */}
                <div className="flex items-center justify-center">
                  <LazyImage
                    src={imgSrc}
                    alt={item.name}
                    className="
                      w-full rounded-lg object-contain
                      max-h-[60vh]                 /* nunca se sale de la viewport */
                    "
                  />
                </div>

                {/* ----- Info ----- */}
                <div className="flex flex-col gap-4">
                  {/* Precio */}
                  <p className="text-2xl font-bold text-brand">
                    {item.price_per_h.toFixed(2)} €/h
                  </p>

                  {/* Rating (demo) */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={clsx(
                          'h-5 w-5',
                          i < 4
                            ? 'fill-amber-400 stroke-amber-400'
                            : 'stroke-gray-300'
                        )}
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-500">(4,0)</span>
                  </div>

                  {/* Descripción */}
                  {item.description ? (
                    <p className="prose max-w-none text-sm leading-relaxed">
                      {item.description}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Sin descripción.</p>
                  )}

                  {/* Categorías */}
                  {item.categories?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {item.categories.map(c => (
                        <span
                          key={c.id}
                          className="rounded-full bg-gray-100 px-3 py-0.5 text-xs text-gray-600"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {/* CTA */}
                  <button className="btn mt-auto w-full">Reservar ahora</button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
