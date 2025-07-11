import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";

export type Category = { id: number; name: string };

export default function useCategories() {
  const { data, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.get<Category[]>("/categories/").then(r => r.data),
    staleTime: 5 * 60_000 // 5 min
  });

  return { data: data ?? [], loading: isLoading };
}
