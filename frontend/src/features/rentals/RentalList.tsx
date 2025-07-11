import { useAuth } from "../../hooks/useAuth";
import { useRentals } from "./useRentals";

export default function RentalList() {
  const { token } = useAuth();
  const { data: rentals, loading } = useRentals(token);   // ← sin cambios extra

  if (!token)   return <p className="text-gray-500">Debes iniciar sesión para ver tus alquileres.</p>;
  if (loading)  return <p className="text-gray-500">Cargando…</p>;
  if (!rentals.length) return <p className="text-gray-500">No tienes alquileres activos.</p>;

  return (
    <div className="space-y-2">
      {rentals.map(r => (
        <div
          key={r.id}
          className="flex items-center justify-between rounded-md bg-white p-3 shadow"
        >
          <span className="font-medium">{r.item.name}</span>
          <span className={r.returned ? "badge--ok" : "badge badge--danger"}>
            {r.returned ? "Devuelto" : "Pendiente"}
          </span>
        </div>
      ))}
    </div>
  );
}
