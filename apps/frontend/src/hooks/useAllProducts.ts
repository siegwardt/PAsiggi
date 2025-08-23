import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type ProductDtoV2 } from "../api/products";

export function useAllProducts() {
  return useQuery<ProductDtoV2[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}
