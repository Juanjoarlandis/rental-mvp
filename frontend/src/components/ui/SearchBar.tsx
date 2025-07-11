import { useForm } from 'react-hook-form';

type Props = { onSubmit: (q: URLSearchParams) => void };

export default function SearchBar({ onSubmit }: Props) {
  const { register, handleSubmit, reset } = useForm<{
    q: string;
    min: number | undefined;
    max: number | undefined;
  }>({ defaultValues: { q: '', min: undefined, max: undefined } });

  return (
    <form
      onSubmit={handleSubmit(values => {
        const params = new URLSearchParams();
        if (values.q) params.set('name', values.q);
        if (values.min) params.set('min_price', values.min.toString());
        if (values.max) params.set('max_price', values.max.toString());
        onSubmit(params);
      })}
      className="flex flex-wrap items-end gap-3"
    >
      <input
        {...register('q')}
        placeholder="Buscar producto…"
        className="form-input w-52"
      />
      <input
        {...register('min', { valueAsNumber: true })}
        type="number"
        step="0.1"
        min={0}
        placeholder="€ mínimo"
        className="form-input w-32"
      />
      <input
        {...register('max', { valueAsNumber: true })}
        type="number"
        step="0.1"
        min={0}
        placeholder="€ máximo"
        className="form-input w-32"
      />
      <button className="btn">Filtrar</button>
      <button
        type="button"
        onClick={() => {
          reset();
          onSubmit(new URLSearchParams());
        }}
        className="btn--ghost"
      >
        Limpiar
      </button>
    </form>
  );
}
