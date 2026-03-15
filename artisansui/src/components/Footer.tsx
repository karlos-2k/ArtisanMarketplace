import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* COLUMN 1 */}
        <div className="footer-col">
          <h4>Craft Maestros</h4>
          <p>
            Celebrating India’s artisans with ethically sourced, handcrafted
            products.
          </p>
        </div>

        {/* COLUMN 2 */}
        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/shop?category=Brassware">Brassware</Link>
          <Link to="/shop?category=Textiles">Textiles</Link>
          <Link to="/shop?category=Ceramics">Ceramics</Link>
          <Link to="/shop?category=Woodcraft">Woodcraft</Link>
        </div>

        {/* COLUMN 3 */}
        <div className="footer-col">
          <h4>Customer</h4>
          <Link to="/shipping">Shipping & Returns</Link>
          <Link to="/bulk-order">Bulk Orders</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* COLUMN 4 */}
        <div className="footer-col footer-about">
          <h4>About us</h4>
          <p>
            Our mission is to connect artisans with patrons who value tradition,
            sustainability, and impeccable craftsmanship.
          </p>

          {/* <form className="footer-subscribe">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Connect</button>
          </form> */}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        © 2025 Craft Maestros. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
