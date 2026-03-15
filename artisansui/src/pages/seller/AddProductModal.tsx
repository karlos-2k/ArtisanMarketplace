import { useState } from "react";
import { addSellerProduct } from "../../api/sellerProductApi";

interface PreviewImage {
  file: File;
  url: string;
}

const AddProductModal = ({ onClose, onSaved }: any) => {
  const [images, setImages] = useState<PreviewImage[]>([]);

  /* ADD IMAGES (APPEND, NOT REPLACE) */
  const onSelectImages = (files: FileList | null) => {
    if (!files) return;

    const newImages: PreviewImage[] = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  /* REMOVE IMAGE */
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* SUBMIT */
  const submit = async (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target);

    // 🔥 SEND IMAGES (FIRST IMAGE = MAIN IMAGE)
    images.forEach((img) => form.append("images", img.file));

    await addSellerProduct(form);
    onSaved();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <form className="modal-card large" onSubmit={submit}>
        {/* CLOSE */}
        <button type="button" className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>Add Product</h2>

        <input name="name" placeholder="Product Name" required />
        <input name="category" placeholder="Category" required />
        <input name="price" type="number" placeholder="Price" required />
        <input name="stock" type="number" placeholder="Stock" required />
        <textarea name="description" placeholder="Description" />

        {/* MAIN IMAGE */}
        <h4>Main Image</h4>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onSelectImages(e.target.files)}
        />

        {/* OTHER IMAGES */}
        <h4>Other Images</h4>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => onSelectImages(e.target.files)}
        />

        {/* IMAGE PREVIEW */}
        {images.length > 0 && (
          <>
            <h4>Preview (First image = Main)</h4>
            <div className="image-preview-row">
              {images.map((img, i) => (
                <div key={i} className="preview-box">
                  <img
                    src={img.url}
                    alt="preview"
                    className={`image-preview ${i === 0 ? "main" : ""}`}
                  />
                  {i === 0 && <span className="badge">Main</span>}
                  <button
                    type="button"
                    className="remove-img"
                    onClick={() => removeImage(i)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <button className="primary-btn">Save Product</button>
      </form>
    </div>
  );
};

export default AddProductModal;
