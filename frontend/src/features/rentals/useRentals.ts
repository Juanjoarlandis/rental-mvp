import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";
import { Item } from "../items/useItems";

export type Rental = {
  id: number;
  item: Item;
  start_at: string;
  end_at: string;
  deposit: number;
  returned: boolean;
};

/**
 * Devuelve la lista de alquileres del usuario.  
 * Solo dispara la petición cuando `token` es *truthy*.
 */
export function useRentals(token: string | null) {
  const enabled = Boolean(token);          // ← normalizamos

  const { data, isLoading } = useQuery<Rental[]>({
    queryKey: ["rentals"],
    queryFn: () => api.get<Rental[]>("/rentals/me").then(r => r.data),
    enabled,                               // ✓ ahora siempre boolean
    staleTime: 60_000,
    retry: false
  });

  return { data: data ?? [], loading: isLoading };
}
