import { Disclosure } from '@headlessui/react';
import useCategories, { Category } from '../../features/categories/useCategories';

type Filters = {
  name?: string;
  min_price?: number;
  max_price?: number;
  categories?: number[];
  order?: 'price_asc' | 'price_desc' | 'name';
};

type Props = {
  value: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
};

export default function FiltersSidebar({ value, onChange, onReset }: Props) {
  const { data: cats } = useCategories();

  const toggleCat = (id: number) => {
    const list = new Set(value.categories ?? []);
    list.has(id) ? list.delete(id) : list.add(id);
    onChange({ ...value, categories: [...list] });
  };

  return (
    <aside className="w-full max-w-xs space-y-6 md:w-60 lg:w-72">
      {/* Search */}
      <input
        placeholder="Buscar…"
        className="form-input w-full"
        value={value.name ?? ''}
        onChange={e => onChange({ ...value, name: e.target.value || undefined })}
      />

      {/* Price */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between text-sm font-semibold">
              Precio {open ? '−' : '+'}
            </Disclosure.Button>
            <Disclosure.Panel className="mt-3 space-y-2">
              <input
                type="number"
                min={0}
                step={0.1}
                placeholder="mín"
                className="form-input w-full"
                value={value.min_price ?? ''}
                onChange={e =>
                  onChange({
                    ...value,
                    min_price: e.target.value ? Number(e.target.value) : undefined
                  })
                }
              />
              <input
                type="number"
                min={0}
                step={0.1}
                placeholder="máx"
                className="form-input w-full"
                value={value.max_price ?? ''}
                onChange={e =>
                  onChange({
                    ...value,
                    max_price: e.target.value ? Number(e.target.value) : undefined
                  })
                }
              />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Categories */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between text-sm font-semibold">
              Categorías {open ? '−' : '+'}
            </Disclosure.Button>
            <Disclosure.Panel className="mt-3 flex flex-wrap gap-2">
              {cats.map((c: Category) => {
                const active = value.categories?.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCat(c.id)}
                    className={
                      active
                        ? 'rounded-full bg-brand px-3 py-0.5 text-xs font-medium text-white'
                        : 'rounded-full border px-3 py-0.5 text-xs text-gray-600'
                    }
                  >
                    {c.name}
                  </button>
                );
              })}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Order */}
      <select
        className="form-select w-full"
        value={value.order ?? ''}
        onChange={e =>
          onChange({
            ...value,
            order: e.target.value ? (e.target.value as Filters['order']) : undefined
          })
        }
      >
        <option value="">Ordenar por…</option>
        <option value="price_asc">Precio ↑</option>
        <option value="price_desc">Precio ↓</option>
        <option value="name">Nombre</option>
      </select>

      {/* Reset */}
      <button onClick={onReset} className="btn--ghost w-full">
        Limpiar filtros
      </button>
    </aside>
  );
}
