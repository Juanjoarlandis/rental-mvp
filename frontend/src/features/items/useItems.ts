import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";

export type Item = {
  id: number;
  name: string;
  description?: string;
  price_per_h: number;
  available: boolean;

  /* ---- imágenes ---- */
  /** 1 sola (compat.) */
  image_url?: string;
  /** varias (nuevo)   */
  image_urls?: string[];

  categories?: { id: number; name: string }[];
};

export function useItems(params?: URLSearchParams) {
  const queryKey = ["items", params?.toString() ?? ""];

  const { data, isLoading, refetch } = useQuery<Item[]>({
    queryKey,
    queryFn: () =>
      api.get<Item[]>("/items/", { params }).then(r => r.data),
    staleTime: 60_000 // 1 min sin refetch
  });

  return { data: data ?? [], loading: isLoading, refetch };
}
