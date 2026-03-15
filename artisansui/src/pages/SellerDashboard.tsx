import { logout } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/role");
  };

  return (
    <div>
      <h1>Seller Dashboard</h1>
      <p>Manage your products here</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default SellerDashboard;
