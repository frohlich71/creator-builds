import { useAuthenticatedApi } from '../hooks/useAuthenticatedApi'
import { Product } from '@/types/product'

export function useProductService() {
  const { api } = useAuthenticatedApi()
  
  return {
    searchByTitle: async (q: string, limit?: number): Promise<Product[]> => {
      if (!q || q.length < 2) return [];
      
      const params = new URLSearchParams({ q });
      if (limit) params.append('limit', limit.toString());

      const response = await api!.get(`/products/search?${params.toString()}`);
      
      if (response.status !== 200) {
        throw new Error('Failed to fetch products');
      }

      return response.data;
    }
  }
}
