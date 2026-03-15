import React, { useState } from "react";
import "./ProductReviews.css";
import { addReview } from "../services/reviewService";

export interface Review {
  id: number;
  userName: string;
  rating: number;
  review: string;
  createdAt: string;
}

interface Props {
  productId: number;
  userId: number;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  averageRating: string;
}

const INITIAL_VISIBLE_REVIEWS = 4;

const ProductReviews: React.FC<Props> = ({
  productId,
  userId,
  reviews,
  setReviews,
  averageRating,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_REVIEWS);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  /* ================= SUBMIT REVIEW ================= */

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment) return;

    try {
      await addReview(productId, userId, rating, comment);

      const newReview: Review = {
        id: Date.now(),
        userName: "You",
        rating,
        review: comment,
        createdAt: new Date().toISOString(),
      };

      setReviews((prev) => [newReview, ...prev]);

      setRating(5);
      setComment("");
      setShowForm(false);
    } catch (err) {
      console.error("Review submit error", err);
    }
  };

  const visibleReviews = reviews.slice(0, visibleCount);
  const canShowMore = reviews.length > visibleCount;

  return (
    <section className="artisan-reviews">
      {/* HEADER */}

      <div className="reviews-header">
        <div className="rating-summary">
          <span className="rating-score">{averageRating}</span>

          <div>
            <strong>Excellent</strong>
            <p>{reviews.length} reviews</p>
          </div>
        </div>

        <button
          className="write-review-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* REVIEW FORM */}

      {showForm && (
        <form className="review-form" onSubmit={submitReview}>
          <select value={rating} onChange={(e) => setRating(+e.target.value)}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r}>{r} ⭐</option>
            ))}
          </select>

          <textarea
            placeholder="Write your review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button type="submit">Submit Review</button>
        </form>
      )}

      {/* REVIEWS LIST */}

      <div className="reviews-list">
        {visibleReviews.map((r) => (
          <div className="review-card" key={r.id}>
            <strong>
              {r.rating}.0 ⭐ {r.userName}
            </strong>

            <p>{r.review}</p>
          </div>
        ))}
      </div>

      {/* VIEW MORE */}

      {canShowMore && (
        <div className="view-more-wrapper">
          <button
            className="view-more-btn"
            onClick={() => setVisibleCount(reviews.length)}
          >
            View more reviews
          </button>
        </div>
      )}

      {/* SHOW LESS */}

      {!canShowMore && reviews.length > INITIAL_VISIBLE_REVIEWS && (
        <div className="view-more-wrapper">
          <button
            className="view-more-btn secondary"
            onClick={() => setVisibleCount(INITIAL_VISIBLE_REVIEWS)}
          >
            Show less
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
