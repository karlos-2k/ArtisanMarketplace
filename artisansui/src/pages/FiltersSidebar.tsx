import { products } from "../products";
import "./FilterSidebar.css";

const FilterSidebar = ({ setCategory, setRating }: any) => {

  /* GET UNIQUE CATEGORIES */

 const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="sidebar">

      <h3>Filter Options</h3>

      {/* Categories */}

      <div className="filter-group">

        <h4>Categories</h4>

        {categories.map((cat) => (
          <label key={cat}>
            <input
              type="radio"
              name="category"
              onChange={() => setCategory(cat)}
            />
            {cat}
          </label>
        ))}

      </div>

      {/* Ratings */}

      <div className="filter-group">

        <h4>Rating</h4>

        {[5,4,3,2].map((rate) => (
          <label key={rate}>
            <input
              type="radio"
              name="rating"
              onChange={() => setRating(rate)}
            />
            {rate} ⭐ & above
          </label>
        ))}

      </div>

    </div>
  );
};

export default FilterSidebar;