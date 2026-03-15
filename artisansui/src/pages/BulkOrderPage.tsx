import React, { useState } from "react";
import "./BulkOrderPage.css";

interface Product {
  id: number;
  name: string;
}

const products: Product[] = [
  { id: 1, name: "Handmade Wooden Chair" },
  { id: 2, name: "Artisan Clay Pot" },
  { id: 3, name: "Handwoven Basket" },
  { id: 4, name: "Decorative Lamp" }
];

const BulkOrderPage: React.FC = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [selectedProducts, setSelectedProducts] = useState<
    { id: number; quantity: number }[]
  >([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleQuantityChange = (id: number, qty: number) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === id);

      if (exists) {
        return prev.map(p =>
          p.id === id ? { ...p, quantity: qty } : p
        );
      }

      return [...prev, { id, quantity: qty }];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      customer: form,
      items: selectedProducts
    };

    console.log("Bulk Order:", orderData);

    alert("Bulk order submitted successfully!");
  };

  return (
    <div className="bulk-page">

      <h1 className="bulk-title">Bulk Order Request</h1>

      <form className="bulk-form" onSubmit={handleSubmit}>

        {/* CUSTOMER DETAILS */}

        <div className="form-section">
          <h3>Customer Information</h3>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            required
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Delivery Address"
            required
            onChange={handleChange}
          />
        </div>

        {/* PRODUCT SELECTION */}

        <div className="form-section">
          <h3>Select Products</h3>

          {products.map(product => (

            <div key={product.id} className="product-row">

              <span>{product.name}</span>

              <input
                type="number"
                min="0"
                placeholder="Qty"
                onChange={(e) =>
                  handleQuantityChange(
                    product.id,
                    Number(e.target.value)
                  )
                }
              />

            </div>

          ))}

        </div>

        <button type="submit" className="submit-btn">
          Submit Bulk Order
        </button>

      </form>

    </div>
  );
};

export default BulkOrderPage;