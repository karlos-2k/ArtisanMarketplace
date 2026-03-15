import React, { useEffect, useState } from "react";
import "./shop.css";

import {
  getExploreProducts,
  getProductImageUrl,
  ProductCardDTO,
  getCategories,
} from "../services/productService";

import { addToCart } from "../services/cartService";

const MAX_VISIBLE_CATEGORIES = 7;

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<ProductCardDTO[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState(3000);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("default");
  const [showAllCategories, setShowAllCategories] = useState(false);

  /* ================= LOAD CATEGORIES ================= */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();

        const cleanCategories = data.filter((c: string) => c !== "All");

        setCategories(["All", ...cleanCategories]);
      } catch (err) {
        console.error("Category load error", err);
      }
    };

    loadCategories();
  }, []);

  /* ================= LOAD PRODUCTS ================= */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getExploreProducts(category, price);
        setProducts(data);
      } catch (err) {
        console.error("Product load error", err);
      }
    };

    loadProducts();
  }, [category, price]);

  /* ================= WISHLIST ================= */

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  /* ================= SORT ================= */

  let filtered = [...products];

  if (sort === "priceLow") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sort === "priceHigh") {
    filtered.sort((a, b) => b.price - a.price);
  }

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, MAX_VISIBLE_CATEGORIES);

  return (
    <div className="shop-page">
      <div className="shop-layout">
        {/* SIDEBAR */}

        <aside className={`filters ${showFilters ? "show" : ""}`}>
          <button
            className="close-filter"
            onClick={() => setShowFilters(false)}
          >
            ✕
          </button>

          <h3>Filter Options</h3>

          {/* CATEGORY */}

          <div className="filter-block">
            <p>Categories</p>

            {visibleCategories.map((cat) => (
              <label key={cat}>
                <input
                  type="radio"
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                />

                {cat}
              </label>
            ))}

            {categories.length > MAX_VISIBLE_CATEGORIES && (
              <button
                className="view-all-btn"
                onClick={() => setShowAllCategories(!showAllCategories)}
              >
                {showAllCategories ? "Show Less" : "View All"}
              </button>
            )}
          </div>

          {/* PRICE */}

          <div className="filter-block">
            <p>Price</p>

            <input
              type="range"
              min="10"
              max="3000"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />

            <span>₹10 - ₹{price}</span>
          </div>
        </aside>

        {/* PRODUCTS */}

        <section className="products">
          <div className="shop-bar">
            <button
              className="filter-toggle"
              onClick={() => setShowFilters(true)}
            >
              ☰ Filters
            </button>

            <span>Showing {filtered.length} results</span>

            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="default">Default Sorting</option>
              <option value="priceLow">Price Low → High</option>
              <option value="priceHigh">Price High → Low</option>
            </select>
          </div>

          {/* GRID */}

          <div className="product-grid">
            {filtered.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  <img
                    src={getProductImageUrl(product.imageIds[0])}
                    alt={product.name}
                  />

                  <button
                    className="wishlist"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    {wishlist.includes(product.id) ? "♥" : "♡"}
                  </button>
                </div>

                <div className="product-info">
                  <span className="category">{product.category}</span>

                  <h4 className="product-name">{product.name}</h4>

                  <div className="product-footer">
                    <span className="new">₹{product.price}</span>

                    <button
                      className="cart-btn"
                      onClick={() => addToCart(product.id, 1)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShopPage;
