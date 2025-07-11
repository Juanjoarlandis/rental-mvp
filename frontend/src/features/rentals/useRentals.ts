import axios from "axios";
import { useEffect, useState } from "react";
import { Item } from "../items/useItems";

export type Rental = {
  id: number;
  item: Item;
  start_at: string;
  end_at: string;
  deposit: number;
  returned: boolean;
};

export function useRentals(token: string | null) {
  const [data, setData] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get<Rental[]>("/api/rentals/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [token]);

  return { data, loading };
}
