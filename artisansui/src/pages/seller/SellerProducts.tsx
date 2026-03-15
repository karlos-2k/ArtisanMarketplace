import { useEffect, useState } from "react";
import {
  getSellerProducts,
  deleteSellerProduct,
  sellerImageUrl,
} from "../../api/sellerProductApi";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import { Pencil, Trash2 } from "lucide-react";

const SellerProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  const load = async () => {
    const data = await getSellerProducts();
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      {/* HEADER */}
      <div className="page-header">
        <h1 className="seller-page-title">Products</h1>
        <button className="primary-btn" onClick={() => setAddOpen(true)}>
          + Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <table className="seller-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th className="center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                {/* MAIN IMAGE */}
                <td>
                  {p.mainImageId ? (
                    <img
                      src={sellerImageUrl(p.mainImageId)}
                      alt={p.name}
                      className="product-thumb"
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </td>

                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>

                {/* ACTIONS */}
                <td className="center">
                  <div className="action-icons">
                    <button
                      className="icon-btn edit"
                      title="Edit"
                      onClick={() => setEditProduct(p)}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="icon-btn delete"
                      title="Delete"
                      onClick={async () => {
                        await deleteSellerProduct(p.id);
                        load();
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-row">
                  No products added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      {addOpen && (
        <AddProductModal onClose={() => setAddOpen(false)} onSaved={load} />
      )}

      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSaved={load}
        />
      )}
    </>
  );
};

export default SellerProducts;
