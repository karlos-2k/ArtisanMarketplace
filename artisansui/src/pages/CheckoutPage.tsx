import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import { createRazorpayOrder, verifyPayment } from "../services/paymentService";

import "./CheckoutPage.css";
import OrderSuccessModal from "./OrderSuccessModal";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems, total } = location.state || { cartItems: [], total: 0 };

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [loading, setLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const subtotal = total;
  const delivery = 40;
  const finalTotal = subtotal + delivery;

  const placeOrder = async () => {
    if (paymentMethod === "cod") {
      const orderData = {
        userId: 1,
        paymentMethod: "COD",
        items: cartItems.map((item: any) => ({
          productId: item.productId,
          quantity: item.qty,
          price: item.price,
        })),
      };

      const order = await createOrder(orderData);

      setOrderId(order.id);
      setTransactionId("COD");

      setShowSuccess(true);

      return;
    }

    try {
      setLoading(true);

      const razorOrder = await createRazorpayOrder(finalTotal);

      const options = {
        key: "rzp_test_SR6yxaUIjpZdFl",
        amount: razorOrder.amount,
        currency: razorOrder.currency,
        order_id: razorOrder.id,
        name: "Artisans Marketplace",
        description: "Handcrafted Product Payment",

        handler: async function (response: any) {
          await verifyPayment(response.razorpay_payment_id);

          const orderData = {
            userId: 1,
            paymentMethod: "RAZORPAY",
            items: cartItems.map((item: any) => ({
              productId: item.productId,
              quantity: item.qty,
              price: item.price,
            })),
          };

          const order = await createOrder(orderData);

          setOrderId(order.id);
          setTransactionId(response.razorpay_payment_id);

          setShowSuccess(true);
        },

        theme: {
          color: "#fb641b",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Secure Checkout</h2>

      <div className="checkout-layout">
        <div className="checkout-left">
          <div className="checkout-card">
            <h3 className="section-title">Shipping Address</h3>

            <div className="address-form">
              <input placeholder="Full Name" />

              <input placeholder="Phone Number" />

              <div className="address-row">
                <input placeholder="City" />
                <input placeholder="State" />
              </div>

              <div className="address-row">
                <input placeholder="Pincode" />
                <input defaultValue="India" />
              </div>

              <textarea placeholder="Full Address" />
            </div>
          </div>

          <div className="checkout-card">
            <h3 className="section-title">Payment Method</h3>

            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <span>Online Payment (UPI / Card / Net Banking)</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>

        <div className="checkout-right">
          <div className="summary-card">
            <h3>Price Details</h3>

            <div className="summary-row">
              <span>Price ({cartItems.length} items)</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Charges</span>
              <span>₹{delivery}</span>
            </div>

            <div className="divider" />

            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹{finalTotal}</span>
            </div>

            <button
              className="payment-btn"
              onClick={placeOrder}
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>

            <p className="secure-text">🔒 100% Secure Payment</p>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}

      {showSuccess && (
        <OrderSuccessModal
          orderId={orderId}
          transactionId={transactionId}
          onClose={() => navigate("/")}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
