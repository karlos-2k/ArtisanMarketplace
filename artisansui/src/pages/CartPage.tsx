import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

// Uncomment when connecting real service:
// import { getCartItems, removeCartItem, updateCartQuantity, CartItem } from "../services/cartService";

/* ── MOCK DATA ── */
interface CartItem {
  productId: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice: number;
  qty: number;
  color: string;
  size: string;
}

const MOCK_CART: CartItem[] = [
  {
    productId: 1,
    name: "Delightful Honey Brown Boots",
    brand: "Canadian Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    price: 652,
    originalPrice: 815,
    qty: 1,
    color: "Blue, Brown",
    size: "6",
  },
  {
    productId: 2,
    name: "Acton Propulsion Sneakers",
    brand: "Canadian Footwear",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80",
    price: 899,
    originalPrice: 1124,
    qty: 2,
    color: "Black, White",
    size: "8",
  },
  {
    productId: 3,
    name: "Kodiak Trek Hiking Boot",
    brand: "Canadian Footwear",
    image: "https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=400&q=80",
    price: 1199,
    originalPrice: 1499,
    qty: 1,
    color: "Brown, Tan",
    size: "9",
  },
  {
    productId: 4,
    name: "Terra Crossbow Work Boot",
    brand: "Canadian Footwear",
    image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&q=80",
    price: 749,
    originalPrice: 749,
    qty: 1,
    color: "Black",
    size: "7",
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [delivery, setDelivery] = useState<"delivery" | "pickup">("delivery");
  const [tip, setTip] = useState<number>(4);

  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetch delay
    const t = setTimeout(() => {
      setCartItems(MOCK_CART);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);

    // Replace with real API:
    // loadCart();
  }, []);

  // const loadCart = async () => {
  //   try { const data = await getCartItems(); setCartItems(data); }
  //   catch (e) { console.error(e); }
  //   finally { setLoading(false); }
  // };

  const deleteItem = (id: number) =>
    setCartItems((prev) => prev.filter((item) => item.productId !== id));

  const increase = (item: CartItem) =>
    setCartItems((prev) =>
      prev.map((p) => p.productId === item.productId ? { ...p, qty: p.qty + 1 } : p)
    );

  const decrease = (item: CartItem) => {
    if (item.qty === 1) return;
    setCartItems((prev) =>
      prev.map((p) => p.productId === item.productId ? { ...p, qty: p.qty - 1 } : p)
    );
  };

  const handleApplyCoupon = () => {
    if (coupon.trim()) setCouponApplied(true);
  };

  const subtotal     = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee  = delivery === "delivery" ? 7.99 : 0;
  const serviceFee   = 1.5;
  const tax          = parseFloat((subtotal * 0.08).toFixed(2));
  const discount     = couponApplied ? parseFloat((subtotal * 0.1).toFixed(2)) : 0;
  const total        = parseFloat((subtotal + deliveryFee + serviceFee + tax + tip - discount).toFixed(2));
  const totalItems   = cartItems.reduce((s, i) => s + i.qty, 0);

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="cp-loading">
        <div className="cp-spinner" />
        <p>Loading your cart…</p>
      </div>
    );
  }

  /* ── EMPTY ── */
  if (cartItems.length === 0) {
    return (
      <div className="cp-empty">
        <div className="cp-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <button className="cp-continue-btn" onClick={() => navigate("/shop")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cp-page">

      {/* ── PROGRESS ── */}
      <div className="cp-progress">
        <div className="cp-step active">
          <span className="cp-step-dot" />
          <span>Cart</span>
        </div>
        <div className="cp-step-line" />
        <div className="cp-step">
          <span className="cp-step-dot" />
          <span>Shipping</span>
        </div>
        <div className="cp-step-line" />
        <div className="cp-step">
          <span className="cp-step-dot" />
          <span>Payment</span>
        </div>
      </div>

      {/* ── HEADING ── */}
      <div className="cp-heading-row">
        <h1 className="cp-heading">
          My Cart
          <span className="cp-heading-badge">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
        </h1>
      </div>

      <div className="cp-layout">

        {/* ── LEFT ── */}
        <div className="cp-left">

          {/* Table header — desktop only */}
          {/* <div className="cp-table-head">
            <span>Product</span>
            <span>Price</span>
            <span>Qty</span>
            <span>Subtotal</span>
            <span />
          </div> */}

          {/* Items */}
          <div className="cp-items">
            {cartItems.map((item) => {
              const disc = item.originalPrice > item.price
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : 0;
              return (
                <div className="cp-card" key={item.productId}>

                  {/* Discount badge */}
                  {disc > 0 && <span className="cp-card-disc">{disc}% OFF</span>}

                  {/* Image */}
                  <div className="cp-card-img">
                    <img src={item.image} alt={item.name} />
                  </div>

                  {/* Body */}
                  <div className="cp-card-body">
                    <p className="cp-card-brand">{item.brand}</p>
                    <h4 className="cp-card-name">{item.name}</h4>
                    <div className="cp-card-meta">
                      <span className="cp-meta-pill">Color: {item.color}</span>
                      <span className="cp-meta-pill">Size: {item.size}</span>
                    </div>

                    {/* Price + qty — mobile stacked, desktop uses grid */}
                    <div className="cp-card-footer">
                      <div className="cp-price-group">
                        {item.originalPrice > item.price && (
                          <span className="cp-price-old">₹{item.originalPrice}</span>
                        )}
                        <span className="cp-price-now">₹{item.price.toFixed(2)}</span>
                      </div>

                      <div className="cp-qty">
                        <button className="cp-qty-btn" onClick={() => decrease(item)}>−</button>
                        <span className="cp-qty-val">{item.qty}</span>
                        <button className="cp-qty-btn" onClick={() => increase(item)}>+</button>
                      </div>

                      <p className="cp-subtotal-label">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="cp-card-actions">
                    <button
                      className="cp-remove-btn"
                      onClick={() => deleteItem(item.productId)}
                      title="Remove"
                    >✕</button>
                    <button
                      className="cp-move-btn"
                      onClick={() => navigate("/wishlist")}
                      title="Save for later"
                    >♡</button>
                  </div>

                </div>
              );
            })}
          </div>


        </div>

          {/* Coupon */}
          <div className="cp-coupon-card">
            <span className="cp-coupon-icon">🏷</span>
            <div className="cp-coupon-body">
              <p className="cp-coupon-label">Have a coupon?</p>
              <div className="cp-coupon-row">
                <input
                  className="cp-coupon-input"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                />
                <button className="cp-coupon-btn" onClick={handleApplyCoupon}>Apply</button>
              </div>
              {couponApplied && <p className="cp-coupon-success">✓ 10% discount applied!</p>}
            </div>
          </div>

          
        {/* ── RIGHT: SUMMARY ── */}
        <div className="cp-summary">

          <h3 className="cp-summary-title">Order Summary</h3>

          {/* Lines */}
          <div className="cp-summary-lines">
            <div className="cp-sum-row">
              <span className="cp-sum-label">Subtotal ({totalItems} items)</span>
              <span className="cp-sum-val">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="cp-sum-row">
              <span className="cp-sum-label">Delivery</span>
              <span className="cp-sum-val">{delivery === "delivery" ? `₹${deliveryFee}` : "Free"}</span>
            </div>
            <div className="cp-sum-row">
              <span className="cp-sum-label">Service Fee</span>
              <span className="cp-sum-val">₹{serviceFee.toFixed(2)}</span>
            </div>
            <div className="cp-sum-row">
              <span className="cp-sum-label">Tax (8%)</span>
              <span className="cp-sum-val">₹{tax.toFixed(2)}</span>
            </div>
            {couponApplied && (
              <div className="cp-sum-row">
                <span className="cp-sum-label">Coupon Discount</span>
                <span className="cp-sum-val cp-green">− ₹{discount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="cp-sum-divider" />

          <div className="cp-sum-total">
            <span>Total Payable</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            className="cp-checkout-btn"
            onClick={() => navigate("/checkout", { state: { cartItems, total } })}
          >
            Proceed to Checkout →
          </button>

          <p className="cp-secure-note">
            <span>🔒</span> Secure &amp; encrypted checkout
          </p>

        </div>
      </div>
    </div>
  );
};

export default CartPage;