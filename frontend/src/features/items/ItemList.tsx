import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import Container from '../../components/shared/Container';
import ItemCard from '../../components/ui/ItemCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import FiltersSidebar from '../../components/filters/FiltersSidebar';
import { useItems } from './useItems';
import { useAuth } from '../../hooks/useAuth';
import AddItemModal from './AddItemModal';

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
  const params = useMemo(() => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v === undefined || v === '') return;
      if (Array.isArray(v)) v.forEach(val => p.append(k, String(val)));
      else p.set(k, String(v));
    });
    // orden
    if (filters.order) {
      const [field, dir] = filters.order.split('_');
      p.set('order_by', field === 'price' ? 'price' : 'name');
      p.set('order_dir', dir);
    }
    return p;
  }, [filters]);

  const { data: items, loading, refetch } = useItems(params);
  const { token } = useAuth();

  /* ----------------------- infinite scroll demo ----------------------- */
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sentinel.current) return;
    const ob = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          // aquí podrías aumentar skip y llamar a refetch, si tu API lo soporta
        }
      },
      { rootMargin: '600px' }
    );
    ob.observe(sentinel.current);
    return () => ob.disconnect();
  }, [loading]);

  /* ---------------------- modal de nuevo ítem ------------------------- */
  const [open, setOpen] = useState(false);

  /* demo rápido original (se mantiene oculto) --------------------------- */
  async function handleAdd(name: string, price: number) {
    if (!token) return;
    await axios.post(
      '/api/items/',
      { name, price_per_h: price },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    refetch();
  }

  return (
    <Container>
      <div className="flex gap-10">
        {/* -------- Sidebar -------- */}
        <FiltersSidebar
          value={filters}
          onChange={setFilters}
          onReset={() => setFilters({})}
        />

        {/* -------- Listado -------- */}
        <section className="flex-1">
          {/* botón añadir */}
          {token && (
            <div className="flex justify-end">
              <button className="btn mb-4" onClick={() => setOpen(true)}>
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
              {/* sentinel */}
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

      {/* modal */}
      <AddItemModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={refetch}
      />
    </Container>
  );
}

/* ---------- helpers ---------- */
const Grid = ({ children }: { children: React.ReactNode }) => (
  <div
    /* columnas exactas de 15 rem, centradas */
    className="mx-auto grid justify-center gap-6 py-6
               [grid-template-columns:repeat(auto-fill,15rem)]"
  >
    {children}
  </div>
);