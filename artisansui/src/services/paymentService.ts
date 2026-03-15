import api from "../api/api";

/* CREATE RAZORPAY ORDER */

export const createRazorpayOrder = async (amount: number) => {
  const res = await api.post("/api/payment/create-order", null, {
    params: { amount },
  });

  return res.data;
};

/* VERIFY PAYMENT */

export const verifyPayment = async (paymentId: string) => {
  const res = await api.post("/api/payment/verify", {
    razorpay_payment_id: paymentId,
  });

  return res.data;
};
