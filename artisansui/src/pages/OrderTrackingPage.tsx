import React, { useState, useEffect } from "react";
import "./OrderTrackingPage.css";

interface ArtisanItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  imageUrl: string;
  rating: number;
}

const OrderTrackingPage: React.FC = () => {
  const [items, setItems] = useState<ArtisanItem[]>([
    {
      id: "4553458120",
      name: "Top for Women",
      size: "L",
      quantity: 2,
      price: 50,
      imageUrl: "https://placedog.net/400/400",
      rating: 0
    },
    {
      id: "8953458747",
      name: "Blue T-shirt for Men",
      size: "M",
      quantity: 2,
      price: 50,
      imageUrl: "https://placedog.net/401/401",
      rating: 0
    }
  ]);

  const [toast, setToast] = useState(false);
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  const DELIVERY = 20;
  const DISCOUNT = 0;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + DELIVERY - DISCOUNT;

  const updateQty = (id: string, delta: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
    setToast(true);
  };

  const setRating = (id: string, rate: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, rating: rate } : item
      )
    );
    setToast(true);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="order-page">

      {toast && <div className="toast">✓ Updated</div>}

      {zoomImg && (
        <div className="modal" onClick={() => setZoomImg(null)}>
          <img src={zoomImg} alt="zoom" />
        </div>
      )}

      <div className="order-container">

        <div className="page-header">
          <h1>Order Tracking</h1>
          <p>
            Track your order progress and review purchased items.
          </p>
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
          <Meta label="Placed" value="Feb 20, 2024" />
          <Meta label="Delivered" value="Feb 20, 2024" />
          <Meta label="Items" value="2 items" />
          <Meta label="Status" value="Delivered" highlight />

        </div>

        {/* ORDER TRACKER */}

<div className="tracker">

  <h3>Order Tracking</h3>

  <div className="tracking-container">

  <div className="tracking-line"></div>
  <div className="tracking-progress"></div>

  {[
    "Order Placed",
    "Packed",
    "In Transit",
    "Out for Delivery",
    "Delivered"
  ].map((step, i) => (

    <div className="tracking-step" key={i}>

      <div className={`circle ${i < 3 ? "done" : ""}`}>
        {i + 1}
      </div>

      <p className={i < 3 ? "active" : ""}>{step}</p>

      <span>20 Feb</span>

    </div>

  ))}

</div>

</div>

        {/* ORDER ITEMS */}

        <div className="order-table">

          <h3>Items</h3>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>

              {items.map(item => (

                <tr key={item.id}>

                  <td className="product-cell">

                    <img
                      src={item.imageUrl}
                      onClick={() => setZoomImg(item.imageUrl)}
                    />

                    <div>
                      <p className="product-name">
                        {item.name}
                      </p>

                      <p className="product-id">
                        ID: {item.id}
                      </p>

                      <div className="rating">
                        {[1,2,3,4,5].map(star => (
                          <span
                            key={star}
                            onClick={() => setRating(item.id, star)}
                            className={
                              star <= item.rating
                                ? "star active"
                                : "star"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>

                    </div>

                  </td>

                  <td>
                    <span className="size">
                      {item.size}
                    </span>
                  </td>

                  <td>

                    <div className="qty">

                      <button
                        onClick={() => updateQty(item.id, -1)}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => updateQty(item.id, 1)}
                      >
                        +
                      </button>

                    </div>

                  </td>

                  <td className="price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* SUMMARY */}

        <div className="summary">

          <Box label="Discount" value={`$${DISCOUNT}`} />
          <Box label="Subtotal" value={`$${subtotal}`} />
          <Box label="Delivery" value={`$${DELIVERY}`} />
          <Box label="Total" value={`$${total}`} total />

        </div>

      </div>

    </div>
  );
};

const Meta = ({label,value,highlight}:any)=>(
<div className={`meta ${highlight?"highlight":""}`}>
<span>{label}</span>
<strong>{value}</strong>
</div>
)

const Box = ({label,value,total}:any)=>(
<div className={`summary-box ${total?"total":""}`}>
<span>{label}</span>
<strong>{value}</strong>
</div>
)

export default OrderTrackingPage;