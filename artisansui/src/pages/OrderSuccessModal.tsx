import React from "react";
import "./OrderSuccessModal.css";

type Props = {
  orderId: string;
  transactionId: string;
  onClose: () => void;
};

const OrderSuccessModal: React.FC<Props> = ({
  orderId,
  transactionId,
  onClose,
}) => {
  return (
    <div className="success-overlay">
      <div className="success-modal">
        {/* Animated Tick */}

        <div className="success-animation">
          <svg className="checkmark" viewBox="0 0 60 60">
            <circle
              className="checkmark-circle"
              cx="30"
              cy="30"
              r="25"
              fill="none"
            />

            <path
              className="checkmark-check"
              fill="none"
              d="M18 32 L26 40 L44 22"
            />
          </svg>
        </div>

        <h2>Order Placed Successfully</h2>

        <p className="success-text">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        <div className="order-details">
          <div className="detail-row">
            <span>Order ID</span>
            <span>{orderId}</span>
          </div>

          <div className="detail-row">
            <span>Transaction ID</span>
            <span>{transactionId}</span>
          </div>
        </div>

        <button className="continue-btn" onClick={onClose}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
