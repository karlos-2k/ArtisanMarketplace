import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WishlistPage.css";

// Uncomment when connecting real services:
// import api from "../api/api";
// import { getWishlist, removeFromWishlist } from "../services/wishlistService";
// import { addToCart } from "../services/cartService";

interface WishlistItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  category: string;
}

/* ── MOCK DATA ── */
const MOCK_WISHLIST: WishlistItem[] = [
  {
    id: 1,
    name: "Handmade Wooden Bowl",
    brand: "ArtisanCraft Co.",
    price: 799,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80",
    inStock: true,
    rating: 4.5,
    reviewCount: 128,
    category: "Home Decor",
  },
  {
    id: 2,
    name: "Clay Flower Vase",
    brand: "Terra Studio",
    price: 499,
    originalPrice: 499,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80",
    inStock: false,
    rating: 4.0,
    reviewCount: 64,
    category: "Pottery",
  },
  {
    id: 3,
    name: "Traditional Wall Art",
    brand: "Heritage Prints",
    price: 1299,
    originalPrice: 1699,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
    inStock: true,
    rating: 4.8,
    reviewCount: 312,
    category: "Art",
  },
  {
    id: 4,
    name: "Woven Jute Basket",
    brand: "NaturalWeave",
    price: 349,
    originalPrice: 449,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    inStock: true,
    rating: 4.3,
    reviewCount: 89,
    category: "Storage",
  },
  {
    id: 5,
    name: "Brass Table Lamp",
    brand: "LuxeLight",
    price: 2199,
    originalPrice: 2799,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",
    inStock: true,
    rating: 4.6,
    reviewCount: 201,
    category: "Lighting",
  },
  {
    id: 6,
    name: "Macramé Wall Hanging",
    brand: "KnotStudio",
    price: 599,
    originalPrice: 599,
    image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80",
    inStock: false,
    rating: 4.2,
    reviewCount: 47,
    category: "Textile",
  },
];

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist]   = useState<WishlistItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [addingId, setAddingId]   = useState<number | null>(null);
  const [addedIds, setAddedIds]   = useState<Set<number>>(new Set());

  /* ── LOAD ── */
  useEffect(() => {
    const t = setTimeout(() => {
      setWishlist(MOCK_WISHLIST);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
    // Replace with: loadWishlist();
  }, []);

  // const loadWishlist = async () => { ... };

  /* ── REMOVE ── */
  const removeItem = async (id: number) => {
    // await removeFromWishlist(id);
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  /* ── ADD TO CART ── */
  const handleAddToCart = async (item: WishlistItem) => {
    if (!item.inStock || addingId !== null) return;
    setAddingId(item.id);
    try {
      // await addToCart(item.id, 1);
      // await removeFromWishlist(item.id);
      await new Promise((r) => setTimeout(r, 700)); // simulate
      setAddedIds((prev) => new Set(prev).add(item.id));
      setTimeout(() => {
        setWishlist((prev) => prev.filter((w) => w.id !== item.id));
      }, 800);
    } catch (err) {
      console.error("Add to cart error", err);
    } finally {
      setAddingId(null);
    }
  };

  /* ── CLEAR ── */
  const clearWishlist = async () => {
    // for (const item of wishlist) await removeFromWishlist(item.id);
    setWishlist([]);
  };

  /* ── ADD ALL ── */
  const addAllToCart = async () => {
    const inStockItems = wishlist.filter((i) => i.inStock);
    for (const item of inStockItems) {
      // await addToCart(item.id, 1);
      // await removeFromWishlist(item.id);
    }
    setWishlist((prev) => prev.filter((i) => !i.inStock));
  };

  /* ── HELPERS ── */
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`wl-star ${i < Math.floor(rating) ? "filled" : i < rating ? "half" : ""}`}>★</span>
    ));

  const discountPct = (orig: number, curr: number) =>
    orig > curr ? Math.round(((orig - curr) / orig) * 100) : 0;

  const inStockCount = wishlist.filter((w) => w.inStock).length;

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="wl-loading">
        <div className="wl-loading-dots">
          <span /><span /><span />
        </div>
        <p>Loading wishlist…</p>
      </div>
    );
  }

  /* ── EMPTY ── */
  if (wishlist.length === 0) {
    return (
      <div className="wl-empty">
        <div className="wl-empty-icon">♡</div>
        <h2>Your wishlist is empty</h2>
        <p>Save items you love and come back to them anytime.</p>
        <button className="wl-continue-btn" onClick={() => navigate("/shop")}>
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="wl-page">

      {/* ── PAGE HEADER ── */}
      <div className="wl-page-header">
        <div>
          <h1 className="wl-heading">
            Wishlist
            <span className="wl-heading-badge">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
            </span>
          </h1>
          <p className="wl-subheading">
            {inStockCount} item{inStockCount !== 1 ? "s" : ""} available to order
          </p>
        </div>
        <button className="wl-cart-link" onClick={() => navigate("/cart")}>
          🛒 View Cart
        </button>
      </div>

      {/* ── GRID ── */}
      <div className="wl-grid">
        {wishlist.map((item) => {
          const disc    = discountPct(item.originalPrice, item.price);
          const isAdded = addedIds.has(item.id);
          const isAdding = addingId === item.id;

          return (
            <div className={`wl-card ${!item.inStock ? "oos" : ""}`} key={item.id}>

              {/* Remove */}
              <button
                className="wl-remove-btn"
                onClick={() => removeItem(item.id)}
                title="Remove from wishlist"
              >✕</button>

              {/* Discount badge */}
              {disc > 0 && <span className="wl-disc-badge">{disc}% OFF</span>}

              {/* Image */}
              <div className="wl-card-img">
                <img src={item.image} alt={item.name} />
                {!item.inStock && (
                  <div className="wl-oos-overlay">
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="wl-card-info">
                <p className="wl-card-category">{item.category}</p>
                <h4 className="wl-card-name">{item.name}</h4>
                <p className="wl-card-brand">{item.brand}</p>

                <div className="wl-rating-row">
                  <span className="wl-stars">{renderStars(item.rating)}</span>
                  <span className="wl-review-count">({item.reviewCount})</span>
                </div>

                <div className="wl-price-row">
                  <span className="wl-price-now">₹{item.price.toFixed(2)}</span>
                  {item.originalPrice > item.price && (
                    <span className="wl-price-old">₹{item.originalPrice}</span>
                  )}
                </div>

                <span className={`wl-stock-badge ${item.inStock ? "in" : "out"}`}>
                  <span className="wl-stock-dot" />
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* CTA */}
              <button
                className={`wl-add-btn ${!item.inStock ? "disabled" : ""} ${isAdded ? "added" : ""}`}
                disabled={!item.inStock || isAdding || isAdded}
                onClick={() => handleAddToCart(item)}
              >
                {isAdded ? "✓ Added to Cart" : isAdding ? "Adding…" : item.inStock ? "Add to Cart" : "Unavailable"}
              </button>

            </div>
          );
        })}
      </div>

      {/* ── FOOTER ACTIONS ── */}
      <div className="wl-footer">
        <div className="wl-footer-info">
          <span className="wl-footer-count">{wishlist.length} saved</span>
          <span className="wl-footer-sep">·</span>
          <span className="wl-footer-sub">{inStockCount} available</span>
        </div>
        <div className="wl-footer-btns">
          <button className="wl-clear-btn" onClick={clearWishlist}>
            Clear All
          </button>
          <button
            className="wl-add-all-btn"
            onClick={addAllToCart}
            disabled={inStockCount === 0}
          >
            Add All to Cart ({inStockCount})
          </button>
        </div>
      </div>

    </div>
  );
};

export default WishlistPage;