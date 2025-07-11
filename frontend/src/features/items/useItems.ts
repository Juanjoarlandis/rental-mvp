import { useEffect, useState } from "react";
import axios from "axios";

export type Item = {
  id: number;
  name: string;
  description?: string;
  price_per_h: number;
  available: boolean;
  image_url?: string;          // 🆕  ← añade la propiedad
  categories?: { id: number; name: string }[];
};


export function useItems(params?: URLSearchParams) {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios
      .get<Item[]>("/api/items/", { params })
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.toString(), reload]);

  return { data, loading, refetch: () => setReload(r => r + 1) };
}
