// AdminPanel.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./AdminPanel.css";

// ─── Types ──────────────────────────────────────────────────────
type NavPage = "dashboard" | "sellers" | "products" | "orders" | "analytics" | "settings";
type TimeFilter = "weekly" | "monthly" | "yearly";

interface Seller {
  id: number; name: string; shop: string; email: string;
  category: string; products: number; revenue: number;
  status: "Active" | "Pending" | "Suspended"; joined: string;
  phone: string; address: string;
}
interface Product {
  id: number; name: string; seller: string; category: string;
  price: number; stock: number; status: "Active" | "Inactive";
  description: string;
}
interface Order {
  id: string; customer: string; seller: string; amount: number;
  date: string; status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: number; address: string; phone: string;
}

// ─── Data ────────────────────────────────────────────────────────
const SELLERS: Seller[] = [
  { id: 1, name: "Raj Kumar",    shop: "Raj Pottery",    email: "raj@artisans.in",   category: "Pottery",  products: 18, revenue: 48200, status: "Active",    joined: "2023-01-15", phone: "+91 98765 43210", address: "Jaipur, Rajasthan" },
  { id: 2, name: "Priya Singh",  shop: "Priya Textiles", email: "priya@artisans.in", category: "Textiles", products: 12, revenue: 31500, status: "Active",    joined: "2023-03-22", phone: "+91 87654 32109", address: "Varanasi, UP" },
  { id: 3, name: "Mohan Lal",    shop: "Mohan Crafts",   email: "mohan@artisans.in", category: "Jewelry",  products: 9,  revenue: 22800, status: "Pending",   joined: "2024-01-08", phone: "+91 76543 21098", address: "Jodhpur, Rajasthan" },
  { id: 4, name: "Anita Sharma", shop: "Anita Weaves",   email: "anita@artisans.in", category: "Textiles", products: 6,  revenue: 14100, status: "Active",    joined: "2024-02-14", phone: "+91 65432 10987", address: "Amritsar, Punjab" },
  { id: 5, name: "Vijay Nair",   shop: "Vijay Woods",    email: "vijay@artisans.in", category: "Woodwork", products: 4,  revenue: 8900,  status: "Suspended", joined: "2023-11-05", phone: "+91 54321 09876", address: "Mysuru, Karnataka" },
];
const PRODUCTS: Product[] = [
  { id: 1, name: "Handmade Ceramic Vase",    seller: "Raj Pottery",    category: "Pottery",  price: 2500, stock: 15, status: "Active",   description: "Hand-thrown ceramic vase with traditional blue glaze." },
  { id: 2, name: "Woven Wall Hanging",       seller: "Priya Textiles", category: "Textiles", price: 1800, stock: 8,  status: "Active",   description: "Intricately woven wall hanging using natural dyes." },
  { id: 3, name: "Brass Jewelry Set",        seller: "Mohan Crafts",   category: "Jewelry",  price: 3200, stock: 12, status: "Active",   description: "Traditional Rajasthani brass jewelry set." },
  { id: 4, name: "Silk Dupatta",             seller: "Anita Weaves",   category: "Textiles", price: 1200, stock: 3,  status: "Active",   description: "Pure silk dupatta with hand-embroidered borders." },
  { id: 5, name: "Carved Wooden Elephant",   seller: "Vijay Woods",    category: "Woodwork", price: 4500, stock: 0,  status: "Inactive", description: "Hand-carved rosewood elephant statue." },
  { id: 6, name: "Blue Pottery Bowl",        seller: "Raj Pottery",    category: "Pottery",  price: 950,  stock: 22, status: "Active",   description: "Classic Jaipur blue pottery decorative bowl." },
];
const ORDERS: Order[] = [
  { id: "#A001", customer: "John Doe",    seller: "Raj Pottery",    amount: 2500, date: "2024-06-15", status: "Delivered",  items: 1, address: "Mumbai, Maharashtra", phone: "+91 99000 11111" },
  { id: "#A002", customer: "Sarah Smith", seller: "Priya Textiles", amount: 3600, date: "2024-06-14", status: "Processing", items: 2, address: "Delhi, NCR",          phone: "+91 99000 22222" },
  { id: "#A003", customer: "Mike Johnson",seller: "Mohan Crafts",   amount: 3200, date: "2024-06-13", status: "Pending",    items: 1, address: "Bangalore, KA",       phone: "+91 99000 33333" },
  { id: "#A004", customer: "Emma Wilson", seller: "Anita Weaves",   amount: 5700, date: "2024-06-12", status: "Shipped",    items: 3, address: "Chennai, TN",         phone: "+91 99000 44444" },
  { id: "#A005", customer: "Arjun Mehta", seller: "Raj Pottery",    amount: 1900, date: "2024-06-11", status: "Cancelled",  items: 1, address: "Pune, Maharashtra",    phone: "+91 99000 55555" },
];

// ─── Chart Data by period ────────────────────────────────────────
const chartData = {
  revenue: {
    weekly:  { values: [8200, 11400, 9700, 13200, 10800, 15600, 12900], labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] },
    monthly: { values: [28000,31500,27000,42000,38000,51000,46000,58000,53000,62000,55000,71000], labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] },
    yearly:  { values: [182000,234000,310000,286000,420000], labels: ["2020","2021","2022","2023","2024"] },
  },
  orders: {
    weekly:  { values: [14,20,17,25,19,31,23], labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] },
    monthly: { values: [48,54,42,70,63,88,75,96,85,102,91,118], labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] },
    yearly:  { values: [540,720,890,980,1200], labels: ["2020","2021","2022","2023","2024"] },
  },
  sellers: {
    weekly:  { values: [0,1,0,2,1,0,1], labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] },
    monthly: { values: [2,3,1,4,2,5,3,4,6,5,7,8], labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] },
    yearly:  { values: [8,14,20,28,34], labels: ["2020","2021","2022","2023","2024"] },
  },
};

// ─── SVG Icons ────────────────────────────────────────────────────
const Ic = {
  Grid:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Store:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Box:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  Cart:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  Chart:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  Settings:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Logout:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Search:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Menu:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Plus:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Edit:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  Eye:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Check:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Rupee:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="18" y2="3"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="13" x2="12" y2="21"/><line x1="6" y1="13" x2="18" y2="13"/></svg>,
  TrendUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Shield:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Globe:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Mail:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Lock:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Activity:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Download:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Bell:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Back:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Phone:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  MapPin:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Warning: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

// ─── Helpers ──────────────────────────────────────────────────────
const fmtRupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const initials = (name: string) => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Active: "ap-badge-success", Pending: "ap-badge-warning",
    Suspended: "ap-badge-danger", Inactive: "ap-badge-danger",
    Processing: "ap-badge-info", Shipped: "ap-badge-purple",
    Delivered: "ap-badge-success", Cancelled: "ap-badge-danger",
  };
  return map[status] || "ap-badge-neutral";
};

// ─── Interactive Line Chart ───────────────────────────────────────
interface TooltipData { x: number; y: number; label: string; value: string; visible: boolean; }

const LineChart: React.FC<{
  data: number[]; labels: string[]; color: string; fill?: string; h?: number;
  valuePrefix?: string; valueSuffix?: string;
}> = ({ data, labels, color, fill, h = 130, valuePrefix = "", valueSuffix = "" }) => {
  const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, label: "", value: "", visible: false });
  const svgRef = useRef<SVGSVGElement>(null);
  const w = 400; const padX = 14; const padY = 12;
  const min = Math.min(...data); const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * (w - padX * 2);
    const y = padY + ((max - v) / range) * (h - padY * 2);
    return { x, y, v };
  });
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const area = `${padX},${h - padY} ${polyline} ${w - padX},${h - padY}`;

  const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * w;
    let closest = 0;
    let minDist = Infinity;
    pts.forEach((p, i) => { const d = Math.abs(p.x - mx); if (d < minDist) { minDist = d; closest = i; } });
    const p = pts[closest];
    const px = (p.x / w) * rect.width + rect.left;
    const py = (p.y / h) * rect.height + rect.top;
    setTooltip({ x: px - rect.left, y: py - rect.top, label: labels[closest], value: `${valuePrefix}${data[closest].toLocaleString("en-IN")}${valueSuffix}`, visible: true });
  };

  return (
    <div className="ap-chart-wrap" style={{ position: "relative" }}>
      {tooltip.visible && (
        <div className="ap-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          <div className="ap-tooltip-label">{tooltip.label}</div>
          <div className="ap-tooltip-val">{tooltip.value}</div>
        </div>
      )}
      <svg ref={svgRef} className="ap-svg-chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"
        style={{ height: h, cursor: "crosshair" }}
        onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}>
        {fill && <polygon points={area} fill={fill} opacity="0.14" />}
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={tooltip.visible && tooltip.label === labels[i] ? 5 : 3.5}
            fill={color} stroke="#fff" strokeWidth="1.8"
            style={{ transition: "r 0.12s ease" }} />
        ))}
        {tooltip.visible && (() => {
          const idx = labels.findIndex(l => l === tooltip.label);
          if (idx < 0) return null;
          const p = pts[idx];
          return <line x1={p.x} y1={padY} x2={p.x} y2={h - padY} stroke={color} strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />;
        })()}
      </svg>
    </div>
  );
};

// ─── Interactive Bar Chart ────────────────────────────────────────
const BarChart: React.FC<{
  data: number[]; labels: string[]; color?: string; color2?: string; data2?: number[];
  valuePrefix?: string; label1?: string; label2?: string;
}> = ({ data, labels, color = "#b5541c", color2, data2, valuePrefix = "", label1 = "Value", label2 = "Value 2" }) => {
  const [tooltip, setTooltip] = useState<(TooltipData & { value2?: string }) | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const max = Math.max(...data, ...(data2 || [])) * 1.15;
  const h = 140; const padTop = 10; const padBot = 28;
  const innerH = h - padTop - padBot;
  const gap = 6; const n = data.length;
  const totalW = 400;
  const groupW = (totalW - gap * (n + 1)) / n;
  const barW = data2 ? (groupW - gap) / 2 : groupW * 0.65;

  const handleMouseMove = (e: React.MouseEvent<SVGElement>, idx: number, isSecond = false) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      label: labels[idx],
      value: `${label1}: ${valuePrefix}${data[idx].toLocaleString("en-IN")}`,
      value2: data2 ? `${label2}: ${valuePrefix}${data2[idx].toLocaleString("en-IN")}` : undefined,
      visible: true,
    });
  };

  return (
    <div className="ap-chart-wrap" style={{ position: "relative" }}>
      {tooltip?.visible && (
        <div className="ap-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          <div className="ap-tooltip-label">{tooltip.label}</div>
          <div className="ap-tooltip-val">{tooltip.value}</div>
          {tooltip.value2 && <div className="ap-tooltip-val" style={{ color: color2 || "#f0a070", marginTop: 2 }}>{tooltip.value2}</div>}
        </div>
      )}
      <svg ref={svgRef} className="ap-svg-chart" viewBox={`0 0 ${totalW} ${h}`} preserveAspectRatio="none"
        style={{ height: h }}
        onMouseLeave={() => setTooltip(null)}>
        {data.map((v, i) => {
          const bh = (v / max) * innerH;
          const groupX = gap + i * (groupW + gap);
          const x = data2 ? groupX : groupX + (groupW - barW) / 2;
          const y = padTop + innerH - bh;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={bh} fill={color} rx="3" opacity="0.9"
                style={{ cursor: "pointer", transition: "opacity 0.15s" }}
                onMouseMove={e => handleMouseMove(e, i, false)}
                onMouseEnter={e => (e.currentTarget as SVGRectElement).style.opacity = "1"}
                onMouseLeave={e => (e.currentTarget as SVGRectElement).style.opacity = "0.9"} />
              {data2 && (
                <rect x={x + barW + 3} y={padTop + innerH - (data2[i] / max) * innerH}
                  width={barW} height={(data2[i] / max) * innerH} fill={color2 || "#f0a070"} rx="3" opacity="0.85"
                  style={{ cursor: "pointer", transition: "opacity 0.15s" }}
                  onMouseMove={e => handleMouseMove(e, i, true)}
                  onMouseEnter={e => (e.currentTarget as SVGRectElement).style.opacity = "1"}
                  onMouseLeave={e => (e.currentTarget as SVGRectElement).style.opacity = "0.85"} />
              )}
              <text x={groupX + groupW / 2} y={h - 8} textAnchor="middle" fontSize="9" fill="#a89a8e">{labels[i]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ─── Donut Chart ──────────────────────────────────────────────────
const DonutChart: React.FC<{ segments: { value: number; color: string; label: string }[] }> = ({ segments }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = 42; const cx = 56; const cy = 56; const stroke = 14;
  let offset = 0;
  const circ = 2 * Math.PI * r;
  return (
    <div className="ap-donut-wrap">
      <svg width="112" height="112" style={{ flexShrink: 0 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0ebe6" strokeWidth={stroke} />
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * circ;
          const gap = circ - dash;
          const isH = hovered === i;
          const el = (
            <circle
            key={i}
            cx={cx}
            cy={cy}
            r={isH ? r + 2 : r}
            fill="none"
            stroke={seg.color}
            strokeWidth={isH ? stroke + 2 : stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
              transition: "all 0.2s",
              cursor: "pointer",
              pointerEvents: "auto"   // ✅ ADD THIS
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
          );
          offset += dash;
          return el;
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#2c2420">
          {hovered !== null ? segments[hovered].value : total}
        </text>
        <text x={cx} y={cy + 11} textAnchor="middle" fontSize="9" fill="#a89a8e">
          {hovered !== null ? segments[hovered].label : "Total"}
        </text>
      </svg>
      <div className="ap-donut-legend">
        {segments.map((seg, i) => (
          <div className="ap-donut-legend-row" key={seg.label}
            style={{ cursor: "pointer", opacity: hovered !== null && hovered !== i ? 0.45 : 1, transition: "opacity 0.15s" }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <span className="ap-donut-legend-label">
              <span className="ap-legend-dot" style={{ background: seg.color }} />
              {seg.label}
            </span>
            <span className="ap-donut-legend-val">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Time Filter Component ─────────────────────────────────────────
const TimeFilterTabs: React.FC<{ value: TimeFilter; onChange: (v: TimeFilter) => void }> = ({ value, onChange }) => (
  <div className="ap-time-filters">
    {(["weekly", "monthly", "yearly"] as TimeFilter[]).map(t => (
      <button key={t} className={`ap-time-tab ${value === t ? "active" : ""}`} onClick={() => onChange(t)}>
        {t.charAt(0).toUpperCase() + t.slice(1)}
      </button>
    ))}
  </div>
);

// ─── Toast ────────────────────────────────────────────────────────
const Toast: React.FC<{ msg: string; onDone: () => void }> = ({ msg, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="ap-toast">
      <Ic.Check /> {msg}
    </div>
  );
};

// ─── Logout Modal ─────────────────────────────────────────────────
const LogoutModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <div className="ap-overlay" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
    <div className="ap-modal ap-modal-sm">
      <div className="ap-logout-modal-body">
        <div className="ap-logout-modal-icon">
          <Ic.Warning />
        </div>
        <div className="ap-logout-modal-title">Sign Out?</div>
        <div className="ap-logout-modal-sub">
          You'll be logged out of the admin panel. Any unsaved changes will be lost.
        </div>
      </div>
      <div className="ap-logout-modal-footer">
        <button className="ap-btn-outline" onClick={onCancel}>Cancel</button>
        <button className="ap-btn-danger" onClick={onConfirm}><Ic.Logout /> Sign Out</button>
      </div>
    </div>
  </div>
);

// ─── Seller Detail Page ───────────────────────────────────────────
const SellerDetailPage: React.FC<{ seller: Seller; onBack: () => void; toast: (m: string) => void }> = ({ seller, onBack, toast }) => {
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: seller.name, shop: seller.shop, email: seller.email, phone: seller.phone, address: seller.address });

  return (
    <>
      <div className="ap-detail-header">
        <button className="ap-detail-back" onClick={onBack}><Ic.Back /> Back to Sellers</button>
      </div>
      <div className="ap-detail-grid">
        <div>
          <div className="ap-profile-card">
            <div className="ap-profile-avatar">{initials(seller.name)}</div>
            <div className="ap-profile-name">{seller.name}</div>
            <div className="ap-profile-role">{seller.shop}</div>
            <span className={`ap-badge ${statusBadge(seller.status)}`} style={{ marginTop: 4 }}>{seller.status}</span>
            <div className="ap-profile-stats">
              <div className="ap-profile-stat">
                <div className="ap-profile-stat-val">{seller.products}</div>
                <div className="ap-profile-stat-label">Products</div>
              </div>
              <div className="ap-profile-stat">
                <div className="ap-profile-stat-val" style={{ fontSize: 15 }}>{fmtRupee(seller.revenue)}</div>
                <div className="ap-profile-stat-label">Revenue</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, width: "100%", marginTop: 8 }}>
              <button className="ap-btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setEditModal(true)}><Ic.Edit /> Edit</button>
            </div>
          </div>
        </div>
        <div>
          <div className="ap-info-card">
            <div className="ap-info-card-title">Seller Information</div>
            <div className="ap-info-row"><span className="ap-info-key">Email</span><span className="ap-info-val">{seller.email}</span></div>
            <div className="ap-info-row"><span className="ap-info-key">Phone</span><span className="ap-info-val">{seller.phone}</span></div>
            <div className="ap-info-row"><span className="ap-info-key">Address</span><span className="ap-info-val">{seller.address}</span></div>
            <div className="ap-info-row"><span className="ap-info-key">Category</span><span className="ap-info-val"><span className="ap-badge ap-badge-neutral">{seller.category}</span></span></div>
            <div className="ap-info-row"><span className="ap-info-key">Joined</span><span className="ap-info-val">{seller.joined}</span></div>
            <div className="ap-info-row"><span className="ap-info-key">Status</span><span className="ap-info-val"><span className={`ap-badge ${statusBadge(seller.status)}`}>{seller.status}</span></span></div>
          </div>
          <div className="ap-info-card">
            <div className="ap-info-card-title">Products Listed</div>
            {PRODUCTS.filter(p => p.seller === seller.shop).map(p => (
              <div className="ap-info-row" key={p.id}>
                <span className="ap-info-key">{p.name}</span>
                <span className="ap-info-val" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {fmtRupee(p.price)}
                  <span className={`ap-badge ${p.stock === 0 ? "ap-badge-danger" : "ap-badge-success"}`} style={{ fontSize: 11 }}>
                    {p.stock === 0 ? "Out" : `${p.stock}`}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editModal && (
        <div className="ap-overlay" onClick={e => { if (e.target === e.currentTarget) setEditModal(false); }}>
          <div className="ap-modal">
            <div className="ap-modal-header">
              <div className="ap-modal-title">Edit Seller</div>
              <button className="ap-modal-close" onClick={() => setEditModal(false)}><Ic.X /></button>
            </div>
            <div className="ap-form-row">
              <div className="ap-form-group"><label className="ap-form-label">Full Name</label>
                <input className="ap-form-input" value={editData.name} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} /></div>
              <div className="ap-form-group"><label className="ap-form-label">Shop Name</label>
                <input className="ap-form-input" value={editData.shop} onChange={e => setEditData(d => ({ ...d, shop: e.target.value }))} /></div>
            </div>
            <div className="ap-form-group"><label className="ap-form-label">Email</label>
              <input className="ap-form-input" type="email" value={editData.email} onChange={e => setEditData(d => ({ ...d, email: e.target.value }))} /></div>
            <div className="ap-form-row">
              <div className="ap-form-group"><label className="ap-form-label">Phone</label>
                <input className="ap-form-input" value={editData.phone} onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))} /></div>
              <div className="ap-form-group"><label className="ap-form-label">Address</label>
                <input className="ap-form-input" value={editData.address} onChange={e => setEditData(d => ({ ...d, address: e.target.value }))} /></div>
            </div>
            <div className="ap-modal-footer">
              <button className="ap-btn-outline" onClick={() => setEditModal(false)}>Cancel</button>
              <button className="ap-btn-primary" onClick={() => { setEditModal(false); toast("Seller updated successfully"); }}><Ic.Check /> Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Product Detail Page ──────────────────────────────────────────
const ProductDetailPage: React.FC<{ product: Product; onBack: () => void; toast: (m: string) => void }> = ({ product, onBack, toast }) => {
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: product.name, price: product.price, stock: product.stock, description: product.description });

  return (
    <>
      <div className="ap-detail-header">
        <button className="ap-detail-back" onClick={onBack}><Ic.Back /> Back to Products</button>
      </div>
      <div className="ap-detail-grid">
        <div>
          <div className="ap-profile-card">
            <div className="ap-profile-avatar" style={{ borderRadius: 14, width: 72, height: 72 }}>
              <Ic.Box />
            </div>
            <div className="ap-profile-name" style={{ fontSize: 17 }}>{product.name}</div>
            <div className="ap-profile-role">{product.seller}</div>
            <span className={`ap-badge ${statusBadge(product.status)}`} style={{ marginTop: 4 }}>{product.status}</span>
            <div className="ap-profile-stats">
              <div className="ap-profile-stat">
                <div className="ap-profile-stat-val">{fmtRupee(product.price)}</div>
                <div className="ap-profile-stat-label">Price</div>
              </div>
              <div className="ap-profile-stat">
                <div className="ap-profile-stat-val">{product.stock}</div>
                <div className="ap-profile-stat-label">In Stock</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, width: "100%", marginTop: 8 }}>
              <button className="ap-btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setEditModal(true)}><Ic.Edit /> Edit</button>
            </div>
          </div>
        </div>
        <div>
          <div className="ap-info-card">
            <div className="ap-info-card-title">Product Details</div>
            <div className="ap-info-row"><span className="ap-info-key">Product Name</span><span className="ap-info-val">{product.name}</span></div>
            <div className="ap-info-row"><span className="ap-info-key">Seller</span><span className="ap-info-val">{product.seller}</span></div>
            <div className="ap-info-row"><span className="ap-info-key">Category</span><span className="ap-info-val"><span className="ap-badge ap-badge-neutral">{product.category}</span></span></div>
            <div className="ap-info-row"><span className="ap-info-key">Price</span><span className="ap-info-val" style={{ color: "var(--accent)", fontWeight: 700 }}>{fmtRupee(product.price)}</span></div>
            <div className="ap-info-row"><span className="ap-info-key">Stock</span>
              <span className="ap-info-val">
                <span className={`ap-badge ${product.stock === 0 ? "ap-badge-danger" : product.stock < 5 ? "ap-badge-warning" : "ap-badge-success"}`}>
                  {product.stock === 0 ? "Out of Stock" : `${product.stock} items`}
                </span>
              </span>
            </div>
            <div className="ap-info-row"><span className="ap-info-key">Status</span><span className="ap-info-val"><span className={`ap-badge ${statusBadge(product.status)}`}>{product.status}</span></span></div>
          </div>
          <div className="ap-info-card">
            <div className="ap-info-card-title">Description</div>
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.7 }}>{product.description}</p>
          </div>
        </div>
      </div>

      {editModal && (
        <div className="ap-overlay" onClick={e => { if (e.target === e.currentTarget) setEditModal(false); }}>
          <div className="ap-modal">
            <div className="ap-modal-header">
              <div className="ap-modal-title">Edit Product</div>
              <button className="ap-modal-close" onClick={() => setEditModal(false)}><Ic.X /></button>
            </div>
            <div className="ap-form-group"><label className="ap-form-label">Product Name</label>
              <input className="ap-form-input" value={editData.name} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} /></div>
            <div className="ap-form-row">
              <div className="ap-form-group"><label className="ap-form-label">Price (₹)</label>
                <input className="ap-form-input" type="number" value={editData.price} onChange={e => setEditData(d => ({ ...d, price: +e.target.value }))} /></div>
              <div className="ap-form-group"><label className="ap-form-label">Stock</label>
                <input className="ap-form-input" type="number" value={editData.stock} onChange={e => setEditData(d => ({ ...d, stock: +e.target.value }))} /></div>
            </div>
            <div className="ap-form-group"><label className="ap-form-label">Description</label>
              <textarea className="ap-form-textarea" value={editData.description} onChange={e => setEditData(d => ({ ...d, description: e.target.value }))} /></div>
            <div className="ap-modal-footer">
              <button className="ap-btn-outline" onClick={() => setEditModal(false)}>Cancel</button>
              <button className="ap-btn-primary" onClick={() => { setEditModal(false); toast("Product updated successfully"); }}><Ic.Check /> Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Order Detail Page ────────────────────────────────────────────
const OrderDetailPage: React.FC<{ order: Order; onBack: () => void; toast: (m: string) => void }> = ({ order, onBack, toast }) => {
  const [status, setStatus] = useState(order.status);
  const statusOpts: Order["status"][] = ["Pending","Processing","Shipped","Delivered","Cancelled"];

  const steps = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentStep = steps.indexOf(status);

  return (
    <>
      <div className="ap-detail-header">
        <button className="ap-detail-back" onClick={onBack}><Ic.Back /> Back to Orders</button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <select className="ap-select" value={status}
            onChange={e => { setStatus(e.target.value as Order["status"]); toast("Order status updated"); }}>
            {statusOpts.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Progress tracker */}
      {status !== "Cancelled" && (
        <div className="ap-info-card" style={{ marginBottom: 18 }}>
          <div className="ap-info-card-title">Order Progress</div>
          <div style={{ display: "flex", alignItems: "center", padding: "12px 0 4px", gap: 0 }}>
            {steps.map((step, i) => (
              <React.Fragment key={step}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: i <= currentStep ? "var(--accent)" : "var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: i <= currentStep ? "#fff" : "var(--text-muted)",
                    transition: "all 0.3s",
                  }}>
                    {i < currentStep ? <Ic.Check /> : <span style={{ fontSize: 12, fontWeight: 700 }}>{i + 1}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: i <= currentStep ? "var(--accent)" : "var(--text-muted)", marginTop: 6, fontWeight: i <= currentStep ? 600 : 400 }}>{step}</div>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 2, height: 2, background: i < currentStep ? "var(--accent)" : "var(--border)", transition: "background 0.3s", marginBottom: 22 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="ap-detail-grid">
        <div>
          <div className="ap-info-card">
            <div className="ap-info-card-title">Customer Details</div>
            <div className="ap-info-row"><span className="ap-info-key">Name</span><span className="ap-info-val">{order.customer}</span></div>
            <div className="ap-info-row"><span className="ap-info-key">Phone</span><span className="ap-info-val">{order.phone}</span></div>
            <div className="ap-info-row"><span className="ap-info-key">Address</span><span className="ap-info-val">{order.address}</span></div>
          </div>
        </div>
        <div>
          <div className="ap-info-card">
            <div className="ap-info-card-title">Order Summary</div>
            <div className="ap-info-row"><span className="ap-info-key">Order ID</span><span className="ap-info-val" style={{ fontWeight: 700 }}>{order.id}</span></div>
            <div className="ap-info-row"><span className="ap-info-key">Seller</span><span className="ap-info-val">{order.seller}</span></div>
            <div className="ap-info-row"><span className="ap-info-key">Items</span><span className="ap-info-val">{order.items}</span></div>
            <div className="ap-info-row"><span className="ap-info-key">Order Date</span><span className="ap-info-val">{order.date}</span></div>
            <div className="ap-info-row"><span className="ap-info-key">Total Amount</span>
              <span className="ap-info-val" style={{ color: "var(--accent)", fontWeight: 700, fontSize: 16 }}>{fmtRupee(order.amount)}</span></div>
            <div className="ap-info-row"><span className="ap-info-key">Status</span>
              <span className="ap-info-val"><span className={`ap-badge ${statusBadge(status)}`}>{status}</span></span></div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Dashboard Page ───────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const [revenueFilter, setRevenueFilter] = useState<TimeFilter>("monthly");
  const [ordersFilter, setOrdersFilter] = useState<TimeFilter>("monthly");
  const [sellersFilter, setSellersFilter] = useState<TimeFilter>("monthly");

  const revD = chartData.revenue[revenueFilter];
  const ordD = chartData.orders[ordersFilter];
  const selD = chartData.sellers[sellersFilter];

  const activities = [
    { icon: <Ic.Store />, bg: "#fdf0e8", color: "#b5541c", text: "New seller Mohan Lal registered", time: "2 mins ago" },
    { icon: <Ic.Cart  />, bg: "#e0ecff", color: "#1a56b0", text: "Order #A006 placed by Aarav Patel", time: "15 mins ago" },
    { icon: <Ic.Check />, bg: "#d4edda", color: "#2d7a4a", text: "Order #A001 delivered successfully", time: "1 hr ago" },
    { icon: <Ic.Box   />, bg: "#ede8ff", color: "#5b3ea8", text: "Product 'Silk Dupatta' updated", time: "3 hrs ago" },
    { icon: <Ic.Bell  />, bg: "#fff3cd", color: "#8a6a00", text: "5 new buyers joined today", time: "Today" },
  ];

  return (
    <>
      <div className="ap-page-header">
        <div>
          <div className="ap-page-title">Dashboard</div>
          <div className="ap-page-sub">Admin overview — all systems operational</div>
        </div>
        <div className="ap-page-actions">
          <button className="ap-btn-outline"><Ic.Download /> Export Report</button>
        </div>
      </div>

      <div className="ap-stats-grid">
        {[
          { label: "Total Revenue",   value: fmtRupee(562800), change: "+12.4% this month", icon: <Ic.Rupee /> },
          { label: "Total Orders",    value: "1,842",          change: "+8.1% this month",  icon: <Ic.Cart /> },
          { label: "Active Sellers",  value: "34",             change: "+3 this month",      icon: <Ic.Store /> },
          { label: "Registered Users",value: "2,481",          change: "+15.6% this month", icon: <Ic.TrendUp /> },
        ].map((s) => (
          <div className="ap-stat-card" key={s.label}>
            <div className="ap-stat-top">
              <span className="ap-stat-label">{s.label}</span>
              <div className="ap-stat-icon">{s.icon}</div>
            </div>
            <div className="ap-stat-value">{s.value}</div>
            <div className="ap-stat-change up">↗ {s.change}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="ap-charts-row">
        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div>
              <div className="ap-chart-title">Revenue Trend</div>
              <div className="ap-chart-sub">Platform-wide revenue in ₹ — hover to inspect</div>
            </div>
            <TimeFilterTabs value={revenueFilter} onChange={setRevenueFilter} />
          </div>
          <LineChart data={revD.values} labels={revD.labels} color="#b5541c" fill="#b5541c" valuePrefix="₹" />
          <div className="ap-bar-labels">{revD.labels.map(m => <span className="ap-bar-label" key={m}>{m}</span>)}</div>
        </div>

        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div>
              <div className="ap-chart-title">Orders by Status</div>
              <div className="ap-chart-sub">Current distribution</div>
            </div>
          </div>
          <DonutChart segments={[
            { value: 842, color: "#2d7a4a", label: "Delivered" },
            { value: 304, color: "#1a56b0", label: "Processing" },
            { value: 186, color: "#5b3ea8", label: "Shipped" },
            { value: 98,  color: "#8a6a00", label: "Pending" },
            { value: 412, color: "#c0392b", label: "Cancelled" },
          ]} />
        </div>
      </div>

      {/* Orders Chart */}
      <div className="ap-charts-row">
        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div>
              <div className="ap-chart-title">Order Volume</div>
              <div className="ap-chart-sub">Number of orders — hover to inspect</div>
            </div>
            <TimeFilterTabs value={ordersFilter} onChange={setOrdersFilter} />
          </div>
          <BarChart data={ordD.values} labels={ordD.labels} color="#b5541c" label1="Orders" />
          <div className="ap-bar-labels">{ordD.labels.map(l => <span className="ap-bar-label" key={l}>{l}</span>)}</div>
        </div>

        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div>
              <div className="ap-chart-title">New Sellers</div>
              <div className="ap-chart-sub">Seller sign-up growth</div>
            </div>
            <TimeFilterTabs value={sellersFilter} onChange={setSellersFilter} />
          </div>
          <LineChart data={selD.values} labels={selD.labels} color="#5b3ea8" fill="#5b3ea8" valueSuffix=" sellers" />
          <div className="ap-bar-labels">{selD.labels.map(l => <span className="ap-bar-label" key={l}>{l}</span>)}</div>
        </div>
      </div>

      <div className="ap-bottom-row">
        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div className="ap-chart-title">Sales Conversion Funnel</div>
          </div>
          <div className="ap-funnel">
            {[
              { label: "Visitors",      val: "18,420", pct: 100 },
              { label: "Product Views", val: "9,210",  pct: 50 },
              { label: "Add to Cart",   val: "3,684",  pct: 20 },
              { label: "Checkout",      val: "2,210",  pct: 12 },
              { label: "Completed",     val: "1,842",  pct: 10 },
            ].map(r => (
              <div className="ap-funnel-row" key={r.label}>
                <div className="ap-funnel-label-row">
                  <span>{r.label}</span>
                  <span className="ap-funnel-pct">{r.val} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({r.pct}%)</span></span>
                </div>
                <div className="ap-funnel-track"><div className="ap-funnel-fill" style={{ width: `${r.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div className="ap-chart-title">Recent Activity</div>
          </div>
          <div className="ap-activity-list">
            {activities.map((a, i) => (
              <div className="ap-activity-item" key={i}>
                <div className="ap-activity-icon" style={{ background: a.bg, color: a.color }}>{a.icon}</div>
                <div>
                  <div className="ap-activity-text">{a.text}</div>
                  <div className="ap-activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Sellers Page ─────────────────────────────────────────────────
const SellersPage: React.FC<{ toast: (m: string) => void }> = ({ toast }) => {
  const [sellers, setSellers] = useState(SELLERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(false);
  const [viewSeller, setViewSeller] = useState<Seller | null>(null);

  if (viewSeller) return <SellerDetailPage seller={viewSeller} onBack={() => setViewSeller(null)} toast={toast} />;

  const filters = ["All", "Active", "Pending", "Suspended"];
  const shown = sellers.filter(s =>
    (filter === "All" || s.status === filter) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.shop.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleStatus = (id: number, cur: string) => {
    const next = cur === "Active" ? "Suspended" : "Active";
    setSellers(p => p.map(s => s.id === id ? { ...s, status: next as Seller["status"] } : s));
    toast(`Seller status updated to ${next}`);
  };
  const approve = (id: number) => {
    setSellers(p => p.map(s => s.id === id ? { ...s, status: "Active" } : s));
    toast("Seller approved successfully");
  };
  const del = (id: number) => { setSellers(p => p.filter(s => s.id !== id)); toast("Seller removed"); };

  return (
    <>
      <div className="ap-page-header">
        <div>
          <div className="ap-page-title">Sellers</div>
          <div className="ap-page-sub">Manage all artisan sellers on the platform</div>
        </div>
        <div className="ap-page-actions">
          <button className="ap-btn-primary" onClick={() => setModal(true)}><Ic.Plus /> Add Seller</button>
        </div>
      </div>

      <div className="ap-table-card">
        <div className="ap-table-top">
          <div className="ap-table-title">All Sellers ({shown.length})</div>
          <div className="ap-table-actions">
            <div className="ap-search-mini">
              <Ic.Search /><input placeholder="Search sellers..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="ap-filter-tabs">
              {filters.map(f => (
                <button key={f} className={`ap-filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="ap-table-scroll">
          <table className="ap-table">
            <thead><tr>
              <th>Seller</th><th>Shop</th><th>Category</th>
              <th>Products</th><th>Revenue</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {shown.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="ap-user-cell">
                      <div className="ap-avatar">{initials(s.name)}</div>
                      <div>
                        <div className="ap-user-name">{s.name}</div>
                        <div className="ap-user-email">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{s.shop}</td>
                  <td><span className="ap-badge ap-badge-neutral">{s.category}</span></td>
                  <td>{s.products}</td>
                  <td style={{ fontWeight: 600, color: "var(--accent)" }}>{fmtRupee(s.revenue)}</td>
                  <td><span className={`ap-badge ${statusBadge(s.status)}`}>{s.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      {s.status === "Pending" && (
                        <button className="ap-icon-btn toggle" title="Approve" onClick={() => approve(s.id)}><Ic.Check /></button>
                      )}
                      <button className="ap-icon-btn view" title="View Details" onClick={() => setViewSeller(s)}><Ic.Eye /></button>
                      <button className="ap-icon-btn edit" title="Edit"><Ic.Edit /></button>
                      <button className="ap-icon-btn toggle" title="Toggle Status" onClick={() => toggleStatus(s.id, s.status)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                      </button>
                      <button className="ap-icon-btn del" title="Delete" onClick={() => del(s.id)}><Ic.Trash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="ap-overlay" onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="ap-modal">
            <div className="ap-modal-header">
              <div className="ap-modal-title">Add New Seller</div>
              <button className="ap-modal-close" onClick={() => setModal(false)}><Ic.X /></button>
            </div>
            <div className="ap-form-row">
              <div className="ap-form-group"><label className="ap-form-label">Full Name</label><input className="ap-form-input" placeholder="Seller name" /></div>
              <div className="ap-form-group"><label className="ap-form-label">Shop Name</label><input className="ap-form-input" placeholder="Shop name" /></div>
            </div>
            <div className="ap-form-group"><label className="ap-form-label">Email</label><input className="ap-form-input" type="email" placeholder="email@example.com" /></div>
            <div className="ap-form-row">
              <div className="ap-form-group">
                <label className="ap-form-label">Category</label>
                <select className="ap-form-select">
                  {["Pottery","Textiles","Jewelry","Woodwork","Paintings","Metalwork"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="ap-form-group"><label className="ap-form-label">Phone</label><input className="ap-form-input" placeholder="+91 00000 00000" /></div>
            </div>
            <div className="ap-form-group"><label className="ap-form-label">Address</label><textarea className="ap-form-textarea" placeholder="Seller address..." /></div>
            <div className="ap-modal-footer">
              <button className="ap-btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="ap-btn-primary" onClick={() => { setModal(false); toast("Seller added successfully"); }}>Add Seller</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Products Page ────────────────────────────────────────────────
const ProductsPage: React.FC<{ toast: (m: string) => void }> = ({ toast }) => {
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  if (viewProduct) return <ProductDetailPage product={viewProduct} onBack={() => setViewProduct(null)} toast={toast} />;

  const shown = products.filter(p =>
    (filter === "All" || p.category === filter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.seller.toLowerCase().includes(search.toLowerCase()))
  );
  const cats = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  return (
    <>
      <div className="ap-page-header">
        <div>
          <div className="ap-page-title">Products</div>
          <div className="ap-page-sub">All products listed across the platform</div>
        </div>
      </div>
      <div className="ap-table-card">
        <div className="ap-table-top">
          <div className="ap-table-title">All Products ({shown.length})</div>
          <div className="ap-table-actions">
            <div className="ap-search-mini"><Ic.Search /><input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} /></div>
            <div className="ap-filter-tabs">{cats.map(c => (
              <button key={c} className={`ap-filter-tab ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
            ))}</div>
          </div>
        </div>
        <div className="ap-table-scroll">
          <table className="ap-table">
            <thead><tr>
              <th>Product</th><th>Seller</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>{shown.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td style={{ color: "var(--text-secondary)" }}>{p.seller}</td>
                <td><span className="ap-badge ap-badge-neutral">{p.category}</span></td>
                <td style={{ fontWeight: 600 }}>{fmtRupee(p.price)}</td>
                <td>
                  <span className={`ap-badge ${p.stock === 0 ? "ap-badge-danger" : p.stock < 5 ? "ap-badge-warning" : "ap-badge-success"}`}>
                    {p.stock === 0 ? "Out of Stock" : `${p.stock} items`}
                  </span>
                </td>
                <td><span className={`ap-badge ${statusBadge(p.status)}`}>{p.status}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="ap-icon-btn view" onClick={() => setViewProduct(p)}><Ic.Eye /></button>
                    <button className="ap-icon-btn edit"><Ic.Edit /></button>
                    <button className="ap-icon-btn del" onClick={() => { setProducts(pr => pr.filter(x => x.id !== p.id)); toast("Product removed"); }}><Ic.Trash /></button>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// ─── Orders Page ──────────────────────────────────────────────────
const OrdersPage: React.FC<{ toast: (m: string) => void }> = ({ toast }) => {
  const [orders, setOrders] = useState(ORDERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  if (viewOrder) return <OrderDetailPage order={viewOrder} onBack={() => setViewOrder(null)} toast={toast} />;

  const statusOpts: Order["status"][] = ["Pending","Processing","Shipped","Delivered","Cancelled"];
  const shown = orders.filter(o =>
    (filter === "All" || o.status === filter) &&
    (o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <div className="ap-page-header">
        <div>
          <div className="ap-page-title">Orders</div>
          <div className="ap-page-sub">View and manage all platform orders</div>
        </div>
      </div>
      <div className="ap-table-card">
        <div className="ap-table-top">
          <div className="ap-table-title">All Orders ({shown.length})</div>
          <div className="ap-table-actions">
            <div className="ap-search-mini"><Ic.Search /><input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} /></div>
            <div className="ap-filter-tabs">{(["All", ...statusOpts]).map(f => (
              <button key={f} className={`ap-filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
            ))}</div>
          </div>
        </div>
        <div className="ap-table-scroll">
          <table className="ap-table">
            <thead><tr>
              <th>Order ID</th><th>Customer</th><th>Seller</th><th>Items</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>{shown.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>{o.id}</td>
                <td>{o.customer}</td>
                <td style={{ color: "var(--text-secondary)" }}>{o.seller}</td>
                <td>{o.items}</td>
                <td style={{ fontWeight: 600, color: "var(--accent)" }}>{fmtRupee(o.amount)}</td>
                <td style={{ color: "var(--text-secondary)" }}>{o.date}</td>
                <td>
                  <select className="ap-select" style={{ fontSize: 12, padding: "5px 10px" }} value={o.status}
                    onChange={e => { setOrders(p => p.map(x => x.id === o.id ? { ...x, status: e.target.value as Order["status"] } : x)); toast("Order status updated"); }}>
                    {statusOpts.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <button className="ap-icon-btn view" onClick={() => setViewOrder(o)}><Ic.Eye /></button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// ─── Analytics Page ───────────────────────────────────────────────
const AnalyticsPage: React.FC = () => {
  const [revFilter, setRevFilter] = useState<TimeFilter>("monthly");
  const [ordFilter, setOrdFilter] = useState<TimeFilter>("monthly");

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const rev2023 = [18000,21000,17000,29000,25000,34000,30000,38000,35000,42000,37000,48000];
  const rev2024 = [28000,31500,27000,42000,38000,51000,46000,58000,53000,62000,55000,71000];
  const revD = chartData.revenue[revFilter];
  const ordD = chartData.orders[ordFilter];

  const catRevenue = [
    { value: 42, color: "#b5541c", label: "Pottery" },
    { value: 28, color: "#d4692a", label: "Textiles" },
    { value: 18, color: "#f0a070", label: "Jewelry" },
    { value: 8,  color: "#5b3ea8", label: "Woodwork" },
    { value: 4,  color: "#1a56b0", label: "Others" },
  ];
  const topSellers = [
    { name: "Raj Pottery",    rev: 48200, pct: 100 },
    { name: "Priya Textiles", rev: 31500, pct: 65  },
    { name: "Mohan Crafts",   rev: 22800, pct: 47  },
    { name: "Anita Weaves",   rev: 14100, pct: 29  },
    { name: "Vijay Woods",    rev: 8900,  pct: 18  },
  ];

  return (
    <>
      <div className="ap-page-header">
        <div>
          <div className="ap-page-title">Analytics</div>
          <div className="ap-page-sub">Deep-dive into platform performance metrics</div>
        </div>
        <div className="ap-page-actions">
          <button className="ap-btn-outline"><Ic.Download /> Download PDF</button>
        </div>
      </div>

      <div className="ap-stats-grid" style={{ marginBottom: 22 }}>
        {[
          { label: "Avg Order Value",    value: "₹3,052",  change: "+4.2%" },
          { label: "Repeat Purchase %",  value: "38.4%",   change: "+2.1%" },
          { label: "Cart Abandonment",   value: "61.8%",   change: "-3.4%" },
          { label: "Platform Commission",value: "₹56,280", change: "+9.1%" },
        ].map(s => (
          <div className="ap-stat-card" key={s.label}>
            <div className="ap-stat-top">
              <span className="ap-stat-label">{s.label}</span>
              <div className="ap-stat-icon"><Ic.TrendUp /></div>
            </div>
            <div className="ap-stat-value">{s.value}</div>
            <div className="ap-stat-change up">↗ {s.change}</div>
          </div>
        ))}
      </div>

      <div className="ap-charts-row">
        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div>
              <div className="ap-chart-title">Revenue Trend</div>
              <div className="ap-chart-sub">Hover to inspect — filter by period</div>
            </div>
            <TimeFilterTabs value={revFilter} onChange={setRevFilter} />
          </div>
          <LineChart data={revD.values} labels={revD.labels} color="#b5541c" fill="#b5541c" valuePrefix="₹" />
          <div className="ap-bar-labels">{revD.labels.map(l => <span className="ap-bar-label" key={l}>{l}</span>)}</div>
        </div>

        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div className="ap-chart-title">Revenue by Category (%)</div>
          </div>
          <DonutChart segments={catRevenue} />
        </div>
      </div>

      <div className="ap-charts-row">
        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div>
              <div className="ap-chart-title">Order Volume</div>
              <div className="ap-chart-sub">Filter by period — hover bars for details</div>
            </div>
            <TimeFilterTabs value={ordFilter} onChange={setOrdFilter} />
          </div>
          <BarChart data={ordD.values} labels={ordD.labels} color="#b5541c" label1="Orders" />
          <div className="ap-bar-labels">{ordD.labels.map(l => <span className="ap-bar-label" key={l}>{l}</span>)}</div>
        </div>

        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div>
              <div className="ap-chart-title">Revenue: 2023 vs 2024</div>
              <div className="ap-chart-sub">Year-over-year monthly comparison</div>
            </div>
            <div className="ap-chart-legend">
              <div className="ap-legend-item"><span className="ap-legend-dot" style={{ background: "#b5541c" }} />2024</div>
              <div className="ap-legend-item"><span className="ap-legend-dot" style={{ background: "#f0a070" }} />2023</div>
            </div>
          </div>
          <BarChart data={rev2024.map(v => v / 1000)} labels={months} color="#b5541c" color2="#f0a070" data2={rev2023.map(v => v / 1000)} label1="2024 (₹K)" label2="2023 (₹K)" />
        </div>
      </div>

      <div className="ap-bottom-row">
        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div className="ap-chart-title">Top Sellers by Revenue</div>
          </div>
          <div className="ap-funnel">
            {topSellers.map(s => (
              <div className="ap-funnel-row" key={s.name}>
                <div className="ap-funnel-label-row">
                  <span>{s.name}</span>
                  <span className="ap-funnel-pct">{fmtRupee(s.rev)}</span>
                </div>
                <div className="ap-funnel-track"><div className="ap-funnel-fill" style={{ width: `${s.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div className="ap-chart-title">Monthly Order Trend (2024)</div>
          </div>
          <LineChart data={[48,54,42,70,63,88,75,96,85,102,91,118]} labels={months} color="#1a56b0" fill="#1a56b0" valueSuffix=" orders" />
          <div className="ap-bar-labels">{months.map(m => <span className="ap-bar-label" key={m}>{m}</span>)}</div>
        </div>
      </div>
    </>
  );
};

// ─── Settings Page ────────────────────────────────────────────────
const SettingsPage: React.FC<{ toast: (m: string) => void }> = ({ toast }) => {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    maintenance: false, reviews: true, email_notif: true,
    sms_notif: false, auto_approve: false, featured: true,
  });
  const tog = (k: string) => setToggles(p => ({ ...p, [k]: !p[k] }));

  return (
    <>
      <div className="ap-page-header">
        <div>
          <div className="ap-page-title">Settings</div>
          <div className="ap-page-sub">Configure platform-wide preferences</div>
        </div>
        <div className="ap-page-actions">
          <button className="ap-btn-primary" onClick={() => toast("Settings saved successfully")}><Ic.Check /> Save Changes</button>
        </div>
      </div>

      <div className="ap-settings-grid">
        <div className="ap-settings-section">
          <div className="ap-settings-title"><Ic.Globe />General Settings</div>
          <div className="ap-form-group"><label className="ap-form-label">Platform Name</label><input className="ap-form-input" defaultValue="Artisans" /></div>
          <div className="ap-form-group"><label className="ap-form-label">Contact Email</label><input className="ap-form-input" type="email" defaultValue="admin@artisans.in" /></div>
          <div className="ap-form-group"><label className="ap-form-label">Commission Rate (%)</label><input className="ap-form-input" type="number" defaultValue="5" /></div>
          <div className="ap-form-group"><label className="ap-form-label">Currency</label>
            <select className="ap-form-select"><option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option></select>
          </div>
          <div className="ap-toggle-row">
            <div><div className="ap-toggle-label">Maintenance Mode</div><div className="ap-toggle-sub">Temporarily disable the platform</div></div>
            <button className={`ap-toggle ${toggles.maintenance ? "on" : ""}`} onClick={() => tog("maintenance")} />
          </div>
          <div className="ap-toggle-row">
            <div><div className="ap-toggle-label">Auto-Approve Sellers</div><div className="ap-toggle-sub">Skip manual review</div></div>
            <button className={`ap-toggle ${toggles.auto_approve ? "on" : ""}`} onClick={() => tog("auto_approve")} />
          </div>
        </div>

        <div className="ap-settings-section">
          <div className="ap-settings-title"><Ic.Shield />Security</div>
          <div className="ap-form-group"><label className="ap-form-label">Current Password</label><input className="ap-form-input" type="password" placeholder="••••••••" /></div>
          <div className="ap-form-group"><label className="ap-form-label">New Password</label><input className="ap-form-input" type="password" placeholder="••••••••" /></div>
          <div className="ap-form-group"><label className="ap-form-label">Confirm Password</label><input className="ap-form-input" type="password" placeholder="••••••••" /></div>
          <div className="ap-toggle-row">
            <div><div className="ap-toggle-label">Two-Factor Auth</div><div className="ap-toggle-sub">Require OTP on admin login</div></div>
            <button className={`ap-toggle ${toggles.email_notif ? "on" : ""}`} onClick={() => tog("email_notif")} />
          </div>
          <div className="ap-toggle-row">
            <div><div className="ap-toggle-label">Login Alerts</div><div className="ap-toggle-sub">Email on each new admin login</div></div>
            <button className="ap-toggle on" />
          </div>
        </div>

        <div className="ap-settings-section">
          <div className="ap-settings-title"><Ic.Bell />Notifications</div>
          <div className="ap-toggle-row">
            <div><div className="ap-toggle-label">Email Notifications</div><div className="ap-toggle-sub">Receive alerts via email</div></div>
            <button className={`ap-toggle ${toggles.email_notif ? "on" : ""}`} onClick={() => tog("email_notif")} />
          </div>
          <div className="ap-toggle-row">
            <div><div className="ap-toggle-label">SMS Notifications</div></div>
            <button className={`ap-toggle ${toggles.sms_notif ? "on" : ""}`} onClick={() => tog("sms_notif")} />
          </div>
          <div className="ap-toggle-row">
            <div><div className="ap-toggle-label">New Order Alerts</div></div>
            <button className="ap-toggle on" />
          </div>
          <div className="ap-toggle-row">
            <div><div className="ap-toggle-label">New Seller Alerts</div></div>
            <button className="ap-toggle on" />
          </div>
          <div className="ap-toggle-row">
            <div><div className="ap-toggle-label">Weekly Summary</div></div>
            <button className={`ap-toggle ${toggles.reviews ? "on" : ""}`} onClick={() => tog("reviews")} />
          </div>
        </div>

        <div className="ap-settings-section">
          <div className="ap-settings-title"><Ic.Activity />Platform Features</div>
          <div className="ap-toggle-row">
            <div><div className="ap-toggle-label">Product Reviews</div><div className="ap-toggle-sub">Allow buyers to leave reviews</div></div>
            <button className={`ap-toggle ${toggles.reviews ? "on" : ""}`} onClick={() => tog("reviews")} />
          </div>
          <div className="ap-toggle-row">
            <div><div className="ap-toggle-label">Featured Listings</div><div className="ap-toggle-sub">Enable featured product slots</div></div>
            <button className={`ap-toggle ${toggles.featured ? "on" : ""}`} onClick={() => tog("featured")} />
          </div>
          <div className="ap-form-group" style={{ marginTop: 14 }}>
            <label className="ap-form-label">Max Products per Seller</label>
            <input className="ap-form-input" type="number" defaultValue="50" />
          </div>
          <div className="ap-form-group">
            <label className="ap-form-label">Min Product Price (₹)</label>
            <input className="ap-form-input" type="number" defaultValue="100" />
          </div>
          <div className="ap-form-group">
            <label className="ap-form-label">Support Email</label>
            <input className="ap-form-input" type="email" defaultValue="support@artisans.in" />
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Root ─────────────────────────────────────────────────────────
const AdminPanel: React.FC = () => {
  const [page, setPage] = useState<NavPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [logoutModal, setLogoutModal] = useState(false);

  const showToast = useCallback((m: string) => setToastMsg(m), []);
  const navigate = (p: NavPage) => { setPage(p); setSidebarOpen(false); };

  const navGroups = [
    {
      label: "Overview",
      items: [{ id: "dashboard" as NavPage, label: "Dashboard", icon: <Ic.Grid /> }],
    },
    {
      label: "Management",
      items: [
        { id: "sellers"  as NavPage, label: "Sellers",  icon: <Ic.Store />, badge: "2" },
        { id: "products" as NavPage, label: "Products", icon: <Ic.Box />   },
        { id: "orders"   as NavPage, label: "Orders",   icon: <Ic.Cart />, badge: "5" },
      ],
    },
    {
      label: "Insights",
      items: [
        { id: "analytics" as NavPage, label: "Analytics", icon: <Ic.Chart /> },
        { id: "settings"  as NavPage, label: "Settings",  icon: <Ic.Settings /> },
      ],
    },
  ];

  return (
    <div className="ap-layout">
      <div className={`ap-sidebar-backdrop ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`ap-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="ap-sidebar-logo">
          <div className="ap-logo-icon">A</div>
          <div className="ap-logo-text">
            <span className="ap-logo-title">Artisans</span>
            <span className="ap-logo-sub">Admin Panel</span>
          </div>
        </div>

        <nav className="ap-nav">
          {navGroups.map(group => (
            <div key={group.label}>
              <div className="ap-nav-section-label">{group.label}</div>
              {group.items.map(item => (
                <button key={item.id} className={`ap-nav-item ${page === item.id ? "active" : ""}`} onClick={() => navigate(item.id)}>
                  {item.icon}
                  {item.label}
                  {item.badge && <span className="ap-nav-badge">{item.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="ap-sidebar-footer">
          <div className="ap-admin-card">
            <div className="ap-admin-avatar">SA</div>
            <div>
              <div className="ap-admin-name">Super Admin</div>
              <div className="ap-admin-role">admin@artisans.in</div>
            </div>
          </div>
          <button className="ap-logout-btn" onClick={() => setLogoutModal(true)}>
            <Ic.Logout /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ap-main">
        {/* Mobile bar only */}
        <div className="ap-mobile-bar">
          <button className="ap-menu-btn" onClick={() => setSidebarOpen(o => !o)}><Ic.Menu /></button>
          <div className="ap-logo-icon">A</div>
          <div className="ap-logo-text">
            <span className="ap-logo-title">Artisans</span>
          </div>
        </div>

        <div className="ap-content">
          {page === "dashboard"  && <DashboardPage />}
          {page === "sellers"    && <SellersPage toast={showToast} />}
          {page === "products"   && <ProductsPage toast={showToast} />}
          {page === "orders"     && <OrdersPage toast={showToast} />}
          {page === "analytics"  && <AnalyticsPage />}
          {page === "settings"   && <SettingsPage toast={showToast} />}
        </div>
      </div>

      {toastMsg && <Toast msg={toastMsg} onDone={() => setToastMsg(null)} />}

      {logoutModal && (
        <LogoutModal
          onConfirm={() => { setLogoutModal(false); showToast("Logged out successfully"); }}
          onCancel={() => setLogoutModal(false)}
        />
      )}
    </div>
  );
};

export default AdminPanel;