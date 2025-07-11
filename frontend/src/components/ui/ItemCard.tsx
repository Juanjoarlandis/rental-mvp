import { useState } from 'react';
import { Item } from '../../features/items/useItems';
import LazyImage from './LazyImage';
import { resolveImage } from '../../utils';
import QuickViewModal from './QuickViewModal';
import clsx from 'clsx';
import { HeartIcon, EyeIcon } from '@heroicons/react/24/solid';

export default function ItemCard({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);

  /* URL de la imagen: si el ítem trae `image_url` usamos esa;
     si no, caemos al placeholder de Unsplash. */
  const imgSrc = resolveImage(
    item.image_url,
    `https://source.unsplash.com/640x480/?${encodeURIComponent(item.name)}`
  );

  return (
    <>
      {/* max-w para que nunca “reviente” el layout si solo hay 1 tarjeta */}
      <article
        className="group flex w-full max-w-[15rem] flex-col overflow-hidden
                   rounded-lg bg-surface shadow-card transition-transform duration-200
                   hover:-translate-y-1 hover:shadow-cardHover mx-auto"
      >
        {/* ─────────── Imagen + overlays ─────────── */}
        <div
          className="relative cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <LazyImage
            src={imgSrc}
            alt={item.name}
            className="aspect-[4/3] w-full object-cover"
          />

          {/* badge “Alquilado” */}
          {!item.available && (
            <span className="absolute left-0 top-0 rounded-br-md bg-red-600/90 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
              Alquilado
            </span>
          )}

          {/* Quick-view & wishlist (hover) */}
          <div className="absolute inset-0 flex items-start justify-end gap-2 p-2 opacity-0 transition-opacity group-hover:opacity-100">
            <IconBtn title="Vista rápida" onClick={() => setOpen(true)}>
              <EyeIcon className="h-5 w-5" />
            </IconBtn>
            <IconBtn title="Favorito">
              <HeartIcon className="h-5 w-5" />
            </IconBtn>
          </div>
        </div>

        {/* ─────────── Contenido ─────────── */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
            {item.name}
          </h3>

          {item.description && (
            <p className="line-clamp-2 text-sm text-gray-600">
              {item.description}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between">
            <p className="text-base font-bold text-brand">
              {item.price_per_h.toFixed(2)} €/h
            </p>
            <span
              className={clsx(
                'badge',
                item.available ? 'badge--ok' : 'badge--danger'
              )}
            >
              {item.available ? 'Disponible' : 'Alquilado'}
            </span>
          </div>
        </div>
      </article>

      {/* Modal */}
      <QuickViewModal open={open} onClose={() => setOpen(false)} item={item} />
    </>
  );
}

/* helper botón overlay */
function IconBtn({
  children,
  onClick,
  title
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={e => {
        e.stopPropagation();
        onClick?.();
      }}
      className="rounded-full bg-white/90 p-1 text-gray-600 shadow transition-colors hover:bg-white"
    >
      {children}
    </button>
  );
}
