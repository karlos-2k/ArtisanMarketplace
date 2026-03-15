import React from "react";
import { Link } from "react-router-dom";

const Explore: React.FC = () => {
  return (
    <>
      <h1>Explore Products</h1>
      <p>
        <Link to="/product/101">View Sample Product</Link>
      </p>
    </>
  );
};

export default Explore;
