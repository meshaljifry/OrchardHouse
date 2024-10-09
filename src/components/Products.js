import React, { useState, useEffect } from 'react';
import { Button, Input } from '@nextui-org/react';
import './products.css'; // Import the CSS file

const Products = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Item');
        const data = await response.json();

        setProducts(data);

        const initialQuantities = data.reduce((acc, product) => {
          acc[product.id] = 1;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, delta) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, prevQuantities[productId] + delta),
    }));
  };

  const addToCart = (product) => {
    alert(`Added ${quantities[product.id]} of ${product.name} to the cart!`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-container">
      <h2 className="products-title">Products</h2>
      
      <div className="search-bar">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          clearable
          bordered
          fullWidth
        />
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} className="image" />
              </div>

              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>

                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(product.id, -1)}
                  >
                    -
                  </button>
                  <Input
                    type="number"
                    value={quantities[product.id]}
                    readOnly
                    className="quantity-input"
                  />
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(product.id, 1)}
                  >
                    +
                  </button>
                </div>

                <Button
                  auto
                  color="primary"
                  className="add-to-cart-button"
                  onClick={() => addToCart(product)}
                >
                  Add To Cart
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No products found...</p>
        )}
      </div>
    </div>
  );
};

export default Products;
