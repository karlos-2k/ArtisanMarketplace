import { updateSellerProduct } from "../../api/sellerProductApi";

const EditProductModal = ({ product, onClose, onSaved }: any) => {
  const submit = async (e: any) => {
    e.preventDefault();
    const f = new FormData(e.target);

    await updateSellerProduct(product.id, {
      name: f.get("name") as string,
      price: Number(f.get("price")),
      stock: Number(f.get("stock")),
    });

    onSaved();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="modal-card"
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose}>
          ×
        </button>

        <h2>Edit Product</h2>
        <input name="name" defaultValue={product.name} />
        <input name="price" defaultValue={product.price} />
        <input name="stock" defaultValue={product.stock} />

        <button className="primary-btn">Update</button>
      </form>
    </div>
  );
};

export default EditProductModal;
