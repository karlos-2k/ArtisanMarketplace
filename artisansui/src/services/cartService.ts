import api from "../api/api";

export interface CartItem {
  productId: number;
  name: string;
    // productName;: string;
  price: number;
  qty: number;
  image: string;
  artisanName: string;
}

/* ================= GET CART ================= */

export const getCartItems = async (): Promise<CartItem[]> => {
  const res = await api.get("/api/cart");

  return res.data.map((item: any) => ({
    productId: item.productId,
      name: item.productName,
    productName: item.productName,
    price: item.price,
    qty: item.quantity,
    image: `${api.defaults.baseURL}${item.imageUrl}`,
    artisanName: item.artisanName,
  }));
};

/* ================= ADD ================= */

export const addToCart = async (productId: number, quantity = 1) => {
  await api.post(`/api/cart/${productId}?quantity=${quantity}`);
};

/* ================= UPDATE ================= */

export const updateCartQuantity = async (
  productId: number,
  quantity: number,
) => {
  await api.put(`/api/cart/${productId}?quantity=${quantity}`);
};

/* ================= REMOVE ================= */

export const removeCartItem = async (productId: number) => {
  await api.delete(`/api/cart/${productId}`);
};

/* ================= CLEAR ================= */

export const clearCart = async () => {
  await api.delete("/api/cart/clear");
};
