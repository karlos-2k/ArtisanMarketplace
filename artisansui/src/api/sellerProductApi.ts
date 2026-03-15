// src/api/sellerProductApi.ts
import api from "./api";

/* GET SELLER PRODUCTS */
export async function getSellerProducts() {
  const res = await api.get("/api/seller/products");
  return res.data;
}

/* ADD PRODUCT */
export async function addSellerProduct(formData: FormData) {
  const res = await api.post("/api/seller/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

/* UPDATE PRODUCT */
export async function updateSellerProduct(
  id: number,
  payload: { name: string; price: number; stock: number }
) {
  const res = await api.put(`/api/seller/products/${id}`, payload);
  return res.data;
}

/* DELETE PRODUCT */
export async function deleteSellerProduct(id: number) {
  const res = await api.delete(`/api/seller/products/${id}`);
  return res.data;
}

/* IMAGE URL HELPER */
export const sellerImageUrl = (imageId: number) =>
  `http://localhost:8080/api/seller/products/image/${imageId}`;
