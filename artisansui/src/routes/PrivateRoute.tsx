import { Navigate } from "react-router-dom";
import { JSX, useEffect, useState } from "react";
import { checkAuth } from "../api/authApi";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth()
      .then(() => setAllowed(true))
      .catch(() => setAllowed(false));
  }, []);

  if (allowed === null) return <p>Loading...</p>;

  return allowed ? children : <Navigate to="/role" />;
};

export default PrivateRoute;
