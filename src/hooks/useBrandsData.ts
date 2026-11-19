import { useState, useEffect, useCallback } from 'react';
import { CoreApi } from '../services/api/coreApi';

export function useBrandsData() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const data = await CoreApi.getBrands();
      setBrands(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return { brands, loading, fetchBrands };
}
