import api from "../api/api";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageIds: number[];
}
export interface ProductDetail {
  id: number;
  name: string;
  artisan: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  imageIds: number[];
  avgRating: number;
}
export interface ProductCardDTO {
  id: number;
  name: string;
  category: string;
  price: number;
  imageIds: number[];
}

export const getExploreProducts = async (
  category?: string,
  maxPrice?: number,
): Promise<ProductCardDTO[]> => {
  const params: any = {};

  if (category && category !== "All") {
    params.category = category;
  }

  if (maxPrice) {
    params.maxPrice = maxPrice;
  }

  const res = await api.get("/api/products", { params });

  return res.data;
};


export const getCategories = async () => {
  const res = await api.get("/api/products/categories");
  return ["All", ...res.data];
};
/* ================= GET PRODUCT DETAIL ================= */

export const getProductDetail = async (
  productId: number,
): Promise<ProductDetail> => {
  const res = await api.get(`/api/products/${productId}`);
  return res.data;
};

/**
 * Fetch products for home page
 */
export const getHomeProducts = async (): Promise<Product[]> => {
  const response = await api.get("/api/products/home");
  return response.data;
};

/**
 * Build product image URL
 */
export const getProductImageUrl = (imageId: number): string => {
  return `${api.defaults.baseURL}/api/products/media/${imageId}`;
};