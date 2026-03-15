import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../api/authApi";

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const [status, setStatus] = useState<"loading" | "authenticated" | "guest">(
    "loading"
  );
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth()
      .then((res) => {
        setUser(res.data);
        setStatus("authenticated");
      })
      .catch(() => setStatus("guest"));
  }, []);

  if (status === "loading") {
    return <p style={{ padding: 20 }}>Checking session…</p>;
  }

  if (status === "authenticated") {
    const isSeller = user?.roles?.some((r: any) => r.name === "ROLE_SELLER");

    return <Navigate to={isSeller ? "/seller/dashboard" : "/"} replace />;
  }

  return children;
};

export default AuthGuard;
