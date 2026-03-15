import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../api/authApi";

const SellerRoute = ({ children }: { children: JSX.Element }) => {
  const [status, setStatus] = useState<"loading" | "allowed" | "forbidden">(
    "loading"
  );

  useEffect(() => {
    checkAuth()
      .then((res) => {
        const user = res.data;
        const isSeller = user?.roles?.some(
          (r: any) => r.name === "ROLE_SELLER"
        );

        setStatus(isSeller ? "allowed" : "forbidden");
      })
      .catch(() => setStatus("forbidden"));
  }, []);

  if (status === "loading") {
    return <p style={{ padding: 20 }}>Checking seller access…</p>;
  }

  if (status === "forbidden") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default SellerRoute;
