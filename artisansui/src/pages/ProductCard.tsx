import "./ProductCard.css";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }: any) => {

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  return (
    <div className="product-card">

      <div className="product-image">
        <span className="badge">{product.discount}</span>
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">

        <p className="category">{product.category}</p>

        <h4>{product.name}</h4>

        <div className="rating">⭐ {product.rating}</div>

        <div className="price">
          <span className="new">${product.price}</span>
          <span className="old">${product.oldPrice}</span>
        </div>

        {/* ADD TO CART BUTTON */}

        <button
          className="add-cart-btn"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

      </div>

    </div>
  );
};

export default ProductCard;