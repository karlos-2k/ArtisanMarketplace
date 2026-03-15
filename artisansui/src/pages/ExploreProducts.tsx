import React, { useState } from "react";
import { Heart } from "lucide-react";
import "./ExploreProducts.css";

const categories = [
  "All",
  "Anklets",
  "Earrings",
  "Necklaces",
  "Home Decor",
  "Dining & Tableware",
  "Printed Fabrics",
];

const products = [
  {
    id: 1,
    name: "Odisha Dokra Threadwork Anklet",
    category: "Anklets",
    price: 490,
    image:
      "https://itokri.com/cdn/shop/files/3T1A9762_eb0c3c96-f784-4a2e-b2bf-59a0936df73e.jpg?v=1702045182&width=480",
  },
  {
    id: 2,
    name: "Handcrafted Brass Necklace",
    category: "Necklaces",
    price: 1290,
    image:
      "https://itokri.com/cdn/shop/products/BU83117.jpg?v=1620559109&width=480",
  },
  {
    id: 3,
    name: "Block Print Table Runner",
    category: "Dining & Tableware",
    price: 890,
    image:
      "https://itokri.com/cdn/shop/products/0Q8A1943.jpg?v=1682328412&width=480",
  },
];

const ExploreProducts: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(3000);

  const filteredProducts = products.filter((p) => {
    const categoryMatch =
      selectedCategory === "All" || p.category === selectedCategory;
    return categoryMatch && p.price <= maxPrice;
  });

  return (
    <main className="explore-page">
      <div className="container">
        {/* HEADER */}
        <header className="explore-header">
          {/* <h1>Explore All Products</h1> */}
          <p>
            Discover authentic handcrafted products curated from artisans across
            India.
          </p>
        </header>

        {/* MAIN LAYOUT */}
        <div className="explore-layout">
          {/* FILTER SIDEBAR */}
          <aside className="filter-sidebar">
            <h3>Filters</h3>
            {/* PRICE FILTER */}
            <div className="filter-section">
              <h4>Max Price</h4>
              <span className="price-value">₹{maxPrice}</span>
              <input
                type="range"
                min="300"
                max="3000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>
            {/* CATEGORY FILTER */}
            <div className="filter-section">
              <h4>Category</h4>
              <ul>
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      className={selectedCategory === cat ? "active" : ""}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <section className="product-area">
            <div className="product-grid">
              {filteredProducts.map((p) => (
                <div key={p.id} className="product-card">
                  <div className="product-img">
                    <img src={p.image} alt={p.name} />
                    <button className="wishlist-btn">
                      <Heart size={16} />
                    </button>
                  </div>

                  <div className="product-body">
                    <span className="product-category">{p.category}</span>
                    <h4>{p.name}</h4>

                    <div className="product-footer">
                      <span className="price">₹{p.price}</span>
                      <button className="add-btn">+ Add</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ExploreProducts;
