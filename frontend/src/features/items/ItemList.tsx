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

type FiltersT = {
  name?: string;
  min_price?: number;
  max_price?: number;
  categories?: number[];
  order?: 'price_asc' | 'price_desc' | 'name';
};

export default function ItemList() {
  /* ---------------- Filtros ---------------- */
  const [filters, setFilters] = useState<FiltersT>({});
  const params = useMemo(() => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v === undefined || v === '') return;
      if (Array.isArray(v)) v.forEach(val => p.append(k, String(val)));
      else p.set(k, String(v));
    });
    if (filters.order) {
      const [field, dir] = filters.order.split('_');
      p.set('order_by', field === 'price' ? 'price' : 'name');
      p.set('order_dir', dir);
    }
    return p;
  }, [filters]);

  const { data: items, loading, refetch } = useItems(params);
  const { token } = useAuth();

  /* ------------- Drawer móvil -------------- */
  const [openFilters, setOpenFilters] = useState(false);

  /* ------------- Infinite demo ------------- */
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sentinel.current) return;
    const ob = new IntersectionObserver(
      e => {
        if (e[0].isIntersecting && !loading) {
          /* paginación futura */
        }
      },
      { rootMargin: '600px' }
    );
    ob.observe(sentinel.current);
    return () => ob.disconnect();
  }, [loading]);

  /* -------------- Modal add ---------------- */
  const [addOpen, setAddOpen] = useState(false);

  /* ---------------- Render ----------------- */
  return (
    <Container>
      {/* ------ Botón filtros sólo móvil ------ */}
      <button
        onClick={() => setOpenFilters(true)}
        className="btn mb-4 md:hidden"
      >
        <Bars3Icon className="h-5 w-5 mr-2" />
        Filtros
      </button>

      <div className="flex gap-10 md:flex-row flex-col">
        {/* -------- Sidebar (off-canvas en móvil) -------- */}
        <div
          className={`
            fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
            transition-opacity md:hidden
            ${openFilters ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setOpenFilters(false)}
        />

        <aside
          className={`
            fixed left-0 top-0 z-50 h-full w-72 bg-white p-6 shadow-xl
            transition-transform md:static md:translate-x-0 md:h-auto md:w-auto md:bg-transparent md:shadow-none
            ${openFilters ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {/* cierre móvil */}
          <button
            className="mb-4 md:hidden"
            onClick={() => setOpenFilters(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <FiltersSidebar
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({})}
          />
        </aside>

        {/* -------- Listado -------- */}
        <section className="flex-1">
          {token && (
            <div className="flex justify-end">
              <button className="btn mb-4" onClick={() => setAddOpen(true)}>
                Añadir producto
              </button>
            </div>
          )}

          {loading && !items.length ? (
            <GridSkeleton />
          ) : (
            <Grid>
              {items.map(it => (
                <ItemCard key={it.id} item={it} />
              ))}
              <div ref={sentinel} />
            </Grid>
          )}

          {!loading && !items.length && (
            <p className="py-6 text-center text-gray-500">
              No hay resultados.
            </p>
          )}
        </section>
      </div>

      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={refetch} />
    </Container>
  );
}

/* ---------------- Helpers ---------------- */
const Grid = ({ children }: { children: React.ReactNode }) => (
  <div
    className="
      grid gap-6 py-6
      [grid-template-columns:repeat(auto-fill,minmax(12rem,1fr))]
    "
  >
    {children}
  </div>
);

const GridSkeleton = () => (
  <Grid>{Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}</Grid>
);
