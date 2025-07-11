import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import Container from '../../components/shared/Container';
import ItemCard from '../../components/ui/ItemCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import FiltersSidebar from '../../components/filters/FiltersSidebar';
import { useItems } from './useItems';
import { useAuth } from '../../hooks/useAuth';
import AddItemModal from './AddItemModal';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

/* -------------------------------------------------- */
/*                    Tipado filtros                  */
/* -------------------------------------------------- */
type FiltersT = {
  name?: string;
  min_price?: number;
  max_price?: number;
  categories?: number[];
  order?: 'price_asc' | 'price_desc' | 'name';
};

export default function ItemList() {
  /* ------------------------------ filtros ------------------------------ */
  const [filters, setFilters] = useState<FiltersT>({});

  /* Serializamos filtros → query-string */
  const params = useMemo(() => {
    const p = new URLSearchParams();

    Object.entries(filters).forEach(([k, v]) => {
      if (v === undefined || v === '') return;
      if (Array.isArray(v)) v.forEach(val => p.append(k, String(val)));
      else p.set(k, String(v));
    });

    /* orden (price_asc | price_desc | name) */
    if (filters.order) {
      const [field, dir] = filters.order.split('_');
      p.set('order_by', field === 'price' ? 'price' : 'name');
      p.set('order_dir', dir);
    }
    return p;
  }, [filters]);

  const { data: items, loading, refetch } = useItems(params);
  const { token } = useAuth();

  /* ----------------------- drawer móvil filtros ----------------------- */
  const [openFilters, setOpenFilters] = useState(false);

  /* ------------------------ infinite-scroll demo ---------------------- */
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinel.current) return;
    const ob = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          /* Aquí podrías paginar → aumentar offset y refetch() */
        }
      },
      { rootMargin: '600px' }
    );
    ob.observe(sentinel.current);
    return () => ob.disconnect();
  }, [loading]);

  /* ----------------------- modal “añadir ítem” ------------------------ */
  const [addOpen, setAddOpen] = useState(false);

  /* -------------------------------------------------------------------- */
  return (
    <Container>
      {/* ---------- botón abrir filtros (solo xs-sm) ---------- */}
      <button onClick={() => setOpenFilters(true)} className="btn mb-4 md:hidden">
        <Bars3Icon className="mr-2 h-5 w-5" />
        Filtros
      </button>

      <div className="flex flex-col gap-10 md:flex-row">
        {/* ---------- Filtros (off-canvas en móvil) ---------- */}
        {/* Backdrop */}
        <div
          className={`
            fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden
            ${openFilters ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setOpenFilters(false)}
        />

        {/* Panel */}
        <aside
          className={`
            fixed left-0 top-0 z-50 h-full w-72 bg-white p-6 shadow-xl transition-transform
            md:static md:h-auto md:w-auto md:translate-x-0 md:bg-transparent md:shadow-none
            ${openFilters ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {/* Cerrar (solo móvil) */}
          <button onClick={() => setOpenFilters(false)} className="mb-4 md:hidden">
            <XMarkIcon className="h-6 w-6" />
          </button>

          <FiltersSidebar
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({})}
          />
        </aside>

        {/* -------------------- listado de tarjetas -------------------- */}
        <section className="flex-1">
          {/* CTA añadir producto (solo usuarios logueados) */}
          {token && (
            <div className="flex justify-end">
              <button className="btn mb-4" onClick={() => setAddOpen(true)}>
                Añadir producto
              </button>
            </div>
          )}

          {/* loader inicial */}
          {loading && !items.length ? (
            <GridSkeleton />
          ) : (
            <Grid>
              {items.map(it => (
                <ItemCard key={it.id} item={it} />
              ))}
              {/* sentinel infinite-scroll */}
              <div ref={sentinel} />
            </Grid>
          )}

          {/* vacío */}
          {!loading && !items.length && (
            <p className="py-6 text-center text-gray-500">No hay resultados.</p>
          )}
        </section>
      </div>

      {/* modal añadir */}
      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={refetch} />
    </Container>
  );
}

/* -------------------------------------------------- */
/*                       Helpers                      */
/* -------------------------------------------------- */

/* Grid responsive: min-width 12 rem (≈192 px) y se
   auto-ajusta con container-queries si el padre pasa
   a ser un “container” — funciona también sin CQ. */
const Grid = ({ children }: { children: React.ReactNode }) => (
  <div
    className="
      grid gap-6 py-6 content-auto
      @container lg:[grid-template-columns:repeat(auto-fill,minmax(14rem,1fr))]
      [grid-template-columns:repeat(auto-fill,minmax(12rem,1fr))]
    "
  >
    {children}
  </div>
);

const GridSkeleton = () => (
  <Grid>
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </Grid>
);
