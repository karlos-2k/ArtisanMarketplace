import React, { useState, useMemo, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./AdminPanel.css";

interface OrderItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  status: "Paid" | "Shipped" | "Pending";
  img: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  img: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>;
};

const MetricCard = ({ label, val, up }: any) => (
  <div className="metric-card">
    <span className="metric-label">{label}</span>
    <div className="metric-value">
      {val} {up && <span className="metric-up">↗</span>}
    </div>
  </div>
);

const SummaryTile = ({ label, val, isDark }: any) => (
  <div className={isDark ? "summary-total" : "summary-tile"}>
    <span className="summary-label">{label}</span>
    <span className="summary-value">{val}</span>
  </div>
);

const AdminPanel: React.FC = () => {

const [adminName,setAdminName] = useState("Maria G.")
const [activeTab,setActiveTab] = useState("Orders")
const [searchTerm,setSearchTerm] = useState("")

const invoiceRef = useRef<HTMLDivElement>(null)

const [items,setItems] = useState<OrderItem[]>([
{
id:"4553-A",
name:"Cotton Top",
size:"L",
quantity:2,
price:50,
status:"Paid",
img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100"
},
{
id:"4553-B",
name:"Ceramic Bowl",
size:"M",
quantity:1,
price:75,
status:"Shipped",
img:"https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=100"
}
])

const [products] = useState<Product[]>([
{
id:"P1",
name:"Handwoven Basket",
category:"Decor",
stock:12,
price:45,
img:"https://images.unsplash.com/photo-1591034360309-242194600647?w=200"
},
{
id:"P2",
name:"Clay Vase",
category:"Pottery",
stock:5,
price:85,
img:"https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=200"
}
])

const filteredOrders = useMemo(()=>{
return items.filter(item =>
item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
item.id.toLowerCase().includes(searchTerm.toLowerCase())
)
},[items,searchTerm])

const subtotal = filteredOrders.reduce(
(acc,i)=> acc + i.price * i.quantity ,0
)

const updateQty=(id:string,delta:number)=>{
setItems(prev =>
prev.map(i =>
i.id===id
? {...i, quantity: Math.max(1,i.quantity+delta)}
: i
)
)
}

const deleteItem=(id:string)=>{
setItems(prev=>prev.filter(i=>i.id!==id))
}

const downloadPDF= async ()=>{
const element = invoiceRef.current
if(!element) return

const canvas = await html2canvas(element)
const img = canvas.toDataURL("image/png")

const pdf = new jsPDF()
const width = pdf.internal.pageSize.getWidth()
const height = (canvas.height * width) / canvas.width

pdf.addImage(img,"PNG",0,0,width,height)
pdf.save("invoice.pdf")
}

return (

<div className="admin-window">

<aside className="sidebar">

<div className="logo-area">
<div className="logo-square">A</div>
<span className="logo-text">Artisan</span>
</div>

<nav className="nav-stack">

{["Dashboard","Orders","Products","Customers","Settings"].map(tab=>(
<div
key={tab}
className={`nav-item ${activeTab===tab?"active":""}`}
onClick={()=>setActiveTab(tab)}
>
{tab}
</div>
))}

</nav>

</aside>

<main className="main-container">

<header className="top-header">

<div className="search-container">
<span>🔍</span>
<input
className="search-input"
placeholder="Search..."
value={searchTerm}
onChange={(e)=>setSearchTerm(e.target.value)}
/>
</div>

<div className="user-profile">
<img src="https://i.pravatar.cc/40"/>
<span>{adminName}</span>
</div>

</header>

<div className="stats-row">

<MetricCard label="Monthly Revenue" val="$42.5K" up/>
<MetricCard label="Active Orders" val={items.length}/>
<MetricCard label="New Artisans" val="12"/>
<MetricCard label="Rating" val="4.9 ★"/>

</div>

{activeTab==="Orders" && (

<div className="main-card" ref={invoiceRef}>

<div className="card-top">

<h2>Order Details</h2>

<button className="btn-outline" onClick={downloadPDF}>
Download Invoice
</button>

</div>

<table className="table">

<thead>
<tr>
<th>Product</th>
<th>Name</th>
<th>Size</th>
<th>Qty</th>
<th>Price</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{filteredOrders.map(item=>(
<tr key={item.id}>

<td>
<img src={item.img} className="admin-product-img"/>
</td>

<td>{item.name}</td>

<td>{item.size}</td>

<td>

<div className="qty-box">

<button onClick={()=>updateQty(item.id,-1)}>-</button>

<span>{item.quantity}</span>

<button onClick={()=>updateQty(item.id,1)}>+</button>

</div>

</td>

<td>${(item.price * item.quantity).toFixed(2)}</td>

<td>
<StatusBadge status={item.status}/>
</td>

<td>
<button className="delete-btn" onClick={()=>deleteItem(item.id)}>
Delete
</button>
</td>

</tr>
))}

</tbody>

</table>

<div className="summary-grid">

<SummaryTile label="Subtotal" val={`$${subtotal.toFixed(2)}`}/>
<SummaryTile label="Delivery" val="$20"/>
<SummaryTile label="Total" val={`$${(subtotal+20).toFixed(2)}`} isDark/>

</div>

</div>

)}

</main>

</div>

)

}

export default AdminPanel