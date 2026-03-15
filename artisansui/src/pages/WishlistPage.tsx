import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WishlistPage.css";

import api from "../api/api";
import { getWishlist, removeFromWishlist } from "../services/wishlistService";
import { addToCart } from "../services/cartService";

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD WISHLIST ================= */

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const data = await getWishlist();

      const formatted = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,

        /* image path fix */
        image: `${api.defaults.baseURL}${item.primaryImageUrl}`,

        inStock: item.stock > 0,
      }));

      setWishlist(formatted);
    } catch (err) {
      console.error("Wishlist load error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= REMOVE SINGLE ================= */

  const removeItem = async (id: number) => {
    try {
      await removeFromWishlist(id);

      setWishlist((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Remove wishlist error", err);
    }
  };

  /* ================= ADD TO CART ================= */

  const handleAddToCart = async (item: WishlistItem) => {
    if (!item.inStock) return;

    try {
      await addToCart(item.id, 1);

      /* remove from wishlist after adding */
      await removeFromWishlist(item.id);

      setWishlist((prev) => prev.filter((w) => w.id !== item.id));
    } catch (err) {
      console.error("Add to cart error", err);
    }
  };

  /* ================= CLEAR WISHLIST ================= */

  const clearWishlist = async () => {
    try {
      for (const item of wishlist) {
        await removeFromWishlist(item.id);
      }

      setWishlist([]);
    } catch (err) {
      console.error("Clear wishlist error", err);
    }
  };

  /* ================= ADD ALL TO CART ================= */

  const addAllToCart = async () => {
    try {
      for (const item of wishlist) {
        if (item.inStock) {
          await addToCart(item.id, 1);

          await removeFromWishlist(item.id);
        }
      }

      setWishlist([]);
    } catch (err) {
      console.error("Add all to cart error", err);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="wishlist-container">
        <h2>Loading Wishlist...</h2>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">Wishlist</h1>

      {wishlist.length === 0 ? (
        /* EMPTY */

        <div className="empty-cart">
          <img
            src="https://illustrations.popsy.co/amber/shopping-cart.svg"
            alt="Empty Wishlist"
          />

          <h3>Your wishlist is empty</h3>

          <p>Looks like you haven’t added anything yet</p>

          <button className="continue-btn" onClick={() => navigate("/shop")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="wishlist-table">
            <div className="wishlist-header">
              <span></span>
              <span>Product</span>
              <span>Price</span>
              <span>Stock Status</span>
              <span></span>
            </div>

            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-row">
                <button
                  className="remove-icon"
                  onClick={() => removeItem(item.id)}
                >
                  ×
                </button>

                <div className="wishlist-product">
                  <img src={item.image} alt={item.name} />

                  <div>
                    <h4>{item.name}</h4>
                  </div>
                </div>

                <span>₹{item.price.toFixed(2)}</span>

                <span
                  className={
                    item.inStock ? "stock in-stock" : "stock out-stock"
                  }
                >
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </span>

                <button
                  className="add-cart-btn"
                  disabled={!item.inStock}
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          <div className="wishlist-actions">
            <div className="wishlist-buttons">
              <button className="clear-btn" onClick={clearWishlist}>
                Clear Wishlist
              </button>

              <button className="add-all-btn" onClick={addAllToCart}>
                Add All to Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistPage;
