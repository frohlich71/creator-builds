// Este arquivo agora é obsoleto - use useProductService.ts para componentes do cliente
// Mantido apenas para compatibilidade com código servidor se necessário

import { Product } from "@/types/product";
import { createServerApi } from "../lib/serverApi";

export async function searchProductsByTitle(token: string | undefined, q: string, limit?: number): Promise<Product[]> {
  if (!q || q.length < 2) return [];

  if (!token) {
    throw new Error('Token is required for product search');
  }
  const params = new URLSearchParams({ q });
  if (limit) params.append('limit', limit.toString());

  const api = createServerApi(token);
  const response = await api.get(`/products/search?${params.toString()}`);

  if (response.status !== 200) {
    throw new Error('Failed to fetch products');
  }

  return response.data;
}