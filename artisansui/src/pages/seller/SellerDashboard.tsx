import { useEffect, useState } from "react";
import { getSellerProducts } from "../../api/sellerProductApi";

const SellerDashboard = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    getSellerProducts().then((data) => setCount(data.length));
  }, []);

  return (
    <>
      <h1 className="seller-page-title">Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Products</span>
          <strong>{count}</strong>
        </div>

        <div className="stat-card">
          <span>Orders</span>
          <strong>0</strong>
        </div>

        <div className="stat-card">
          <span>Earnings</span>
          <strong>₹0</strong>
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;
