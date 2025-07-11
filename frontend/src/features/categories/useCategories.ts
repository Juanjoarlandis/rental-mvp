import { useEffect, useState } from 'react';
import axios from 'axios';

export type Category = { id: number; name: string };

export default function useCategories() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Category[]>('/api/categories/')
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
