import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  BookOpen,
  Layers,
  Package,
  Store,
  LogOut,
  UserCircle,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";
import "./Header.css";
import { checkAuth, logout } from "../api/authApi";
import { getCategories } from "../services/productService";



const Header: React.FC = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAccount, setShowAccount] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  /* ================= LOAD CATEGORIES ================= */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();

        const unique = Array.from(new Set(data));

        setCategories(unique);
      } catch (err) {
        console.error("Category load error", err);
      }
    };

    loadCategories();
  }, []);

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    checkAuth()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  /* ================= CLOSE DROPDOWN ================= */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowAccount(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* 🔥 FIXED ROLE CHECK */
  const isSeller = user?.roles?.includes("ROLE_SELLER");

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(search)}`);
  };

  if (loading) return null;

  return (
    <header className="header">
      <div className="container">
        {/* ================= TOP BAR ================= */}
        <div className="header-top">
          <Link to="/" className="logo">
            Artisans
          </Link>

          <div className="top-icons">
            <Link to="/wishlist">
              <Heart size={20} />
            </Link>
            <Link to="/cart">
              <ShoppingCart size={20} />
            </Link>

            {!user ? (
              <button className="account" onClick={() => navigate("/role")}>
                <User size={18} /> <span>Account</span>
              </button>
            ) : (
              <div className="account-dropdown" ref={dropdownRef}>
                <button
                  className="account"
                  onClick={() => setShowAccount((p) => !p)}
                >
                  <User size={18} />
                  <span>{user.name}</span>
                  <ChevronDown size={14} />
                </button>

                {showAccount && (
                  <div className="account-menu">
                    <button onClick={() => navigate("/orders")}>
                      <ClipboardList size={16} /> My Orders
                    </button>

                    <button onClick={() => navigate("/profile")}>
                      <UserCircle size={16} /> Profile
                    </button>

                    {isSeller && (
                      <button onClick={() => navigate("/seller")}>
                        <LayoutDashboard size={16} /> Seller Dashboard
                      </button>
                    )}

                    <hr />

                    <button className="danger" onClick={handleLogout}>
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="header-bottom">
          <nav className="nav-links">
            <Link to="/stories">
              <BookOpen size={16} /> Stories
            </Link>

            <div
              className="dropdown"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="dropdown-btn">
                <Layers size={16} /> Categories <ChevronDown size={14} />
              </button>

              {showCategories && (
                <div className="dropdown-menu">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() =>
                        navigate(`/shop?category=${encodeURIComponent(c)}`)
                      }
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/bulk-order">
              <Package size={16} /> Bulk order
            </Link>
            <Link to="/shop">
              <Store size={16} /> Shop
            </Link>
            <Link to="/about">About us</Link>
          </nav>

          <form onSubmit={onSearch} className="search-box">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </div>
    </header>
  );
};;

export default Header;
