import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./RoleSelect.css";

const RoleSelect = () => {
  const navigate = useNavigate();

  const chooseRole = async (role: "ROLE_SELLER" | "ROLE_CUSTOMER") => {
    try {
      // 🔹 Send role to backend immediately
      await api.post("/auth/set-role", { role });

      // 🔹 Go to auth page (role already stored in backend)
      navigate(role === "ROLE_SELLER" ? "/auth/artisan" : "/auth/consumer");
    } catch (err) {
      console.error("Failed to set role", err);
    }
  };

  return (
    <div className="role-wrapper">
      <h2>Choose how you want to sign in</h2>

      <div className="role-cards">
        <div className="role-card">
          <div className="icon consumer">🛒</div>
          <h3>Consumer Profile</h3>
          <p>Shop, manage orders, and track deliveries.</p>
          <button onClick={() => chooseRole("ROLE_CUSTOMER")}>Continue →</button>
        </div>

        <div className="role-card">
          <div className="icon artisan">🏪</div>
          <h3>Artisan Profile</h3>
          <p>Manage products, inventory, and sales.</p>
          <button onClick={() => chooseRole("ROLE_SELLER")}>Continue →</button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
