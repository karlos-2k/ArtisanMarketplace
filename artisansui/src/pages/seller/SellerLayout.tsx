import { NavLink, Outlet } from "react-router-dom";
import "./seller.css";

const SellerLayout = () => {
  return (
    <div className="seller-shell">
      <aside className="seller-sidebar">
        <h2 className="seller-logo">Artisans</h2>

        <nav>
          <NavLink to="/seller" end className="seller-link">
            Dashboard
          </NavLink>
          <NavLink to="/seller/products" className="seller-link">
            Products
          </NavLink>
        </nav>
      </aside>

      <main className="seller-main">

        <section className="seller-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default SellerLayout;
