import React, { useState, useMemo, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./AdminPanel.css";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OrderItem {
  id: string;
  artisan: string;
  name: string;
  size: string;
  price: number;
  status: "Paid" | "Shipped" | "Pending";
  img: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  image: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>;
};

const AdminPanel: React.FC = () => {

  /* ✅ FIXED: only ONE activeTab */
  const [activeTab, setActiveTab] = useState("Dashboard");

  const [sortBy, setSortBy] = useState("latest");
  const [filterStatus, setFilterStatus] = useState("All");
  const [salesFilter, setSalesFilter] = useState("weekly");

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* 🔥 PRODUCTS STATES */
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Handmade Vase",
      category: "Decor",
      price: "1200",
      stock: "10",
      image: "https://via.placeholder.com/150",
    },
  ]);

  const [searchProduct, setSearchProduct] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [form, setForm] = useState<Product>({
    id: "",
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });

  const handleProductSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const price = Number(form.price);
  const stock = Number(form.stock);

  if (price < 0 || stock < 0) {
    alert("Price and Stock cannot be negative");
    return;
  }

  if (!form.name || !form.category) {
    alert("Please fill all required fields");
    return;
  }

  const formattedProduct: Product = {
    ...form,
    price: form.price,
    stock: form.stock,
  };

  if (editProduct) {
    setProducts(prev =>
      prev.map(p => (p.id === editProduct.id ? formattedProduct : p))
    );
  } else {
    setProducts(prev => [
      ...prev,
      { ...formattedProduct, id: Date.now().toString() },
    ]);
  }

  setShowModal(false);
  setEditProduct(null);
  setForm({
    id: "",
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });
};

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) &&
    (filterCategory === "All" || p.category === filterCategory)
  );

  /* ================= ORDERS ================= */

  const [view, setView] = useState<"artisan" | "orders">("artisan");
  const [selectedArtisan, setSelectedArtisan] = useState<string | null>(null);

  const invoiceRef = useRef<HTMLDivElement>(null);

  const [items] = useState<OrderItem[]>([
    {
      id: "ORD-001",
      artisan: "Ramesh Crafts",
      name: "Premium Cotton Top",
      size: "L",
      price: 120,
      status: "Paid",
      img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100",
    },
    {
      id: "ORD-002",
      artisan: "Ramesh Crafts",
      name: "Handmade Shirt",
      size: "M",
      price: 95,
      status: "Shipped",
      img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100",
    },
    {
      id: "ORD-003",
      artisan: "Suresh Textiles",
      name: "Handwoven Kurta",
      size: "XL",
      price: 150,
      status: "Pending",
      img: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=100",
    },
  ]);

  const totalRevenue = items.reduce((acc, i) => acc + i.price, 0);
  const totalArtisans = Array.from(new Set(items.map(i => i.artisan))).length;
  const totalOrders = items.length;
  const pendingOrders = items.filter(i => i.status === "Pending").length;

  const salesDataMap = {
    weekly: [
      { name: "Mon", revenue: 120, orders: 110 },
      { name: "Tue", revenue: 140, orders: 115 },
      { name: "Wed", revenue: 130, orders: 120 },
      { name: "Thu", revenue: 160, orders: 125 },
      { name: "Fri", revenue: 170, orders: 130 },
      { name: "Sat", revenue: 150, orders: 140 },
      { name: "Sun", revenue: 180, orders: 145 },
    ],
    monthly: [
      { name: "Jan", revenue: 120, orders: 110 },
      { name: "Feb", revenue: 160, orders: 120 },
      { name: "Mar", revenue: 170, orders: 115 },
      { name: "Apr", revenue: 180, orders: 130 },
      { name: "May", revenue: 165, orders: 140 },
    ],
    yearly: [
      { name: "2021", revenue: 1200, orders: 900 },
      { name: "2022", revenue: 1500, orders: 1100 },
      { name: "2023", revenue: 1800, orders: 1300 },
      { name: "2024", revenue: 2200, orders: 1600 },
      { name: "2025", revenue: 2500, orders: 1900 },
    ],
  };

  const chartData = salesDataMap[salesFilter as keyof typeof salesDataMap];

  const artisans = Array.from(new Set(items.map(i => i.artisan)));

  const processedOrders = useMemo(() => {
    let data = [...items];

    if (selectedArtisan) {
      data = data.filter(i => i.artisan === selectedArtisan);
    }

    if (filterStatus !== "All") {
      data = data.filter(i => i.status === filterStatus);
    }

    return data;
  }, [items, filterStatus, selectedArtisan]);

  const downloadPDF = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save("invoice.pdf");
  };

  return (
    <div className="admin-window">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo-area">
          <div className="logo-square">A</div>
          <span>Artisan</span>
        </div>

        <nav className="nav-stack">
          {["Dashboard", "Orders", "Products", "Settings"].map(tab => (
            <div
              key={tab}
              className={`nav-item ${activeTab === tab ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setSidebarOpen(false); 
}}
            >
              {tab}
            </div>
          ))}
        </nav>
      </aside>

      <button
        className="menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* MAIN */}
      <main className="main-container">

        {/* DASHBOARD */}
        {activeTab === "Dashboard" && (
  <div className="dashboard-container">

    <h2>Dashboard</h2>

    <div className="dashboard-cards">

      <div className="dashboard-card">
        <span>Total Revenue</span>
        <h2>${totalRevenue}</h2>
      </div>

      <div className="dashboard-card">
        <span>Total Artisans</span>
        <h2>{totalArtisans}</h2>
      </div>

      <div className="dashboard-card">
        <span>Total Orders</span>
        <h2>{totalOrders}</h2>
      </div>

      <div className="dashboard-card pending-card">
        <span>Pending Orders</span>
        <h2>{pendingOrders}</h2>
      </div>

    </div>

    {/* 🔥 GRAPH SAME AS YOUR OLD UI */}
    <div className="dashboard-graph">

      <div className="graph-header">
        <h3>Sales Overview</h3>

        <select
          className="graph-filter"
          onChange={(e) => setSalesFilter(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart key={salesFilter} data={chartData}>

          <XAxis
            dataKey="name"
            stroke="#000"
            tick={{ fill: "#000", fontSize: 12 }}
          />

          <Tooltip
            cursor={{ stroke: "#475569", strokeWidth: 1 }}
            wrapperStyle={{ pointerEvents: "none" }}
            isAnimationActive={false}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="custom-tooltip">
                    <p>Revenue: ${payload[0].value}</p>
                    <p>Orders: {payload[1].value}</p>
                  </div>
                );
              }
              return null;
            }}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#f97316"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#2563eb"
            strokeWidth={3}
            dot={false}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>

  </div>
)}

        {activeTab === "Products" && (
  <div className="products-page">

    {/* HEADER */}
    <div className="products-header">
      <h2>Products</h2>

      <div className="controls">
        <input
          className="search-input"
          placeholder="Search products..."
          onChange={(e) => setSearchProduct(e.target.value)}
        />

        <select
          className="filter-select"
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option>All</option>
          <option>Decor</option>
          <option>Furniture</option>
        </select>

        <button
          className="add-btn"
          onClick={() => {
            setEditProduct(null); 
            setForm({
              id: "",
              name: "",
              category: "",
              price: "",
              stock: "",
              image: "",
            }); 
            setShowModal(true);
          }}
        >
          + Add Product
        </button>
      </div>
    </div>

    {/* GRID */}
    <div className="product-grid">
      {filteredProducts.map((p) => (
        <div className="product-card" key={p.id}>
          
          <div className="image-wrapper">
            <img
              src={p.image || "https://images.unsplash.com/photo-1616627982181-6f9d8b4a9c9c?w=400"}
              alt={p.name}
            />
          </div>

          <div className="product-content">
            <h3>{p.name}</h3>
            <p className="category">{p.category}</p>

            <div className="price-stock">
              <span className="price">
                ₹{Number(p.price).toLocaleString("en-IN")}
              </span>
              <span className="stock">Stock: {p.stock}</span>
            </div>

            <div className="card-actions">
              <button
                className="edit-btn"
                onClick={() => {
                  setEditProduct(p);
                  setForm(p);
                  setShowModal(true);
                }}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  setProducts(products.filter((x) => x.id !== p.id))
                }
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* MODAL */}
    {showModal && (
  <div className="modal-overlay">
    <div className="modal-container">

      {/* HEADER */}
      <div className="modal-header">
        <h2>{editProduct ? "Edit Product" : "Add Product"}</h2>
        <span className="close-btn" onClick={() => setShowModal(false)}>×</span>
      </div>

      {/* FORM */}
      <form className="modal-form" onSubmit={handleProductSubmit}>

        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            placeholder="Enter product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            placeholder="e.g. Decor, Clothing"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
        </div>

        <div className="form-row">

        <div className="form-group">
          <label>Price (₹)</label>
          <input
            type="number"
            min="0" 
            max="1000000000"  
            placeholder="Enter price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Stock</label>
          <input
            type="number"
            min="0"   
            max="1000000000" 
            placeholder="Available stock"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: e.target.value })
            }
          />
        </div>

</div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            placeholder="Paste product image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
        </div>

        {/* ACTIONS */}
        <div className="modal-actions">
          <button type="submit" className="save-btn">
            {editProduct ? "Update Product" : "Add Product"}
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  </div>
)}
  </div>
)}

        {/* ORDERS */}
        {activeTab === "Orders" && view === "artisan" && (
          <div className="orders-container">
            <h2>Artisans</h2>
            <div className="orders-list">
              {artisans.map(artisan => {
                const artisanOrders = items.filter(i => i.artisan === artisan);
                const total = artisanOrders.reduce((a,b)=>a+b.price,0);

                return (
                  <div key={artisan} className="order-card"
                    onClick={()=>{setSelectedArtisan(artisan);setView("orders");}}>
                    <img src={artisanOrders[0].img}/>
                    <div className="order-info">
                      <h4>{artisan}</h4>
                      <span>{artisanOrders.length} Orders</span>
                    </div>
                    <div className="order-price">${total}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "Orders" && view === "orders" && (
          <>
            <button className="back-btn" onClick={()=>setView("artisan")}>← Back</button>
            <h2>{selectedArtisan}</h2>

            <div className="orders-container" ref={invoiceRef}>
              <div className="orders-list">
                {processedOrders.map(item => (
                  <div className="order-card" key={item.id}>
                    <img src={item.img}/>
                    <div className="order-info">
                      <h4>{item.name}</h4>
                      <span>{item.size}</span>
                    </div>
                    <div className="order-price">${item.price}</div>
                    <StatusBadge status={item.status}/>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* SETTINGS */}
{activeTab === "Settings" && (
  <div className="settings-page">

    <div className="settings-header">
      <h2>Settings</h2>
      <p>Manage your account and preferences</p>
    </div>

    <div className="settings-grid">

      {/* PROFILE */}
      <div className="settings-card profile-card">

        <div className="profile-top">
          <div className="avatar">A</div>
          <div>
            <h3>Admin Profile</h3>
            <span>Update your personal details</span>
          </div>
        </div>

        <div className="form-group">
          <label>Full Name</label>
          <input type="text" placeholder="Admin Name" />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="admin@email.com" />
        </div>

        <button className="primary-btn">Save Changes</button>
      </div>

      {/* SECURITY */}
      <div className="settings-card">

        <h3>Security</h3>

        <div className="form-group">
          <label>Current Password</label>
          <input type="password" />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input type="password" />
        </div>

        <button className="primary-btn">Update Password</button>
      </div>

      {/* PREFERENCES */}
      <div className="settings-card">

        <h3>Preferences</h3>

        <div className="toggle-row">
          <span>Email Notifications</span>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-row">
          <span>Auto Order Updates</span>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>

      </div>

    </div>
  </div>
)}

      </main>
    </div>
  );
};

export default AdminPanel;