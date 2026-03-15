import React from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("token", "demo-token");
    navigate("/seller/dashboard");
  };

  return (
    <>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login as Seller</button>
    </>
  );
};

export default Login;
