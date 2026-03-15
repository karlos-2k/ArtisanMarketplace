import api from "../api/api";

export interface Review {
  id: number;
  userName: string;
  rating: number;
  review: string;
  createdAt: string;
}

/* ================= GET REVIEWS ================= */

export const getReviewsByProduct = async (
  productId: number,
): Promise<Review[]> => {
  const res = await api.get(`/api/reviews/product/${productId}`);
  return res.data;
};

/* ================= ADD REVIEW ================= */

export const addReview = async (
  productId: number,
  userId: number,
  rating: number,
  review: string,
) => {
  return api.post(
    `/api/reviews/${productId}/${userId}?rating=${rating}&review=${review}`,
  );
};

/* ================= UPDATE ================= */

export const updateReview = async (
  reviewId: number,
  rating: number,
  review: string,
) => {
  return api.put(`/api/reviews/${reviewId}?rating=${rating}&review=${review}`);
};

/* ================= DELETE ================= */

export const deleteReview = async (reviewId: number) => {
  return api.delete(`/api/reviews/${reviewId}`);
};
