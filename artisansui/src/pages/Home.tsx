import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import "./Home.css";

import { checkAuth } from "../api/authApi";

import {
  getHomeProducts,
  getProductImageUrl,
  Product,
} from "../services/productService";

import { addToCart } from "../services/cartService";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

import homepage1 from "../assets/homepage1.jpg";
import homepage2 from "../assets/homepage2.jpg";
import homepage3 from "../assets/homepage3.jpg";
import homepage4 from "../assets/homepage4.jpg";

const heroImages = [homepage1, homepage2, homepage3, homepage4];

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  /* ================= HERO SLIDER ================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  /* ================= LOAD PRODUCTS ================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        const auth = await checkAuth();
        setIsLoggedIn(auth.status === 200);

        const productData = await getHomeProducts();
        setProducts(productData);

        const wishlistData = await getWishlist();

        const ids = wishlistData.map((p: any) => p.productId);

        setWishlist(ids);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    loadData();
  }, []);

  /* ================= ADD TO CART ================= */

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);

      alert("Product added to cart");
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= TOGGLE WISHLIST ================= */

  const toggleWishlist = async (productId: number) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      if (wishlist.includes(productId)) {
        await removeFromWishlist(productId);

        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await addToWishlist(productId);

        setWishlist((prev) => [...prev, productId]);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  /* ================= GO TO PRODUCT ================= */

  const goToProduct = (id: number) => {
    navigate(`/product/${id}`);
  };

  const handleShopClick = () => {
    if (isLoggedIn) {
      navigate("/shop");
    } else {
      navigate("/login");
    }
  };

  return (
    <main className="home">
      {/* HERO */}

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-left">
            <span className="badge">Handcrafted • Ethical • Timeless</span>

            <h1>
              Explore the aesthetic
              <br />
              allure of India’s
              <br />
              handcrafted treasures
            </h1>

            <p>
              Curated brassware, textiles, pottery and more from master
              artisans.
            </p>

            <div className="hero-actions">
              <button onClick={handleShopClick} className="btn-primary">
                Shop now
              </button>

              <Link to="/about" className="btn-secondary">
                About us
              </Link>
            </div>
          </div>

          <div className="hero-right">
            <img
              src={heroImages[current]}
              alt="products"
              className="hero-slider-img"
            />
          </div>
        </div>
      </section>

      {/* PRODUCTS */}

      <section className="products container">
        <div className="section-header">
          <h3>New Arrivals</h3>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              {/* IMAGE */}

              <div
                className="product-img"
                onClick={() => goToProduct(product.id)}
              >
                <img
                  src={getProductImageUrl(product.imageIds[0])}
                  alt={product.name}
                />

                <button
                  type="button"
                  className="wishlist-btn"
                  onClick={(e) => {
                    e.stopPropagation();

                    toggleWishlist(product.id);
                  }}
                >
                  <Heart
                    size={16}
                    fill={wishlist.includes(product.id) ? "#c2511a" : "none"}
                    color={wishlist.includes(product.id) ? "#c2511a" : "#444"}
                  />
                </button>
              </div>

              {/* BODY */}

              <div
                className="product-body"
                onClick={() => goToProduct(product.id)}
              >
                <span className="product-category">{product.category}</span>

                <h4>{product.name}</h4>

                <div className="product-footer">
                  <span className="price">₹{product.price}</span>

                  <button
                    className="add-btn"
                    onClick={(e) => {
                      e.stopPropagation();

                      handleAddToCart(product.id);
                    }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
