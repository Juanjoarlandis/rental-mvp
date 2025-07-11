/* -------------------------------------------------------------------------- */
/*  src/components/ui/ItemDetailModal.tsx                                     */
/* -------------------------------------------------------------------------- */
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  StarIcon,
  ShieldCheckIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { Item } from "../../features/items/useItems";
import { resolveImage } from "../../utils";
import LazyImage from "./LazyImage";
import clsx from "clsx";

type Props = {
  open: boolean;
  onClose: () => void;
  item: Item | null;
};

export default function ItemDetailModal({ open, onClose, item }: Props) {
  if (!item) return null;

  /* ---------- galería: imágenes reales o fallback ---------- */
  const gallery =
    item.image_urls && item.image_urls.length
      ? item.image_urls
      : [
          resolveImage(
            item.image_url,
            `https://source.unsplash.com/800x600/?${encodeURIComponent(
              item.name
            )}`
          )
        ];

  const [active, setActive] = useState(0);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
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
            <Dialog.Panel className="flex w-full max-w-5xl max-h-[95vh] flex-col overflow-hidden rounded-xl bg-white shadow-xl">
              {/* ---------------- Header ---------------- */}
              <header className="flex items-center justify-between border-b px-6 py-4">
                <Dialog.Title className="text-lg font-semibold">
                  {item.name}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </header>

              {/* ---------------- Body ---------------- */}
              <section className="flex flex-1 flex-col gap-8 overflow-y-auto p-6 md:flex-row">
                {/* ---------- Galería ---------- */}
                <div className="md:w-1/2">
                  {/* principal */}
                  <div className="aspect-video overflow-hidden rounded-lg border">
                    <LazyImage
                      src={gallery[active]}
                      alt={item.name}
                      className="h-full w-full object-contain"
                      sizes="(min-width:768px) 50vw, 90vw"
                    />
                  </div>

                  {/* thumbnails */}
                  {gallery.length > 1 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto">
                      {gallery.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setActive(i)}
                          className={clsx(
                            "shrink-0 overflow-hidden rounded-md border",
                            active === i && "ring-2 ring-brand"
                          )}
                        >
                          <LazyImage
                            src={src}
                            alt=""
                            className="h-16 w-24 object-cover"
                            sizes="96px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ---------- Ficha ---------- */}
                <div className="flex flex-1 flex-col gap-6 md:pr-4">
                  {/* precio + rating */}
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-brand">
                      {item.price_per_h.toFixed(2)} €/h
                    </p>
                    <Rating value={4} />
                  </div>

                  {/* descripción */}
                  {item.description ? (
                    <p className="prose max-w-none text-sm leading-relaxed">
                      {item.description}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Sin descripción.</p>
                  )}

                  {/* categorías */}
                  {!!item.categories?.length && (
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
                  )}

                  {/* ventajas rápidas */}
                  <ul className="space-y-2 text-sm">
                    <Feature icon={ShieldCheckIcon} text="Pago seguro con fianza" />
                    <Feature
                      icon={ClockIcon}
                      text="Cancelación gratis hasta 12 h antes"
                    />
                  </ul>

                  {/* CTA */}
                  <button className="btn mt-auto w-full md:max-w-xs">
                    Reservar ahora
                  </button>
                </div>
              </section>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Helpers                                    */
/* -------------------------------------------------------------------------- */
function Rating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={clsx(
            "h-5 w-5",
            i < value ? "fill-amber-400 stroke-amber-400" : "stroke-gray-300"
          )}
        />
      ))}
      <span className="ml-1 text-xs text-gray-500">
        ({value.toFixed(1)})
      </span>
    </div>
  );
}

function Feature({
  icon: Icon,
  text
}: {
  icon: (props: any) => JSX.Element;
  text: string;
}) {
  return (
    <li className="flex items-center gap-2">
      <Icon className="h-4 w-4 shrink-0 text-brand" />
      {text}
    </li>
  );
}
