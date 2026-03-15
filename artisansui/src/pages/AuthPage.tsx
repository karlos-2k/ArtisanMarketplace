import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./AuthPage.css";
import {
  login,
  registerBuyer,
  registerArtisan,
  googleLoginWithRole,
} from "../api/authApi";

const AuthPage = () => {
  const { role } = useParams<{ role: "artisan" | "consumer" }>();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!role) {
      navigate("/role");
      return;
    }

    try {
      setError("");
      setLoading(true);

      if (mode === "signup") {
        if (!name.trim()) {
          setError("Name is required");
          return;
        }
        if (password !== confirm) {
          setError("Passwords do not match");
          return;
        }

        role === "artisan"
          ? await registerArtisan(name, email, password)
          : await registerBuyer(name, email, password);

        setMode("login");
        return;
      }

      await login(email, password);
      role === "artisan" ? navigate("/seller/dashboard") : navigate("/");
    } catch {
      setError("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await googleLoginWithRole();
  };

  return (
    <div className="auth-bg">
      <div className="glass-card">
        {/* LEFT */}
        <div className="glass-left">
          <h2>{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
          <p>
            {role === "artisan"
              ? "Sell your handcrafted products worldwide."
              : "Discover authentic handcrafted products."}
          </p>
        </div>

        {/* RIGHT */}
        <div className="glass-right">
          <div className="auth-tabs">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={mode === "signup" ? "active" : ""}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>

          {mode === "signup" && (
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {mode === "signup" && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          )}

          {error && <p className="error">{error}</p>}

          {/* LOGIN / SIGNUP BUTTON */}
          <button
            onClick={handleSubmit}
            className="submit-glass"
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : mode === "login"
              ? "Login"
              : "Create Account"}
          </button>

          {/* DIVIDER */}
          <div className="divider">or</div>

          {/* GOOGLE */}
          <button
            onClick={handleGoogleLogin}
            className="google-glass"
            disabled={loading}
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
