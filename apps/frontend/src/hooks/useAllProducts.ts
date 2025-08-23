import { useQuery } from "@tanstack/react-query";
import type { ProductDtoV2 } from "../api/products";
import { fetchProducts } from "../api/products";

export function useAllProducts() {
  return useQuery<ProductDtoV2[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60,  // 1 Minute
    refetchOnWindowFocus: true,
  });
}
