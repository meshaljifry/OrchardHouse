import React, { useState, useEffect } from 'react';
import { Button, Input } from '@nextui-org/react';
import { FaShoppingCart } from 'react-icons/fa'; // Import cart icon from react-icons
import './products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false); // State to toggle cart visibility

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Item');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const productInCart = prevCart.find((item) => item.id === product.id);
      if (productInCart) {
        // Update quantity if product already in cart
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new product to cart
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const handleCartQuantityChange = (productId, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-container">
      <h2 className="products-title">Products</h2>

      <div className="top-bar">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          clearable
          bordered
          fullWidth
        />
        <button className="cart-icon" onClick={toggleCart}>
          <FaShoppingCart size={24} />
        </button>
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

      {/* Shopping Cart Dropdown/Modal */}
      {isCartOpen && (
        <div className="cart-dropdown">
          <h2 className="cart-title">Shopping Cart</h2>
          {cart.length > 0 ? (
            <div>
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <span>{item.name}</span>
                  <div className="quantity-controls">
                    <button
                      className="quantity-button"
                      onClick={() => handleCartQuantityChange(item.id, -1)}
                    >
                      -
                    </button>
                    <Input
                      type="number"
                      value={item.quantity}
                      readOnly
                      className="quantity-input"
                    />
                    <button
                      className="quantity-button"
                      onClick={() => handleCartQuantityChange(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <p className="total">Total: ${calculateTotal()}</p>
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
