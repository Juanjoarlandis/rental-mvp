/* -------------------------------------------------------------------------- */
/*  ItemDetailModal.tsx – logos encima del CTA + CTA más grande               */
/* -------------------------------------------------------------------------- */
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  StarIcon,
  ShieldCheckIcon,
  ClockIcon,
  MapPinIcon,
  CheckBadgeIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import clsx from 'clsx';

import { Item } from '../../features/items/useItems';
import { resolveImage } from '../../utils';
import LazyImage from './LazyImage';

/* ------------------- helpers (Rating, Feature, Description) --------------- */

const Rating = ({ value }: { value: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        className={clsx(
          'h-4 w-4',
          i < value ? 'fill-amber-400 stroke-amber-400' : 'stroke-gray-300'
        )}
      />
    ))}
    <span className="ml-1 text-xs text-gray-500">({value.toFixed(1)})</span>
  </div>
);

const Feature = ({
  icon: Icon,
  text
}: {
  icon: (p: any) => JSX.Element;
  text: string;
}) => (
  <li className="flex items-center gap-2">
    <Icon className="h-4 w-4 shrink-0 text-brand" />
    {text}
  </li>
);

const Description = ({ text }: { text: string }) => {
  const bullets = text
    .split(/(?:\u2022|\n)/) // • o salto de línea
    .map(t => t.trim())
    .filter(Boolean);

  if (bullets.length > 1) {
    return (
      <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-700">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    );
  }
  return (
    <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
      {text}
    </p>
  );
};

/* -------------------------------------------------------------------------- */

type Props = { open: boolean; onClose: () => void; item: Item | null };

export default function ItemDetailModal({ open, onClose, item }: Props) {
  if (!item) return null;

  /* ---------- galería ---------- */
  const gallery =
    item.image_urls?.length
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

  /* ---------- specs demo ---------- */
  const SPECS: Record<string, string | number> = {
    Potencia: '600 W',
    Peso: '1,8 kg',
    Velocidad: '0-2 800 rpm'
  };

  /* ---------------------------------------------------------------------- */
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* ---- backdrop ---- */}
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

        {/* ---- wrapper ---- */}
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
            <Dialog.Panel className="flex w-full max-w-6xl max-h-[95vh] flex-col overflow-hidden rounded-xl bg-white shadow-xl">
              {/* ---------------- Header ---------------- */}
              <header className="flex items-center justify-between border-b px-6 py-4">
                <Dialog.Title className="text-lg font-semibold">
                  {item.name}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </header>

              {/* ---------------- Body ---------------- */}
              <section className="flex flex-1 flex-col gap-8 overflow-y-auto p-6 lg:flex-row">
                {/* ---------- Galería ---------- */}
                <div className="lg:w-1/2">
                  <div className="aspect-video overflow-hidden rounded-lg border">
                    <LazyImage
                      src={gallery[active]}
                      alt={item.name}
                      className="h-full w-full object-contain"
                      sizes="(min-width:1024px) 50vw, 90vw"
                    />
                  </div>

                  {gallery.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto">
                      {gallery.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setActive(i)}
                          className={clsx(
                            'shrink-0 overflow-hidden rounded-md border',
                            active === i && 'ring-2 ring-brand'
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
                <div className="flex flex-1 flex-col gap-6">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-3xl font-bold text-brand">
                      {item.price_per_h.toFixed(2)} €/h
                    </p>
                    <Rating value={4} />
                  </div>

                  {item.description ? (
                    <Description text={item.description} />
                  ) : (
                    <p className="text-sm text-gray-500">Sin descripción.</p>
                  )}

                  <table className="mt-2 w-full max-w-sm text-sm">
                    <tbody>
                      {Object.entries(SPECS).map(([k, v]) => (
                        <tr key={k} className="border-b last:border-0">
                          <td className="py-1 pr-4 text-gray-600">{k}</td>
                          <td className="py-1 font-medium">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

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

                  {/* vendedor */}
                  <div className="flex items-center gap-3 rounded-md bg-gray-50 p-4">
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    <div className="flex-1">
                      <p className="flex items-center gap-1 text-sm font-semibold">
                        Juan P.
                        <CheckBadgeIcon className="h-4 w-4 text-emerald-500" />
                      </p>
                      <p className="text-xs text-gray-500">
                        Propietario verificado
                      </p>
                    </div>
                  </div>

                  <p className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPinIcon className="h-4 w-4" />
                    Recogida en Madrid 28010
                  </p>

                  <ul className="space-y-1 text-sm">
                    <Feature
                      icon={ShieldCheckIcon}
                      text="Pago seguro con fianza"
                    />
                    <Feature
                      icon={ClockIcon}
                      text="Cancelación gratis hasta 12 h antes"
                    />
                  </ul>

                  {/* redes */}
                  <div className="mt-3 flex gap-4">
                    <Social icon={FaFacebookF} label="Facebook" />
                    <Social icon={FaTwitter} label="Twitter" />
                    <Social icon={FaWhatsapp} label="WhatsApp" />
                  </div>

                  {/* --------- LOGOS de pago — AHORA encima del CTA --------- */}
                  <div className="mt-6 flex justify-center gap-10 opacity-80">
                    <img
                      src="/src/assets/payments/visa.svg"
                      alt="Visa"
                      className="h-8 md:h-10 w-auto"
                    />
                    <img
                      src="/src/assets/payments/mastercard.svg"
                      alt="Mastercard"
                      className="h-8 md:h-10 w-auto"
                    />
                    <img
                      src="/src/assets/payments/paypal.svg"
                      alt="PayPal"
                      className="h-8 md:h-10 w-auto"
                    />
                  </div>

                  {/* CTA – ahora más grande */}
                  <button className="btn mt-4 w-full lg:max-w-xl py-4 text-lg">
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

/* --------------------------- Social button ------------------------------- */
function Social({
  icon: Icon,
  label
}: {
  icon: (p: any) => JSX.Element;
  label: string;
}) {
  return (
    <a
      href="#share"
      aria-label={`Compartir en ${label}`}
      className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
