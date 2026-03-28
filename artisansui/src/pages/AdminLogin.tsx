import React, { useState } from "react";
import "./AdminLogin.css";

const AdminLogin: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Admin Login:", form);

    // 👉 connect your backend here
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        
        {/* Logo / Title */}
        <div className="admin-login-header">
          <h2>Admin Panel</h2>
          <p>Sign in to manage your platform</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="admin-login-btn">
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="admin-login-footer">
          <span>Admin access only</span>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;