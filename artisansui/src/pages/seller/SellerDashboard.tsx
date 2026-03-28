// SellerDashboard.tsx
import React, { useState, useRef, useCallback } from "react";
import "./SellerDashboard.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type NavPage =
  | "dashboard" | "products" | "orders" | "story"
  | "analytics" | "customers" | "settings"
  | "reviews" | "promotions" | "inventory";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  rating?: number;
  sold?: number;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  amount: number;
  date: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered";
  items?: { name: string; qty: number; price: number }[];
  address?: string;
}

interface Story {
  id: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  image: string;
  featured: boolean;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  joined: string;
  location: string;
}

interface Review {
  id: number;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
  replied: boolean;
}

interface Promotion {
  id: number;
  name: string;
  code: string;
  discount: number;
  type: "percent" | "flat";
  minOrder: number;
  uses: number;
  maxUses: number;
  active: boolean;
  expiry: string;
}

// ─── Initial Data ─────────────────────────────────────────────────────────────
const initialProducts: Product[] = [
  { id: 1, name: "Handmade Ceramic Vase", description: "Beautiful ceramic vase with traditional patterns", category: "Pottery", price: 2500, stock: 15, image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=80&h=80&fit=crop", rating: 4.8, sold: 32 },
  { id: 2, name: "Woven Wall Hanging", description: "Colorful textile wall decoration", category: "Textiles", price: 1800, stock: 8, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=80&h=80&fit=crop", rating: 4.5, sold: 18 },
  { id: 3, name: "Brass Jewelry Set", description: "Traditional brass jewelry set", category: "Jewelry", price: 3200, stock: 12, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=80&h=80&fit=crop", rating: 4.9, sold: 45 },
  { id: 4, name: "Hand-painted Silk Scarf", description: "Luxurious silk scarf with floral motifs", category: "Textiles", price: 1500, stock: 6, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=80&h=80&fit=crop", rating: 4.7, sold: 22 },
  { id: 5, name: "Carved Wooden Bowl", description: "Rustic mango wood serving bowl, hand-carved", category: "Woodwork", price: 1200, stock: 20, image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=80&h=80&fit=crop", rating: 4.6, sold: 15 },
];

const initialOrders: Order[] = [
  { id: "#2024001", customer: "John Doe", email: "john@example.com", phone: "+91 98765 43210", amount: 2500, date: "2024-06-15", status: "Delivered", address: "42, MG Road, Bangalore, Karnataka - 560001", items: [{ name: "Handmade Ceramic Vase", qty: 1, price: 2500 }] },
  { id: "#2024002", customer: "Sarah Smith", email: "sarah@example.com", phone: "+91 87654 32109", amount: 3600, date: "2024-06-14", status: "Processing", address: "12, Park Street, Kolkata, West Bengal - 700016", items: [{ name: "Woven Wall Hanging", qty: 2, price: 1800 }] },
  { id: "#2024003", customer: "Mike Johnson", email: "mike@example.com", phone: "+91 76543 21098", amount: 3200, date: "2024-06-13", status: "Pending", address: "8, Banjara Hills, Hyderabad, Telangana - 500034", items: [{ name: "Brass Jewelry Set", qty: 1, price: 3200 }] },
  { id: "#2024004", customer: "Emma Wilson", email: "emma@example.com", phone: "+91 65432 10987", amount: 5700, date: "2024-06-12", status: "Shipped", address: "15, Linking Road, Mumbai, Maharashtra - 400050", items: [{ name: "Handmade Ceramic Vase", qty: 1, price: 2500 }, { name: "Woven Wall Hanging", qty: 1, price: 1800 }, { name: "Hand-painted Silk Scarf", qty: 1, price: 1400 }] },
  { id: "#2024005", customer: "Priya Sharma", email: "priya@example.com", phone: "+91 99887 76655", amount: 1200, date: "2024-06-11", status: "Delivered", address: "7, Civil Lines, Jaipur, Rajasthan - 302006", items: [{ name: "Carved Wooden Bowl", qty: 1, price: 1200 }] },
];

const initialStories: Story[] = [
  { id: 1, title: "My Journey as a Potter", author: "Raj Kumar", date: "2024-06-10", excerpt: "I started pottery as a hobby during my college days and fell in love with the craft. Every piece I create tells a story of tradition and innovation.", image: "", featured: true },
  { id: 2, title: "Preserving Textile Traditions", author: "Priya Singh", date: "2024-06-05", excerpt: "Weaving has been in my family for generations. My grandmother taught me the art of creating beautiful patterns with traditional looms.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop", featured: false },
];

const initialCustomers: Customer[] = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+91 98765 43210", orders: 4, spent: 9800, joined: "2024-01-15", location: "Bangalore" },
  { id: 2, name: "Sarah Smith", email: "sarah@example.com", phone: "+91 87654 32109", orders: 2, spent: 5400, joined: "2024-02-20", location: "Kolkata" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+91 76543 21098", orders: 1, spent: 3200, joined: "2024-03-10", location: "Hyderabad" },
  { id: 4, name: "Emma Wilson", email: "emma@example.com", phone: "+91 65432 10987", orders: 6, spent: 18200, joined: "2023-11-05", location: "Mumbai" },
  { id: 5, name: "Priya Sharma", email: "priya@example.com", phone: "+91 99887 76655", orders: 3, spent: 6700, joined: "2024-04-02", location: "Jaipur" },
];

const initialReviews: Review[] = [
  { id: 1, customer: "John Doe", product: "Handmade Ceramic Vase", rating: 5, comment: "Absolutely stunning craftsmanship! The vase arrived well-packaged and looks even better in person.", date: "2024-06-14", replied: true },
  { id: 2, customer: "Sarah Smith", product: "Woven Wall Hanging", rating: 4, comment: "Beautiful piece, colors are vibrant. Would love more size options.", date: "2024-06-12", replied: false },
  { id: 3, customer: "Emma Wilson", product: "Brass Jewelry Set", rating: 5, comment: "Exquisite work! The detailing is incredible. Got so many compliments.", date: "2024-06-10", replied: true },
  { id: 4, customer: "Priya Sharma", product: "Carved Wooden Bowl", rating: 3, comment: "Good quality but delivery was delayed. The bowl itself is lovely.", date: "2024-06-08", replied: false },
  { id: 5, customer: "Mike Johnson", product: "Hand-painted Silk Scarf", rating: 5, comment: "Pure art! The painting is delicate and the silk is top quality.", date: "2024-06-06", replied: false },
];

const initialPromotions: Promotion[] = [
  { id: 1, name: "Summer Sale", code: "SUMMER20", discount: 20, type: "percent", minOrder: 1000, uses: 34, maxUses: 100, active: true, expiry: "2024-08-31" },
  { id: 2, name: "First Order", code: "FIRST150", discount: 150, type: "flat", minOrder: 500, uses: 12, maxUses: 50, active: true, expiry: "2024-12-31" },
  { id: 3, name: "Festival Offer", code: "DIWALI25", discount: 25, type: "percent", minOrder: 2000, uses: 50, maxUses: 50, active: false, expiry: "2024-11-15" },
];

type Period = "W" | "M" | "Y";

const revenueDataByPeriod: Record<Period, number[]> = {
  W: [42, 68, 55, 80, 62, 91, 74],
  M: [60, 45, 80, 55, 90, 70, 85, 65, 95, 75, 88, 72],
  Y: [420, 510, 460, 590, 670, 720, 810, 740, 880, 790, 950, 870],
};
const ordersDataByPeriod: Record<Period, number[]> = {
  W: [18, 30, 22, 35, 28, 42, 33],
  M: [30, 50, 40, 70, 55, 80, 60, 75, 90, 65, 85, 70],
  Y: [280, 340, 310, 420, 480, 520, 590, 540, 630, 570, 680, 610],
};
const labelsByPeriod: Record<Period, string[]> = {
  W: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  M: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  Y: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
};
const periodLabels: Record<Period, string> = { W: "Weekly", M: "Monthly", Y: "Yearly" };

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IC = {
  Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Products: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  Orders: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  Story: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Analytics: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  Customers: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Reviews: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Promotions: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Inventory: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  X: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Rupee: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="18" y2="3"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="13" x2="12" y2="21"/><line x1="6" y1="13" x2="18" y2="13"/></svg>,
  TrendUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Upload: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Image: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  StarEmpty: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Package: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Phone: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.22 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  MapPin: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Bell: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Store: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  CreditCard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Reply: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>,
  AlertTriangle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Tag: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  RefreshCw: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const clampPositive = (val: number) => Math.max(0, val);

// ─── Image Upload ─────────────────────────────────────────────────────────────
interface ImageUploadProps { value: string; onChange: (url: string) => void; label?: string; }
const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = "Upload Image" }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }, []);
  return (
    <div className={`image-upload-zone ${isDragging ? "dragging" : ""} ${value ? "has-image" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop} onClick={() => fileRef.current?.click()}>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      {value ? (
        <div className="upload-preview">
          <img src={value} alt="Preview" className="upload-preview-img" />
          <div className="upload-preview-overlay"><IC.Upload /><span>Change</span></div>
        </div>
      ) : (
        <div className="upload-placeholder">
          <div className="upload-icon-wrap"><IC.Image /></div>
          <div className="upload-text">{label}</div>
          <div className="upload-hint">Drag & drop or click to browse</div>
        </div>
      )}
    </div>
  );
};

// ─── Bar Chart ────────────────────────────────────────────────────────────────
interface BarChartProps { data: number[]; labels: string[]; color1?: string; color2?: string; height?: number; valuePrefix?: string; period?: Period; }
const BarChartSVG: React.FC<BarChartProps> = ({ data, labels, color1 = "#b5541c", color2 = "#d47a4a", height = 160, valuePrefix = "", period = "M" }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number; index: number } | null>(null);
  const max = Math.max(...data); const min = Math.min(...data); const avg = Math.round(data.reduce((a, b) => a + b, 0) / data.length);
  const w = 500; const h = height; const barW = Math.max(12, Math.floor(w / data.length) - 8); const gap = Math.floor(w / data.length);
  const pctChange = tooltip && tooltip.index > 0 ? Math.round(((data[tooltip.index] - data[tooltip.index - 1]) / data[tooltip.index - 1]) * 100) : null;
  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${w} ${h + 24}`} width="100%" style={{ display: "block" }} onMouseLeave={() => setTooltip(null)}>
        <defs>
          <linearGradient id={`bg-${color1.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color1} /><stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        {data.map((v, i) => {
          const barH = Math.max(4, (v / max) * h); const x = i * gap + gap / 2 - barW / 2; const y = h - barH; const isHov = tooltip?.index === i;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} rx={4} fill={`url(#bg-${color1.replace("#","")})`} opacity={isHov ? 1 : 0.72} style={{ cursor: "pointer", transition: "opacity 0.15s" }}
                onMouseEnter={(e) => { const svgEl = (e.target as SVGElement).closest("svg")!; const scale = svgEl.clientWidth / w; setTooltip({ x: (x + barW / 2) * scale, y: y * scale, label: labels[i], value: v, index: i }); }} />
              <text x={x + barW / 2} y={h + 16} textAnchor="middle" fontSize={9} fill="#a89a8e" fontFamily="DM Sans, sans-serif">{labels[i]}</text>
            </g>
          );
        })}
      </svg>
      {tooltip && (
        <div className="bar-tooltip" style={{ left: tooltip.x, top: Math.max(4, tooltip.y - 8) }}>
          <span className="tooltip-period">{periodLabels[period]} · {tooltip.label}</span>
          <span className="tooltip-value">{valuePrefix}{tooltip.value.toLocaleString()}</span>
          <div className="tooltip-extras">
            <span className="tooltip-meta">Avg: {valuePrefix}{avg.toLocaleString()}</span>
            {pctChange !== null && <span className={`tooltip-change ${pctChange >= 0 ? "pos" : "neg"}`}>{pctChange >= 0 ? "↑" : "↓"} {Math.abs(pctChange)}%</span>}
          </div>
          <div className="tooltip-range"><span>Low: {valuePrefix}{min.toLocaleString()}</span><span>High: {valuePrefix}{max.toLocaleString()}</span></div>
        </div>
      )}
    </div>
  );
};

// ─── Donut Chart ──────────────────────────────────────────────────────────────
const DonutChartSVG: React.FC = () => {
  const segments = [{ label: "Pottery", pct: 40, color: "#b5541c" }, { label: "Textiles", pct: 25, color: "#d4692a" }, { label: "Jewelry", pct: 20, color: "#f0a070" }, { label: "Other", pct: 15, color: "#fdd9bc" }];
  const r = 15.91; const circumference = 2 * Math.PI * r; let offset = 0;
  return (
    <div className="donut-container">
      <svg width="120" height="120" viewBox="0 0 42 42">
        {segments.map((seg, i) => {
          const dash = (seg.pct / 100) * circumference; const gap = circumference - dash;
          const el = <circle key={i} cx={21} cy={21} r={r} fill="transparent" stroke={seg.color} strokeWidth="6" strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset + circumference * 0.25} />;
          offset += dash; return el;
        })}
        <circle cx={21} cy={21} r="10" fill="white" />
      </svg>
      <div className="donut-legend">{segments.map((l) => <div className="donut-legend-item" key={l.label}><span className="legend-dot" style={{ background: l.color }} />{l.label}</div>)}</div>
    </div>
  );
};

// ─── Period Filter ────────────────────────────────────────────────────────────
const PeriodFilter: React.FC<{ value: Period; onChange: (p: Period) => void }> = ({ value, onChange }) => (
  <div className="period-filter">
    {(["W", "M", "Y"] as Period[]).map((p) => (
      <button key={p} className={`period-btn ${value === p ? "active" : ""}`} onClick={() => onChange(p)}>
        {p === "W" ? "Week" : p === "M" ? "Month" : "Year"}
      </button>
    ))}
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: string; change: string; icon: React.ReactNode }> = ({ label, value, change, icon }) => (
  <div className="stat-card">
    <div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-change">↗ {change}</div></div>
    <div className="stat-icon">{icon}</div>
  </div>
);

// ─── Logout Modal ─────────────────────────────────────────────────────────────
interface LogoutModalProps { onConfirm: () => void; onCancel: () => void; }
const LogoutModal: React.FC<LogoutModalProps> = ({ onConfirm, onCancel }) => (
  <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
    <div className="modal logout-modal">
      <div className="logout-modal-icon"><IC.Logout /></div>
      <div className="modal-title" style={{ textAlign: "center", marginBottom: 8 }}>Sign Out</div>
      <p className="logout-modal-text">Are you sure you want to log out of your Artisans dashboard? Any unsaved changes will be lost.</p>
      <div className="logout-modal-footer">
        <button className="logout-stay-btn" onClick={onCancel}>Stay</button>
        <button className="logout-confirm-btn" onClick={onConfirm}>Yes, Logout</button>
      </div>
    </div>
  </div>
);

// ─── Dashboard Page ───────────────────────────────────────────────────────────
const DashboardPage: React.FC<{ onNavigate: (p: NavPage) => void }> = ({ onNavigate }) => {
  const [revPeriod, setRevPeriod] = useState<Period>("M");
  const [ordPeriod, setOrdPeriod] = useState<Period>("M");
  const statusClass: Record<Order["status"], string> = { Delivered: "status-delivered", Processing: "status-processing", Pending: "status-pending", Shipped: "status-shipped" };
  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Dashboard</div><div className="page-subtitle">Welcome back, Raj! Here's your business overview.</div></div>
      </div>
      <div className="stats-grid">
        <StatCard label="Total Revenue" value="₹16,060" change="3.4% from last month" icon={<IC.Rupee />} />
        <StatCard label="Total Orders" value="158" change="1.97% from last month" icon={<IC.Orders />} />
        <StatCard label="Total Products" value="42" change="7% from last month" icon={<IC.Products />} />
        <StatCard label="Avg Order Value" value="₹2,420" change="2.1% increase" icon={<IC.TrendUp />} />
      </div>
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header"><div className="chart-title">Revenue Trend</div><PeriodFilter value={revPeriod} onChange={setRevPeriod} /></div>
          <BarChartSVG data={revenueDataByPeriod[revPeriod]} labels={labelsByPeriod[revPeriod]} color1="#b5541c" color2="#d47a4a" height={160} valuePrefix="₹" period={revPeriod} />
        </div>
        <div className="chart-card"><div className="chart-title">Products by Category</div><DonutChartSVG /></div>
      </div>
      <div className="bottom-grid">
        <div className="chart-card">
          <div className="chart-card-header"><div className="chart-title">Orders Trend</div><PeriodFilter value={ordPeriod} onChange={setOrdPeriod} /></div>
          <BarChartSVG data={ordersDataByPeriod[ordPeriod]} labels={labelsByPeriod[ordPeriod]} color1="#d4692a" color2="#e8a07a" height={160} period={ordPeriod} />
        </div>
        <div className="chart-card">
          <div className="chart-title">Quick Stats</div>
          <div className="quick-stats-list">
            {[{ label: "Today's Orders", value: "8", accent: false }, { label: "This Week", value: "₹8,920", accent: true }, { label: "This Month", value: "₹16,060", accent: true }, { label: "Conversion Rate", value: "4.8%", accent: false }].map((s) => (
              <div className="quick-stat-row" key={s.label}><span className="quick-stat-label">{s.label}</span><span className={`quick-stat-value ${s.accent ? "" : "neutral"}`}>{s.value}</span></div>
            ))}
          </div>
        </div>
      </div>
      <div className="chart-card" style={{ marginTop: 18 }}>
        <div className="chart-card-header" style={{ marginBottom: 16 }}>
          <div className="chart-title" style={{ marginBottom: 0 }}>Recent Orders</div>
          <button className="view-all-btn" onClick={() => onNavigate("orders")}>View All →</button>
        </div>
        <div className="resp-table-wrap">
          <div className="resp-table">
            <div className="table-header recent-orders-header"><span>Order</span><span>Customer</span><span>Amount</span><span>Date</span><span>Status</span></div>
            {initialOrders.slice(0, 4).map((o) => (
              <div className="table-row recent-orders-row" key={o.id}>
                <span className="cell-bold">{o.id}</span><span className="cell-text">{o.customer}</span>
                <span className="cell-bold">₹{o.amount.toLocaleString()}</span><span className="cell-text cell-muted-sm">{o.date}</span>
                <div><span className={`status-pill ${statusClass[o.status]}`}>{o.status}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Quick nav cards */}
      <div className="quick-nav-grid">
        {([["reviews", "Customer Reviews", "4 new reviews", <IC.Reviews />], ["promotions", "Promotions", "3 active deals", <IC.Promotions />], ["inventory", "Inventory", "2 low stock alerts", <IC.Inventory />], ["analytics", "Analytics", "View insights", <IC.Analytics />]] as [NavPage, string, string, React.ReactNode][]).map(([page, title, sub, icon]) => (
          <button key={page} className="quick-nav-card" onClick={() => onNavigate(page)}>
            <div className="qnc-icon">{icon}</div>
            <div className="qnc-info"><div className="qnc-title">{title}</div><div className="qnc-sub">{sub}</div></div>
            <IC.ChevronRight />
          </button>
        ))}
      </div>
    </>
  );
};

// ─── Product Detail Page ──────────────────────────────────────────────────────
const ProductDetailPage: React.FC<{ product: Product; onBack: () => void; onEdit: (p: Product) => void }> = ({ product, onBack, onEdit }) => (
  <div className="detail-page">
    <button className="detail-back-btn" onClick={onBack}><IC.ArrowLeft /> Back to Products</button>
    <div className="detail-card">
      <div className="product-detail-top">
        <div className="product-detail-image-wrap">
          {product.image ? <img src={product.image} alt={product.name} className="product-detail-image" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <div className="product-detail-placeholder"><IC.Image /></div>}
        </div>
        <div className="product-detail-info">
          <div className="product-detail-category">{product.category}</div>
          <div className="product-detail-name">{product.name}</div>
          <div className="product-detail-price">₹{product.price.toLocaleString()}</div>
          {product.rating && (
            <div className="product-detail-rating">
              {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(product.rating!) ? "#f0a020" : "#e0d4c8" }}><IC.Star /></span>)}
              <span className="rating-num">{product.rating}</span><span className="rating-label">/ 5.0</span>
            </div>
          )}
          <div className="product-detail-desc">{product.description}</div>
          <div className="product-detail-stats">
            <div className="detail-stat-item"><div className="detail-stat-val">{product.stock}</div><div className="detail-stat-lab">In Stock</div></div>
            <div className="detail-stat-item"><div className="detail-stat-val">{product.sold ?? 0}</div><div className="detail-stat-lab">Units Sold</div></div>
            <div className="detail-stat-item"><div className="detail-stat-val">₹{((product.sold ?? 0) * product.price).toLocaleString()}</div><div className="detail-stat-lab">Revenue</div></div>
          </div>
          <div className="detail-actions">
            <button className="btn-primary" onClick={() => onEdit(product)}><IC.Edit /> Edit Product</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Number Input with Validation ─────────────────────────────────────────────
const PositiveNumberInput: React.FC<{ value: number; onChange: (v: number) => void; label: string; prefix?: string; placeholder?: string }> = ({ value, onChange, label, prefix, placeholder }) => {
  const [error, setError] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (v < 0) { setError(`${label} cannot be negative`); onChange(0); }
    else { setError(""); onChange(v); }
  };
  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label">{label}{prefix ? ` (${prefix})` : ""}</label>
      <input className={`form-input ${error ? "input-error" : ""}`} type="number" min="0" value={value} placeholder={placeholder} onChange={handleChange} />
      {error && <div className="input-error-msg"><IC.AlertTriangle /> {error}</div>}
    </div>
  );
};

// ─── Product Modal ────────────────────────────────────────────────────────────
interface ProductModalProps { initial?: Partial<Product>; onClose: () => void; onSave: (p: Omit<Product, "id">) => void; }
const ProductModal: React.FC<ProductModalProps> = ({ initial = {}, onClose, onSave }) => {
  const [name, setName] = useState(initial.name || "");
  const [category, setCategory] = useState(initial.category || "");
  const [price, setPrice] = useState(clampPositive(initial.price || 0));
  const [stock, setStock] = useState(clampPositive(initial.stock || 0));
  const [image, setImage] = useState(initial.image || "");
  const [description, setDescription] = useState(initial.description || "");
  const [errors, setErrors] = useState<string[]>([]);
  const categories = ["Pottery", "Textiles", "Jewelry", "Woodwork", "Paintings", "Metalwork", "Other"];
  const handleSave = () => {
    const errs: string[] = [];
    if (!name.trim()) errs.push("Product name is required");
    if (!category) errs.push("Please select a category");
    if (price <= 0) errs.push("Price must be greater than 0");
    if (stock < 0) errs.push("Stock cannot be negative");
    if (errs.length) { setErrors(errs); return; }
    onSave({ name, category, price, stock, image, description }); onClose();
  };
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header"><div className="modal-title">{initial.name ? "Edit Product" : "Add New Product"}</div><button className="modal-close" onClick={onClose}><IC.X /></button></div>
        {errors.length > 0 && <div className="form-errors">{errors.map(e => <div key={e} className="form-error-item"><IC.AlertTriangle /> {e}</div>)}</div>}
        <div className="form-group"><label className="form-label">Product Name *</label><input className="form-input" placeholder="Enter product name" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="form-row">
          <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Category *</label><select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Select category</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
          <PositiveNumberInput value={price} onChange={setPrice} label="Price" prefix="₹" placeholder="0" />
        </div>
        <div style={{ marginTop: 18 }}><PositiveNumberInput value={stock} onChange={setStock} label="Stock Quantity" placeholder="0" /></div>
        <div className="form-group" style={{ marginTop: 18 }}><label className="form-label">Product Image</label><ImageUpload value={image} onChange={setImage} label="Upload Product Image" /></div>
        <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" placeholder="Product description..." value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="modal-footer"><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={handleSave}>{initial.name ? "Save Changes" : "Add Product"}</button></div>
      </div>
    </div>
  );
};

// ─── Products Page ────────────────────────────────────────────────────────────
const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [viewing, setViewing] = useState<Product | null>(null);
  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
  const addProduct = (p: Omit<Product, "id">) => setProducts((prev) => [...prev, { ...p, id: Date.now() }]);
  const editProduct = (p: Omit<Product, "id">) => { if (!editing) return; setProducts((prev) => prev.map((x) => x.id === editing.id ? { ...x, ...p } : x)); setEditing(null); };
  const deleteProduct = (id: number) => setProducts((prev) => prev.filter((p) => p.id !== id));
  if (viewing) return <ProductDetailPage product={viewing} onBack={() => setViewing(null)} onEdit={(p) => { setViewing(null); setEditing(p); setShowModal(true); }} />;
  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Products</div><div className="page-subtitle">Manage your product inventory</div></div>
        <button className="btn-primary" onClick={() => { setEditing(null); setShowModal(true); }}><IC.Plus /> Add Product</button>
      </div>
      <div className="search-bar-wrap"><IC.Search /><input className="search-input" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <div className="data-table">
        <div className="table-header products-header"><span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Actions</span></div>
        {filtered.length === 0 && <div className="empty-state"><IC.Package /><span>No products found</span></div>}
        {filtered.map((p) => (
          <div className="table-row products-row clickable-row" key={p.id} onClick={() => setViewing(p)}>
            <div className="product-cell">
              {p.image ? <img className="product-thumb" src={p.image} alt={p.name} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <div className="product-thumb-placeholder"><IC.Image /></div>}
              <div><div className="product-name">{p.name}</div><div className="product-desc">{p.description}</div></div>
            </div>
            <span className="cell-text">{p.category}</span>
            <span className="cell-bold">₹{p.price.toLocaleString()}</span>
            <div><span className={`stock-badge ${p.stock === 0 ? "stock-out" : p.stock >= 10 ? "stock-high" : "stock-low"}`}>{p.stock === 0 ? "Out of stock" : `${p.stock} items`}</span></div>
            <div className="row-actions" onClick={(e) => e.stopPropagation()}>
              <button className="action-icon-btn edit-icon" title="Edit" onClick={() => { setEditing(p); setShowModal(true); }}><IC.Edit /></button>
              <button className="action-icon-btn delete-icon" title="Delete" onClick={() => deleteProduct(p.id)}><IC.Trash /></button>
            </div>
          </div>
        ))}
      </div>
      {showModal && <ProductModal initial={editing || {}} onClose={() => { setShowModal(false); setEditing(null); }} onSave={editing ? editProduct : addProduct} />}
    </>
  );
};

// ─── Order Detail Page ────────────────────────────────────────────────────────
const OrderDetailPage: React.FC<{ order: Order; onBack: () => void; onStatusChange: (id: string, status: Order["status"]) => void }> = ({ order, onBack, onStatusChange }) => {
  const statusOptions: Order["status"][] = ["Pending", "Processing", "Shipped", "Delivered"];
  const statusClass: Record<Order["status"], string> = { Delivered: "status-delivered", Processing: "status-processing", Pending: "status-pending", Shipped: "status-shipped" };
  const steps: Order["status"][] = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentStep = steps.indexOf(order.status);
  return (
    <div className="detail-page">
      <button className="detail-back-btn" onClick={onBack}><IC.ArrowLeft /> Back to Orders</button>
      <div className="order-detail-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="detail-card">
            <div className="detail-card-title">Order Summary</div>
            <div className="order-id-row">
              <span className="order-detail-id">{order.id}</span>
              <select className={`status-dropdown ${statusClass[order.status]}`} value={order.status} onChange={(e) => onStatusChange(order.id, e.target.value as Order["status"])}>{statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}</select>
            </div>
            <div className="order-detail-date"><IC.Calendar /> Placed on {order.date}</div>
            <div className="order-progress">
              {steps.map((step, i) => (
                <div key={step} className="progress-step-wrap">
                  <div className={`progress-step ${i <= currentStep ? "done" : ""} ${i === currentStep ? "current" : ""}`}>
                    <div className="progress-dot">{i < currentStep ? <IC.Check /> : i + 1}</div>
                    <div className="progress-label">{step}</div>
                  </div>
                  {i < steps.length - 1 && <div className={`progress-line ${i < currentStep ? "done" : ""}`} />}
                </div>
              ))}
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-card-title">Items Ordered</div>
            {(order.items || []).map((item, i) => (
              <div className="order-item-row" key={i}>
                <div className="order-item-icon"><IC.Package /></div>
                <div className="order-item-info"><div className="order-item-name">{item.name}</div><div className="order-item-qty">Qty: {item.qty}</div></div>
                <div className="order-item-price">₹{(item.price * item.qty).toLocaleString()}</div>
              </div>
            ))}
            <div className="order-total-row"><span>Total Amount</span><span className="order-total-val">₹{order.amount.toLocaleString()}</span></div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="detail-card">
            <div className="detail-card-title">Customer Details</div>
            {[[<IC.User />, "Name", order.customer], [<IC.Mail />, "Email", order.email], ...(order.phone ? [[<IC.Phone />, "Phone", order.phone]] : [])].map(([icon, label, val], i) => (
              <div className="customer-detail-item" key={i}>
                <span className="cust-icon">{icon as React.ReactNode}</span>
                <div><div className="cust-detail-label">{label as string}</div><div className="cust-detail-val">{val as string}</div></div>
              </div>
            ))}
          </div>
          <div className="detail-card">
            <div className="detail-card-title">Delivery Address</div>
            <div className="customer-detail-item"><span className="cust-icon"><IC.MapPin /></span><div><div className="cust-detail-label">Ship to</div><div className="cust-detail-val">{order.address || "Address not available"}</div></div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Orders Page ──────────────────────────────────────────────────────────────
const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | Order["status"]>("All");
  const [viewing, setViewing] = useState<Order | null>(null);
  const statusOptions: Order["status"][] = ["Pending", "Processing", "Shipped", "Delivered"];
  const filtered = orders.filter((o) => {
    const ms = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    return ms && (filter === "All" || o.status === filter);
  });
  const updateStatus = (id: string, status: Order["status"]) => { setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o)); if (viewing?.id === id) setViewing((prev) => prev ? { ...prev, status } : null); };
  const statusClass: Record<Order["status"], string> = { Delivered: "status-delivered", Processing: "status-processing", Pending: "status-pending", Shipped: "status-shipped" };
  if (viewing) { const liveOrder = orders.find((o) => o.id === viewing.id) || viewing; return <OrderDetailPage order={liveOrder} onBack={() => setViewing(null)} onStatusChange={updateStatus} />; }
  return (
    <>
      <div className="page-header"><div><div className="page-title">Orders</div><div className="page-subtitle">Manage and track customer orders</div></div></div>
      <div className="orders-filter-wrap">
        <div className="search-bar-wrap orders-search" style={{ marginBottom: 0, flex: 1 }}><IC.Search /><input className="search-input" placeholder="Search orders or customers..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className="filter-tabs">{(["All", ...statusOptions] as const).map((f) => <button key={f} className={`filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f as typeof filter)}>{f}</button>)}</div>
      </div>
      <div className="data-table">
        <div className="table-header orders-header"><span>Order ID</span><span>Customer</span><span>Amount</span><span>Date</span><span>Status</span><span>Actions</span></div>
        {filtered.length === 0 && <div className="empty-state"><IC.Orders /><span>No orders found</span></div>}
        {filtered.map((o) => (
          <div className="table-row orders-row" key={o.id}>
            <span className="cell-bold">{o.id}</span>
            <div><div className="cell-text" style={{ fontWeight: 500 }}>{o.customer}</div><div className="cell-sub">{o.email}</div></div>
            <span className="cell-bold">₹{o.amount.toLocaleString()}</span>
            <span className="cell-text cell-muted-sm">{o.date}</span>
            <div><select className={`status-dropdown ${statusClass[o.status]}`} value={o.status} onChange={(e) => updateStatus(o.id, e.target.value as Order["status"])}>{statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><button className="view-btn" onClick={() => setViewing(o)}><IC.Eye /> View</button></div>
          </div>
        ))}
      </div>
    </>
  );
};

// ─── Story Modal ──────────────────────────────────────────────────────────────
interface StoryModalProps { initial?: Partial<Story>; onClose: () => void; onSave: (s: Omit<Story, "id">) => void; }
const StoryModal: React.FC<StoryModalProps> = ({ initial = {}, onClose, onSave }) => {
  const [title, setTitle] = useState(initial.title || "");
  const [author, setAuthor] = useState(initial.author || "");
  const [excerpt, setExcerpt] = useState(initial.excerpt || "");
  const [image, setImage] = useState(initial.image || "");
  const [featured, setFeatured] = useState(initial.featured || false);
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header"><div className="modal-title">Write Your Story</div><button className="modal-close" onClick={onClose}><IC.X /></button></div>
        <div className="form-group"><label className="form-label">Story Title</label><input className="form-input" placeholder="Give your story a compelling title" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Your Name</label><input className="form-input" placeholder="Your name" value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Your Story</label><textarea className="form-textarea" style={{ minHeight: 130 }} placeholder="Share your journey..." value={excerpt} onChange={(e) => setExcerpt(e.target.value)} /><div className="char-count">{excerpt.length} characters</div></div>
        <div className="form-group"><label className="form-label">Story Image</label><ImageUpload value={image} onChange={setImage} label="Upload Story Image" /></div>
        <div className="form-group"><label className="form-label">Story Date</label><div style={{ position: "relative" }}><input className="form-input" defaultValue={today} style={{ paddingRight: 40 }} /><span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}><IC.Calendar /></span></div></div>
        <div className="form-group"><label className="form-checkbox-row"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /><span className="form-checkbox-label">Mark as Featured Story</span></label></div>
        <div className="modal-footer"><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={() => { onSave({ title, author, excerpt, image, featured, date: new Date().toISOString().split("T")[0] }); onClose(); }}>Publish Story</button></div>
      </div>
    </div>
  );
};

// ─── Story Page ───────────────────────────────────────────────────────────────
const StoryPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Story | null>(null);
  const addStory = (s: Omit<Story, "id">) => setStories((prev) => [...prev, { ...s, id: Date.now() }]);
  const editStory = (s: Omit<Story, "id">) => { if (!editing) return; setStories((prev) => prev.map((x) => x.id === editing.id ? { ...x, ...s } : x)); setEditing(null); };
  const deleteStory = (id: number) => setStories((prev) => prev.filter((s) => s.id !== id));
  return (
    <>
      <div className="page-header"><div><div className="page-title">Your Stories</div><div className="page-subtitle">Share your artisan journey</div></div><button className="btn-primary" onClick={() => setShowModal(true)}><IC.Plus /> New Story</button></div>
      <div className="stories-grid">
        {stories.map((s) => (
          <div className="story-card" key={s.id}>
            <div className="story-image-wrap">
              {s.image ? <img className="story-image" src={s.image} alt={s.title} /> : <div className="story-image-placeholder"><IC.Image /><span>{s.title}</span></div>}
              {s.featured && <span className="featured-badge">Featured</span>}
            </div>
            <div className="story-body">
              <div className="story-title">{s.title}</div>
              <div className="story-excerpt">{s.excerpt}</div>
              <div className="story-meta"><div className="story-author">By {s.author}</div><div className="story-date">{s.date}</div></div>
              <div className="story-actions">
                <button className="story-edit-btn" onClick={() => { setEditing(s); setShowModal(true); }}><IC.Edit /> Edit</button>
                <button className="story-delete-btn" onClick={() => deleteStory(s.id)}><IC.Trash /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && <StoryModal initial={editing || {}} onClose={() => { setShowModal(false); setEditing(null); }} onSave={editing ? editStory : addStory} />}
    </>
  );
};

// ─── Analytics Page ───────────────────────────────────────────────────────────
const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState<Period>("M");
  return (
    <>
      <div className="page-header"><div><div className="page-title">Analytics</div><div className="page-subtitle">Deep dive into your business performance</div></div><PeriodFilter value={period} onChange={setPeriod} /></div>
      <div className="stats-grid">
        <StatCard label="Page Views" value="12,480" change="8.2% this period" icon={<IC.Eye />} />
        <StatCard label="Conversion Rate" value="4.8%" change="0.3% improvement" icon={<IC.TrendUp />} />
        <StatCard label="Avg. Session" value="3m 24s" change="12s longer" icon={<IC.Calendar />} />
        <StatCard label="Return Customers" value="38%" change="5% increase" icon={<IC.Customers />} />
      </div>
      <div className="charts-grid" style={{ marginBottom: 18 }}>
        <div className="chart-card"><div className="chart-card-header"><div className="chart-title">Revenue Performance</div></div><BarChartSVG data={revenueDataByPeriod[period]} labels={labelsByPeriod[period]} color1="#b5541c" color2="#d47a4a" height={180} valuePrefix="₹" period={period} /></div>
        <div className="chart-card"><div className="chart-card-header"><div className="chart-title">Order Volume</div></div><BarChartSVG data={ordersDataByPeriod[period]} labels={labelsByPeriod[period]} color1="#d4692a" color2="#e8a07a" height={180} period={period} /></div>
      </div>
      <div className="chart-card" style={{ marginBottom: 18 }}>
        <div className="chart-title">Top Performing Products</div>
        {initialProducts.map((p, i) => (
          <div className="analytics-product-row" key={p.id}>
            <div className="ap-rank">#{i + 1}</div>
            {p.image && <img src={p.image} className="ap-thumb" alt={p.name} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
            <div className="ap-info"><div className="ap-name">{p.name}</div><div className="ap-cat">{p.category}</div></div>
            <div className="ap-stats">
              <div className="ap-stat"><span className="ap-stat-val">{p.sold ?? 0}</span><span className="ap-stat-lab">Sold</span></div>
              <div className="ap-stat"><span className="ap-stat-val">₹{((p.sold ?? 0) * p.price).toLocaleString()}</span><span className="ap-stat-lab">Revenue</span></div>
            </div>
            <div className="ap-bar-wrap"><div className="ap-bar" style={{ width: `${Math.round(((p.sold ?? 0) / 50) * 100)}%` }} /></div>
          </div>
        ))}
      </div>
    </>
  );
};

// ─── Customers Page ───────────────────────────────────────────────────────────
const CustomersPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Customer | null>(null);
  const customers = initialCustomers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));
  if (viewing) return (
    <div className="detail-page">
      <button className="detail-back-btn" onClick={() => setViewing(null)}><IC.ArrowLeft /> Back to Customers</button>
      <div className="order-detail-grid">
        <div className="detail-card">
          <div className="settings-avatar-row"><div className="settings-avatar">{viewing.name.charAt(0)}</div><div><div style={{ fontWeight: 700, fontSize: 17 }}>{viewing.name}</div><div style={{ color: "var(--text-muted)", fontSize: 13 }}>Customer since {viewing.joined}</div></div></div>
          <div className="detail-card-title" style={{ marginTop: 16 }}>Contact Info</div>
          {[[<IC.Mail />, "Email", viewing.email], [<IC.Phone />, "Phone", viewing.phone], [<IC.MapPin />, "Location", viewing.location]].map(([icon, label, val], i) => (
            <div className="customer-detail-item" key={i}><span className="cust-icon">{icon as React.ReactNode}</span><div><div className="cust-detail-label">{label as string}</div><div className="cust-detail-val">{val as string}</div></div></div>
          ))}
        </div>
        <div className="detail-card">
          <div className="detail-card-title">Purchase Summary</div>
          <div className="product-detail-stats" style={{ marginBottom: 0 }}>
            <div className="detail-stat-item"><div className="detail-stat-val">{viewing.orders}</div><div className="detail-stat-lab">Total Orders</div></div>
            <div className="detail-stat-item"><div className="detail-stat-val">₹{viewing.spent.toLocaleString()}</div><div className="detail-stat-lab">Total Spent</div></div>
            <div className="detail-stat-item"><div className="detail-stat-val">₹{Math.round(viewing.spent / viewing.orders).toLocaleString()}</div><div className="detail-stat-lab">Avg Order</div></div>
          </div>
          <div className="customer-orders-list" style={{ marginTop: 18 }}>
            <div className="detail-card-title">Recent Orders</div>
            {initialOrders.filter(o => o.customer === viewing.name).map(o => (
              <div className="order-item-row" key={o.id}>
                <div className="order-item-icon"><IC.Package /></div>
                <div className="order-item-info"><div className="order-item-name">{o.id}</div><div className="order-item-qty">{o.date}</div></div>
                <span className={`status-pill ${o.status === "Delivered" ? "status-delivered" : o.status === "Processing" ? "status-processing" : o.status === "Shipped" ? "status-shipped" : "status-pending"}`}>{o.status}</span>
                <div className="order-item-price">₹{o.amount.toLocaleString()}</div>
              </div>
            ))}
            {initialOrders.filter(o => o.customer === viewing.name).length === 0 && <div className="empty-state"><IC.Orders /><span>No orders yet</span></div>}
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <div className="page-header"><div><div className="page-title">Customers</div><div className="page-subtitle">View and manage your customer base</div></div></div>
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <StatCard label="Total Customers" value="248" change="12 new this month" icon={<IC.Customers />} />
        <StatCard label="Returning Rate" value="38%" change="5% increase" icon={<IC.TrendUp />} />
        <StatCard label="Avg. Spend" value="₹4,260" change="3% higher" icon={<IC.Rupee />} />
        <StatCard label="Top Location" value="Mumbai" change="32% of orders" icon={<IC.MapPin />} />
      </div>
      <div className="search-bar-wrap"><IC.Search /><input className="search-input" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <div className="data-table">
        <div className="table-header customers-header"><span>Customer</span><span>Location</span><span>Orders</span><span>Total Spent</span><span>Action</span></div>
        {customers.map((c) => (
          <div className="table-row customers-row clickable-row" key={c.id} onClick={() => setViewing(c)}>
            <div className="customer-cell"><div className="customer-avatar">{c.name.charAt(0)}</div><div><div className="product-name">{c.name}</div><div className="product-desc">{c.email}</div></div></div>
            <span className="cell-text">{c.location}</span>
            <span className="cell-text">{c.orders} orders</span>
            <span className="cell-bold">₹{c.spent.toLocaleString()}</span>
            <div><button className="view-btn" onClick={(e) => { e.stopPropagation(); setViewing(c); }}><IC.Eye /> View</button></div>
          </div>
        ))}
      </div>
    </>
  );
};

// ─── Reviews Page ─────────────────────────────────────────────────────────────
const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState<"All" | "Replied" | "Pending">("All");
  const avgRating = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
  const filtered = reviews.filter(r => filter === "All" ? true : filter === "Replied" ? r.replied : !r.replied);
  const markReplied = (id: number) => { setReviews(prev => prev.map(r => r.id === id ? { ...r, replied: true } : r)); setReplyingId(null); setReplyText(""); };
  const renderStars = (n: number) => [1,2,3,4,5].map(i => <span key={i} style={{ color: i <= n ? "#f0a020" : "#e0d4c8", fontSize: 13 }}><IC.Star /></span>);
  return (
    <>
      <div className="page-header"><div><div className="page-title">Customer Reviews</div><div className="page-subtitle">Manage and respond to customer feedback</div></div></div>
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 24 }}>
        <StatCard label="Avg. Rating" value={`${avgRating} / 5`} change="Based on all reviews" icon={<IC.Reviews />} />
        <StatCard label="Total Reviews" value={`${reviews.length}`} change="2 new this week" icon={<IC.Customers />} />
        <StatCard label="Pending Replies" value={`${reviews.filter(r => !r.replied).length}`} change="Need your response" icon={<IC.Bell />} />
      </div>
      <div className="filter-row"><div className="filter-tabs">{(["All","Replied","Pending"] as const).map(f => <button key={f} className={`filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>)}</div></div>
      <div className="reviews-list">
        {filtered.map(r => (
          <div className="review-card" key={r.id}>
            <div className="review-top">
              <div className="review-customer-info">
                <div className="customer-avatar sm">{r.customer.charAt(0)}</div>
                <div><div className="review-customer-name">{r.customer}</div><div className="review-product">{r.product}</div></div>
              </div>
              <div className="review-meta">
                <div className="review-stars">{renderStars(r.rating)}</div>
                <div className="review-date">{r.date}</div>
                {r.replied ? <span className="replied-badge"><IC.Check /> Replied</span> : <span className="pending-badge">Awaiting Reply</span>}
              </div>
            </div>
            <p className="review-comment">"{r.comment}"</p>
            {!r.replied && (
              replyingId === r.id ? (
                <div className="reply-area">
                  <textarea className="form-textarea" style={{ minHeight: 70 }} placeholder="Write your reply..." value={replyText} onChange={e => setReplyText(e.target.value)} />
                  <div className="reply-actions">
                    <button className="btn-secondary" onClick={() => { setReplyingId(null); setReplyText(""); }}>Cancel</button>
                    <button className="btn-primary" onClick={() => markReplied(r.id)}><IC.Reply /> Send Reply</button>
                  </div>
                </div>
              ) : (
                <button className="reply-btn" onClick={() => setReplyingId(r.id)}><IC.Reply /> Reply to this review</button>
              )
            )}
          </div>
        ))}
      </div>
    </>
  );
};

// ─── Promotions Page ──────────────────────────────────────────────────────────
const PromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", discount: 0, type: "percent" as "percent"|"flat", minOrder: 0, maxUses: 50, expiry: "" });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const toggleActive = (id: number) => setPromotions(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  const deletePromo = (id: number) => setPromotions(prev => prev.filter(p => p.id !== id));
  const handleAdd = () => {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push("Promotion name required");
    if (!form.code.trim()) errs.push("Coupon code required");
    if (form.discount <= 0) errs.push("Discount must be > 0");
    if (form.type === "percent" && form.discount > 100) errs.push("Percentage discount cannot exceed 100%");
    if (form.minOrder < 0) errs.push("Minimum order cannot be negative");
    if (errs.length) { setFormErrors(errs); return; }
    setPromotions(prev => [...prev, { ...form, id: Date.now(), uses: 0, active: true }]);
    setShowModal(false); setForm({ name: "", code: "", discount: 0, type: "percent", minOrder: 0, maxUses: 50, expiry: "" }); setFormErrors([]);
  };
  return (
    <>
      <div className="page-header"><div><div className="page-title">Promotions</div><div className="page-subtitle">Manage discount codes and offers</div></div><button className="btn-primary" onClick={() => setShowModal(true)}><IC.Plus /> New Promo</button></div>
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 24 }}>
        <StatCard label="Active Promos" value={`${promotions.filter(p=>p.active).length}`} change="Currently running" icon={<IC.Tag />} />
        <StatCard label="Total Redemptions" value={`${promotions.reduce((a,p)=>a+p.uses,0)}`} change="Across all codes" icon={<IC.RefreshCw />} />
        <StatCard label="Avg. Discount" value={`${Math.round(promotions.filter(p=>p.type==="percent").reduce((a,p)=>a+p.discount,0) / Math.max(1,promotions.filter(p=>p.type==="percent").length))}%`} change="Percent-type codes" icon={<IC.TrendUp />} />
      </div>
      <div className="promos-grid">
        {promotions.map(p => (
          <div key={p.id} className={`promo-card ${!p.active ? "promo-inactive" : ""}`}>
            <div className="promo-header">
              <div className="promo-badge-wrap"><div className="promo-icon"><IC.Tag /></div><div><div className="promo-name">{p.name}</div><div className="promo-code">{p.code}</div></div></div>
              <div className="promo-toggle-wrap">
                <label className="toggle"><input type="checkbox" checked={p.active} onChange={() => toggleActive(p.id)} /><span className="toggle-slider" /></label>
              </div>
            </div>
            <div className="promo-discount">{p.type === "percent" ? `${p.discount}% OFF` : `₹${p.discount} OFF`}</div>
            <div className="promo-details">
              <div className="promo-detail-item"><span>Min order</span><span>₹{p.minOrder.toLocaleString()}</span></div>
              <div className="promo-detail-item"><span>Uses</span><span>{p.uses}/{p.maxUses}</span></div>
              <div className="promo-detail-item"><span>Expires</span><span>{p.expiry}</span></div>
            </div>
            <div className="promo-bar-wrap"><div className="promo-bar" style={{ width: `${Math.min(100, (p.uses/p.maxUses)*100)}%`, background: p.uses >= p.maxUses ? "var(--danger-text)" : "var(--accent)" }} /></div>
            <div className="promo-actions"><button className="story-delete-btn" onClick={() => deletePromo(p.id)}><IC.Trash /> Delete</button></div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); setFormErrors([]); } }}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">Create Promotion</div><button className="modal-close" onClick={() => { setShowModal(false); setFormErrors([]); }}><IC.X /></button></div>
            {formErrors.length > 0 && <div className="form-errors">{formErrors.map(e => <div key={e} className="form-error-item"><IC.AlertTriangle /> {e}</div>)}</div>}
            <div className="form-group"><label className="form-label">Promotion Name *</label><input className="form-input" placeholder="e.g. Summer Sale" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-row">
              <div className="form-group" style={{marginBottom:0}}><label className="form-label">Coupon Code *</label><input className="form-input" placeholder="e.g. SAVE20" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} /></div>
              <div className="form-group" style={{marginBottom:0}}><label className="form-label">Discount Type</label><select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as "percent"|"flat" }))}><option value="percent">Percentage (%)</option><option value="flat">Flat (₹)</option></select></div>
            </div>
            <div className="form-row" style={{marginTop:18}}>
              <PositiveNumberInput value={form.discount} onChange={v => setForm(f=>({...f,discount:v}))} label="Discount Value" placeholder="0" />
              <PositiveNumberInput value={form.minOrder} onChange={v => setForm(f=>({...f,minOrder:v}))} label="Min Order" prefix="₹" placeholder="0" />
            </div>
            <div className="form-row" style={{marginTop:18}}>
              <PositiveNumberInput value={form.maxUses} onChange={v => setForm(f=>({...f,maxUses:v}))} label="Max Uses" placeholder="50" />
              <div className="form-group" style={{marginBottom:0}}><label className="form-label">Expiry Date</label><input className="form-input" type="date" value={form.expiry} onChange={e => setForm(f=>({...f,expiry:e.target.value}))} /></div>
            </div>
            <div className="modal-footer"><button className="btn-secondary" onClick={() => { setShowModal(false); setFormErrors([]); }}>Cancel</button><button className="btn-primary" onClick={handleAdd}>Create Promotion</button></div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Inventory Page ───────────────────────────────────────────────────────────
const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStock, setEditStock] = useState(0);
  const [editError, setEditError] = useState("");
  const lowStock = products.filter(p => p.stock > 0 && p.stock < 10);
  const outOfStock = products.filter(p => p.stock === 0);
  const handleUpdateStock = (id: number) => {
    if (editStock < 0) { setEditError("Stock cannot be negative"); return; }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: editStock } : p));
    setEditingId(null); setEditError("");
  };
  return (
    <>
      <div className="page-header"><div><div className="page-title">Inventory</div><div className="page-subtitle">Monitor and update stock levels</div></div></div>
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <StatCard label="Total SKUs" value={`${products.length}`} change="Active products" icon={<IC.Package />} />
        <StatCard label="In Stock" value={`${products.filter(p=>p.stock>0).length}`} change="Available items" icon={<IC.Check />} />
        <StatCard label="Low Stock" value={`${lowStock.length}`} change="Below 10 units" icon={<IC.AlertTriangle />} />
        <StatCard label="Out of Stock" value={`${outOfStock.length}`} change="Need restocking" icon={<IC.Trash />} />
      </div>
      {lowStock.length > 0 && (
        <div className="alert-banner warning"><IC.AlertTriangle /><span><strong>{lowStock.length} product{lowStock.length > 1 ? "s" : ""} running low:</strong> {lowStock.map(p => p.name).join(", ")}</span></div>
      )}
      {outOfStock.length > 0 && (
        <div className="alert-banner danger"><IC.AlertTriangle /><span><strong>{outOfStock.length} product{outOfStock.length > 1 ? "s" : ""} out of stock:</strong> {outOfStock.map(p => p.name).join(", ")}</span></div>
      )}
      <div className="data-table">
        <div className="table-header inventory-header"><span>Product</span><span>Category</span><span>Current Stock</span><span>Status</span><span>Update Stock</span></div>
        {products.map(p => (
          <div className="table-row inventory-row" key={p.id}>
            <div className="product-cell">
              {p.image ? <img className="product-thumb" src={p.image} alt={p.name} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <div className="product-thumb-placeholder"><IC.Image /></div>}
              <div><div className="product-name">{p.name}</div><div className="product-desc">₹{p.price.toLocaleString()}</div></div>
            </div>
            <span className="cell-text">{p.category}</span>
            <div className="stock-number-wrap">
              <span className="stock-number">{p.stock}</span>
              <div className="mini-stock-bar"><div className="mini-stock-fill" style={{ width: `${Math.min(100,(p.stock/30)*100)}%`, background: p.stock === 0 ? "var(--danger-text)" : p.stock < 10 ? "var(--warning-text)" : "var(--success-text)" }} /></div>
            </div>
            <div><span className={`stock-badge ${p.stock === 0 ? "stock-out" : p.stock >= 10 ? "stock-high" : "stock-low"}`}>{p.stock === 0 ? "Out of Stock" : p.stock < 10 ? "Low Stock" : "In Stock"}</span></div>
            <div className="stock-edit-cell">
              {editingId === p.id ? (
                <div className="stock-edit-form">
                  <input type="number" min="0" className={`stock-edit-input form-input ${editError ? "input-error" : ""}`} value={editStock} onChange={e => { const v = Number(e.target.value); if (v < 0) setEditError("Cannot be negative"); else setEditError(""); setEditStock(v); }} />
                  <button className="btn-primary" style={{padding:"6px 12px",fontSize:12}} onClick={() => handleUpdateStock(p.id)}><IC.Check /></button>
                  <button className="btn-secondary" style={{padding:"6px 12px",fontSize:12}} onClick={() => { setEditingId(null); setEditError(""); }}><IC.X /></button>
                  {editError && <div className="input-error-msg" style={{position:"absolute",top:"100%",left:0,whiteSpace:"nowrap"}}><IC.AlertTriangle /> {editError}</div>}
                </div>
              ) : (
                <button className="action-icon-btn edit-icon" title="Update stock" onClick={() => { setEditingId(p.id); setEditStock(p.stock); setEditError(""); }}><IC.Edit /> <span style={{fontSize:12,marginLeft:4}}>Edit</span></button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// ─── Settings Page ────────────────────────────────────────────────────────────
const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"profile"|"store"|"notifications"|"security"|"payments">("profile");
  const [shopName, setShopName] = useState("Artisan Crafts");
  const [bio, setBio] = useState("Handcrafted with love from Rajasthan.");
  const [email, setEmail] = useState("artisan@example.com");
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const tabs = [
    { id: "profile" as const, label: "Profile", icon: <IC.User /> },
    { id: "store" as const, label: "Store", icon: <IC.Store /> },
    { id: "notifications" as const, label: "Notifications", icon: <IC.Bell /> },
    { id: "security" as const, label: "Security", icon: <IC.Shield /> },
    { id: "payments" as const, label: "Payments", icon: <IC.CreditCard /> },
  ];
  return (
    <>
      <div className="page-header"><div><div className="page-title">Settings</div><div className="page-subtitle">Manage your account and preferences</div></div></div>
      <div className="settings-layout">
        <div className="settings-sidebar">
          {tabs.map((t) => <button key={t.id} className={`settings-tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>{t.icon} {t.label}</button>)}
        </div>
        <div className="settings-content">
          {activeTab === "profile" && (
            <div className="detail-card">
              <div className="detail-card-title">Profile Information</div>
              <div className="settings-avatar-row"><div className="settings-avatar">R</div><div><div style={{ fontWeight: 600, fontSize: 15 }}>Raj Kumar</div><div style={{ color: "var(--text-muted)", fontSize: 13 }}>Artisan Seller since 2022</div></div></div>
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" defaultValue="Raj Kumar" /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" defaultValue="+91 98765 43210" /></div>
              <div className="form-group"><label className="form-label">Bio</label><textarea className="form-textarea" value={bio} onChange={(e) => setBio(e.target.value)} /></div>
              <button className={`btn-primary ${saved ? "btn-saved" : ""}`} onClick={handleSave}>{saved ? "✓ Saved!" : "Save Changes"}</button>
            </div>
          )}
          {activeTab === "store" && (
            <div className="detail-card">
              <div className="detail-card-title">Store Settings</div>
              <div className="form-group"><label className="form-label">Shop Name</label><input className="form-input" value={shopName} onChange={(e) => setShopName(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Shop Category</label><select className="form-select"><option>Handicrafts & Pottery</option><option>Textiles & Weaving</option><option>Jewelry & Accessories</option><option>Woodwork & Furniture</option></select></div>
              <div className="form-group"><label className="form-label">Shop Location</label><input className="form-input" defaultValue="Jaipur, Rajasthan" /></div>
              <div className="form-group"><label className="form-label">Shop Banner</label><ImageUpload value="" onChange={() => {}} label="Upload Shop Banner" /></div>
              <button className="btn-primary" onClick={handleSave}>{saved ? "✓ Saved!" : "Save Changes"}</button>
            </div>
          )}
          {activeTab === "notifications" && (
            <div className="detail-card">
              <div className="detail-card-title">Notification Preferences</div>
              {[{ label: "New Order Received", desc: "Get notified when a customer places an order", defaultChecked: true }, { label: "Order Status Updates", desc: "Notifications when order status changes", defaultChecked: true }, { label: "Low Stock Alerts", desc: "Alert when product stock falls below 5 units", defaultChecked: true }, { label: "Weekly Summary", desc: "Receive a weekly digest of your performance", defaultChecked: false }, { label: "Promotional Emails", desc: "Tips, updates, and marketing suggestions", defaultChecked: false }].map((n) => (
                <div className="notif-row" key={n.label}>
                  <div><div className="notif-label">{n.label}</div><div className="notif-desc">{n.desc}</div></div>
                  <label className="toggle"><input type="checkbox" defaultChecked={n.defaultChecked} /><span className="toggle-slider" /></label>
                </div>
              ))}
            </div>
          )}
          {activeTab === "security" && (
            <div className="detail-card">
              <div className="detail-card-title">Security Settings</div>
              <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" placeholder="Enter current password" /></div>
              <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" placeholder="Enter new password" /></div>
              <div className="form-group"><label className="form-label">Confirm New Password</label><input className="form-input" type="password" placeholder="Confirm new password" /></div>
              <div className="security-note"><IC.Shield /> Use at least 8 characters with a mix of letters, numbers and symbols.</div>
              <button className="btn-primary">Update Password</button>
            </div>
          )}
          {activeTab === "payments" && (
            <div className="detail-card">
              <div className="detail-card-title">Payment & Payout Settings</div>
              <div className="form-group"><label className="form-label">Bank Account Number</label><input className="form-input" defaultValue="XXXX XXXX XXXX 4521" /></div>
              <div className="form-group"><label className="form-label">IFSC Code</label><input className="form-input" defaultValue="HDFC0001234" /></div>
              <div className="form-group"><label className="form-label">Account Holder Name</label><input className="form-input" defaultValue="Raj Kumar" /></div>
              <div className="form-group"><label className="form-label">UPI ID</label><input className="form-input" defaultValue="rajkumar@upi" /></div>
              <div className="payment-note"><IC.CreditCard /> Payouts every Monday. Minimum payout: ₹500.</div>
              <button className="btn-primary">Save Payment Details</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── Root Component ───────────────────────────────────────────────────────────
const SellerDashboard: React.FC = () => {
  const [page, setPage] = useState<NavPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  const navGroups = [
    {
      label: "Main",
      items: [
        { id: "dashboard" as NavPage, label: "Dashboard", icon: <IC.Dashboard /> },
        { id: "products" as NavPage, label: "Products", icon: <IC.Products /> },
        { id: "orders" as NavPage, label: "Orders", icon: <IC.Orders /> },
      ],
    },
    {
      label: "Manage",
      items: [
        { id: "inventory" as NavPage, label: "Inventory", icon: <IC.Inventory /> },
        { id: "promotions" as NavPage, label: "Promotions", icon: <IC.Promotions /> },
        { id: "reviews" as NavPage, label: "Reviews", icon: <IC.Reviews /> },
      ],
    },
    {
      label: "Insights",
      items: [
        { id: "analytics" as NavPage, label: "Analytics", icon: <IC.Analytics /> },
        { id: "customers" as NavPage, label: "Customers", icon: <IC.Customers /> },
        { id: "story" as NavPage, label: "Stories", icon: <IC.Story /> },
      ],
    },
    {
      label: "Account",
      items: [
        { id: "settings" as NavPage, label: "Settings", icon: <IC.Settings /> },
      ],
    },
  ];

  const handleNav = (id: NavPage) => { setPage(id); setSidebarOpen(false); };
  const handleLogout = () => setLoggedOut(true);

  if (loggedOut) {
    return (
      <div className="logged-out-screen">
        <div className="lo-card">
          <div className="logo-icon lo-icon">A</div>
          <div className="lo-title">You've been logged out</div>
          <div className="lo-sub">Thank you for using Artisans Dashboard.</div>
          <button className="btn-primary" onClick={() => setLoggedOut(false)}>Sign back in</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">A</div>
          <span>Artisans</span>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}><IC.X /></button>
        </div>
        <nav className="sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.label} className="nav-group">
              <div className="nav-group-label">{group.label}</div>
              {group.items.map((item) => (
                <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => handleNav(item.id)}>
                  {item.icon}{item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => { setSidebarOpen(false); setShowLogout(true); }}><IC.Logout />Logout</button>
        </div>
      </aside>

      <div className="main-content">
        <div className="mobile-topbar">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}><IC.Menu /></button>
          <div className="mobile-logo"><div className="logo-icon" style={{ width: 28, height: 28, fontSize: 13 }}>A</div><span>Artisans</span></div>
          <button className="mobile-logout-btn" onClick={() => setShowLogout(true)}><IC.Logout /></button>
        </div>
        <div className="content-area">
          {page === "dashboard" && <DashboardPage onNavigate={handleNav} />}
          {page === "products" && <ProductsPage />}
          {page === "orders" && <OrdersPage />}
          {page === "analytics" && <AnalyticsPage />}
          {page === "customers" && <CustomersPage />}
          {page === "story" && <StoryPage />}
          {page === "settings" && <SettingsPage />}
          {page === "reviews" && <ReviewsPage />}
          {page === "promotions" && <PromotionsPage />}
          {page === "inventory" && <InventoryPage />}
        </div>
      </div>

      {showLogout && <LogoutModal onConfirm={handleLogout} onCancel={() => setShowLogout(false)} />}
    </div>
  );
};

export default SellerDashboard;