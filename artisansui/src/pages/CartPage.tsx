import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

import {
  getCartItems,
  removeCartItem,
  updateCartQuantity,
  CartItem,
} from "../services/cartService";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await getCartItems();
      setCartItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* DELETE PRODUCT */

  const deleteItem = async (id: number) => {
    await removeCartItem(id);

    setCartItems((prev) => prev.filter((item) => item.productId !== id));
  };

  /* INCREASE QTY */

  const increase = async (item: CartItem) => {
    const newQty = item.qty + 1;

    await updateCartQuantity(item.productId, newQty);

    setCartItems((prev) =>
      prev.map((p) =>
        p.productId === item.productId ? { ...p, qty: newQty } : p,
      ),
    );
  };

  /* DECREASE QTY */

  const decrease = async (item: CartItem) => {
    if (item.qty === 1) return;

    const newQty = item.qty - 1;

    await updateCartQuantity(item.productId, newQty);

    setCartItems((prev) =>
      prev.map((p) =>
        p.productId === item.productId ? { ...p, qty: newQty } : p,
      ),
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  /* LOADING */

  if (loading) {
    return <h2 className="loading">Loading Cart...</h2>;
  }

  /* EMPTY CART */

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <img
          src="https://illustrations.popsy.co/amber/shopping-cart.svg"
          alt="empty"
        />

        <h2>Your cart is empty</h2>

        <button className="continue-btn" onClick={() => navigate("/shop")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Shopping Cart</h1>

      <div className="cart-container">
        {/* CART ITEMS */}

        <div className="cart-table">
          <div className="table-head">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
            <span></span>
          </div>

          {cartItems.map((item) => (
            <div className="cart-row" key={item.productId}>
              {/* PRODUCT */}
              <div className="product">
                <img src={item.image} alt={item.name} />

                <div>
                  <h4>{item.name}</h4>
                  {/* <p>{item.artisanName}</p> */}
                </div>
              </div>

              {/* PRICE */}
              <span>₹{item.price}</span>

              {/* QUANTITY */}
              <div className="qty">
                <button onClick={() => decrease(item)}>−</button>

                <span>{item.qty}</span>

                <button onClick={() => increase(item)}>+</button>
              </div>

              {/* SUBTOTAL */}
              <span>₹{(item.price * item.qty).toFixed(2)}</span>

              {/* DELETE */}
              <button
                className="cart-delete-btn"
                onClick={() => deleteItem(item.productId)}
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}

        <div className="order-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Items</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="summary-row">
            <span>Sub Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </div>

          <div className="summary-row">
            <span>Taxes</span>
            <span>₹{tax}</span>
          </div>

          <hr />

          <div className="cart-summary-total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={() =>
              navigate("/checkout", { state: { cartItems, total } })
            }
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
