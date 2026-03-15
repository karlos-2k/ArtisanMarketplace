import api from "../api/api";

export interface WishlistProductDto {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  createdAt: string;
}

/* ================= GET WISHLIST ================= */
export const getWishlist = async () => {
  const res = await api.get("/api/wishlist");
  return res.data;
};

/* ================= ADD ================= */
export const addToWishlist = async (productId: number) => {
  return api.post(`/api/wishlist/${productId}`);
};

/* ================= CHECK ================= */
export const checkWishlist = async (productId: number) => {
  const res = await api.get(`/api/wishlist/check/${productId}`);
  return res.data;
};

/* REMOVE FROM WISHLIST */
export const removeFromWishlist = async (productId: number) => {
  return api.delete(`/api/wishlist/${productId}`);
};