import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductDetailPage.css";
import ProductReviews from "./ProductReviews";
import { Minus, Plus } from "lucide-react";

import {
  getProductDetail,
  getProductImageUrl,
  ProductDetail,
} from "../services/productService";

import { getReviewsByProduct, Review } from "../services/reviewService";

import { addToCart } from "../services/cartService";

const ProductDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [showFullDescription, setShowFullDescription] = useState(false);

  /* ================= LOAD PRODUCT ================= */

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      const data = await getProductDetail(Number(id));

      setProduct(data);

      const imgs = data.imageIds.map((img) => getProductImageUrl(img));

      setImages(imgs);
    };

    loadProduct();
  }, [id]);

  /* ================= LOAD REVIEWS ================= */

  useEffect(() => {
    const loadReviews = async () => {
      if (!id) return;

      const data = await getReviewsByProduct(Number(id));

      setReviews(data);
    };

    loadReviews();
  }, [id]);

  /* ================= AVG RATING ================= */

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "0.0";

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);

    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  /* ================= ADD TO CART ================= */

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart(product.id, quantity);

      alert("Product added to cart");
    } catch (err) {
      console.error("Add to cart error", err);
    }
  };

  /* ================= BUY NOW ================= */

  const handleBuyNow = async () => {
    if (!product) return;

    try {
      await addToCart(product.id, quantity);

      navigate("/cart");
    } catch (err) {
      console.error("Buy now error", err);
    }
  };

  if (!product) return <div>Loading...</div>;

  const prevImage = () =>
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  const nextImage = () =>
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="product-detail">
      {/* ================= PRODUCT GRID ================= */}

      <div className="product-detail-grid">
        {/* IMAGE GALLERY */}

        <div className="gallery">
          <div className="image-wrapper">
            <img
              src={images[currentIndex]}
              alt={product.name}
              className="main-image"
            />

            <button className="nav-btn left" onClick={prevImage}>
              ‹
            </button>

            <button className="nav-btn right" onClick={nextImage}>
              ›
            </button>
          </div>

          <div className="thumbnail-row">
            {images.map((img, index) => (
              <img
                key={img}
                src={img}
                alt={`${product.name} ${index}`}
                className={`thumbnail ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* PRODUCT INFO */}

        <div className="info">
          <span className="category">{product.category}</span>

          <h1>{product.name}</h1>

          <p className="artisan-badge">{product.artisan}</p>

          <div className="rating">
            ⭐ {averageRating} <span>({reviews.length} reviews)</span>
          </div>

          <div className="price">₹{product.price}</div>

          {/* QUANTITY */}

          <div className="quantity">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus size={16} />
            </button>

            <span>{quantity}</span>

            <button onClick={() => setQuantity(quantity + 1)}>
              <Plus size={16} />
            </button>
          </div>

          {/* ACTION BUTTONS */}

          <div className="product-actions">
            <button className="add-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>

            <button className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          {/* DESCRIPTION */}

          <div className="product-description-card">
            <h3>Product Details</h3>

            <p className="product-description-text">
              {showFullDescription
                ? product.description
                : `${product.description.slice(0, 140)}...`}
            </p>

            <button
              className="read-more-desc-btn"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "Show less ↑" : "Read more →"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= REVIEWS ================= */}

      <section className="reviews-section-full">
        <ProductReviews
          productId={product.id}
          userId={1}
          reviews={reviews}
          setReviews={setReviews}
          averageRating={averageRating}
        />
      </section>
    </div>
  );
};

export default ProductDetailPage;
