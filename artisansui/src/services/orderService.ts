import api from "../api/api";

export const createOrder = async (orderData: any) => {
  const res = await api.post("/api/orders/create", orderData);
  return res.data;
};
