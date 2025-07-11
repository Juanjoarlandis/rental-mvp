/* -------------------------------------------------------------------------- */
/*  src/components/ui/ItemCard.tsx                                            */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import { HeartIcon, EyeIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

import { Item } from "../../features/items/useItems";
import { resolveImage } from "../../utils";
import LazyImage from "./LazyImage";
import ItemDetailModal from "./ItemDetailModal";

export default function ItemCard({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);

  /* -------- portada (1ª del array o la legacy) -------- */
  const cover = item.image_urls?.[0] ?? item.image_url;

  const imgSrc = resolveImage(
    cover,
    `https://source.unsplash.com/640x480/?${encodeURIComponent(item.name)}`
  );

  return (
    <>
      <article
        onClick={() => setOpen(true)}
        className="flex cursor-pointer flex-col overflow-hidden rounded-lg bg-surface shadow-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-cardHover"
      >
        {/* ---------- Foto ---------- */}
        <div className="relative">
          <LazyImage
            src={imgSrc}
            alt={item.name}
            className="aspect-[4/3] w-full object-contain p-2"
          />

          {!item.available && (
            <span className="absolute left-0 top-0 rounded-br-md bg-red-600/90 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
              Alquilado
            </span>
          )}

          {/* acciones rápidas */}
          <div className="absolute inset-0 flex items-start justify-end gap-2 p-2 opacity-0 transition-opacity hover:opacity-100">
            <IconBtn title="Vista rápida">
              <EyeIcon className="h-5 w-5" />
            </IconBtn>
            <IconBtn title="Favorito">
              <HeartIcon className="h-5 w-5" />
            </IconBtn>
          </div>
        </div>

        {/* ---------- Info ---------- */}
        <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
          <h3 className="line-clamp-1 text-lg font-semibold">{item.name}</h3>

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
                "badge",
                item.available ? "badge--ok" : "badge--danger"
              )}
            >
              {item.available ? "Disponible" : "Alquilado"}
            </span>
          </div>
        </div>
      </article>

      {/* ---------- Modal de detalle ---------- */}
      <ItemDetailModal open={open} onClose={() => setOpen(false)} item={item} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Helpers                                    */
/* -------------------------------------------------------------------------- */
function IconBtn({
  children,
  title
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={e => e.stopPropagation()}
      className="rounded-full bg-white/90 p-1 text-gray-600 shadow transition-colors hover:bg-white"
    >
      {children}
    </button>
  );
}
