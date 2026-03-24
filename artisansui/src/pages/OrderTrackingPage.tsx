import React from "react";
import "./OrderTrackingPage.css";

interface Item {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

const OrderTrackingPage: React.FC = () => {

  const items: Item[] = [
    {
      id: "4553458120",
      name: "Top for Women",
      size: "L",
      quantity: 2,
      price: 50,
      imageUrl: "https://images.unsplash.com/photo-1520975922284-9e0a2b6c1c1f"
    },
    {
      id: "8953458747",
      name: "Blue T-shirt for Men",
      size: "M",
      quantity: 1,
      price: 40,
      imageUrl: "https://images.unsplash.com/photo-1585386959984-a4155223169c"
    }
  ];

  const DELIVERY = 20;
  const DISCOUNT = 0;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const currentStep = 3;
  const isMobile = window.innerWidth < 768;
  const progressPercent = `${(currentStep / 4) * 100}%`;
  const total = subtotal + DELIVERY - DISCOUNT;

  // 👇 change this dynamically from backend

  const steps = [
    "Order Placed",
    "Packed",
    "In Transit",
    "Out for Delivery",
    "Delivered"
  ];

  return (
    <div className="order-page">

      <div className="order-container">

        {/* HEADER */}
        <div className="page-header">
          <h1>Order Tracking</h1>
          <p>Track your order in real-time</p>
        </div>

        {/* ORDER DETAILS */}
        <div className="order-header">
          <h2>Order Details</h2>
          <button className="invoice-btn" onClick={() => window.print()}>
            Download Invoice
          </button>
        </div>

        <div className="order-meta">
          <Meta label="Order Number" value="#2315482546" />
          <Meta label="Placed" value="20 Feb 2024" />
          <Meta label="Items" value="2 Items" />
          <Meta label="Payment" value="UPI" />
          <Meta label="Status" value="In Transit" highlight />
        </div>

            
        {/* TRACKER */}
        <div className="tracker">
          <h3>Order Tracking</h3>



<div className="tracking-container"
  style={
    {
      "--progress-height": progressPercent
    } as React.CSSProperties
  }
  >
  

  {!isMobile && <div className="tracking-line"></div>}

  {!isMobile && (
  <div
    className="tracking-progress"
    style={{ width: progressPercent }}
  />
  )}

  {steps.map((step, i) => (
    <div className="tracking-step" key={i}>
      <div className={`circle ${i <= currentStep ? "done" : ""}`}>
        {i + 1}
      </div>

      <p className={i <= currentStep ? "active" : ""}>
        {step}
      </p>

      <span>20 Feb</span>
    </div>
  ))}

</div>
        </div>

        {/* ITEMS */}
        <div className="items">
          <h3>Items</h3>

          {items.map(item => (
            <div className="item-card" key={item.id}>
              <img src={item.imageUrl} />

              <div className="item-info">
                <p className="name">{item.name}</p>
                <p className="id">ID: {item.id}</p>
                <p className="meta">
                  Size: {item.size} • Qty: {item.quantity}
                </p>
              </div>

              <div className="item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* SHIPPING */}
        <div className="shipping">
          <h3>Shipping Details</h3>

          <div className="shipping-box">
            <p><strong>Address:</strong> Barmer, Rajasthan</p>
            <p><strong>Courier:</strong> Delhivery</p>
            <p><strong>Tracking ID:</strong> DL123456789</p>
            <p><strong>Estimated Delivery:</strong> 25 Feb 2024</p>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="summary">
          <Box label="Subtotal" value={`$${subtotal}`} />
          <Box label="Delivery" value={`$${DELIVERY}`} />
          <Box label="Discount" value={`$${DISCOUNT}`} />
          <Box label="Total" value={`$${total}`} total />
        </div>

        {/* SUPPORT */}
        <div className="support">
          <h3>Need Help?</h3>
          <button className="support-btn">Contact Support</button>
        </div>

      </div>
    </div>
  );
};

const Meta = ({ label, value, highlight }: any) => (
  <div className={`meta ${highlight ? "highlight" : ""}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const Box = ({ label, value, total }: any) => (
  <div className={`summary-box ${total ? "total" : ""}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

export default OrderTrackingPage;