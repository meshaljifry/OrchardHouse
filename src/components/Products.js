import React, { useState, useEffect, useRef } from 'react'; 
import { Button, Input, Modal, Spacer } from '@nextui-org/react';
import { FaShoppingCart } from 'react-icons/fa';
import './products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const cartRef = useRef(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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
    setCart((prevCart) => [
      ...prevCart,
      { ...product, cartItemId: `${product.id}-${Date.now()}`, quantity: 1 }
    ]);
  };

  const handleCartQuantityChange = (cartItemId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const scrollToCart = () => {
    if (cartRef.current) {
      cartRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckoutOpen = () => setIsCheckoutOpen(true);
  const handleCheckoutClose = () => setIsCheckoutOpen(false);

  const handleCheckout = () => {
    alert('Thank you for your purchase!');
    setCart([]);
    localStorage.removeItem('cart');
    handleCheckoutClose();
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
        <button className="cart-icon" onClick={scrollToCart}>
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

      {/* Shopping Cart Section */}
      <div ref={cartRef} className="cart-section">
        <h2 className="cart-title">Shopping Cart</h2>
        {cart.length > 0 ? (
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.cartItemId} className="cart-item">
                <span>{item.name}</span>
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={() => handleCartQuantityChange(item.cartItemId, -1)}
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
                    onClick={() => handleCartQuantityChange(item.cartItemId, 1)}
                  >
                    +
                  </button>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item.cartItemId)}
                >
                  Remove
                </button>
              </div>
            ))}
            <p className="total">Total: ${calculateTotal()}</p>
            <Button color="success" onClick={handleCheckoutOpen}>
              Checkout
            </Button>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      {/* Checkout Modal */}
      <Modal open={isCheckoutOpen} onClose={handleCheckoutClose}>
        <Modal.Header>
          <h3>Checkout</h3>
        </Modal.Header>
        <Modal.Body>
          <Input
            label="First Name"
            placeholder="Enter your first name"
            fullWidth
            required
          />
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            fullWidth
            required
          />
          <Input
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            fullWidth
            required
            type="number"
          />
          <Input
            label="CVV"
            placeholder="123"
            fullWidth
            required
            type="number"
          />
          <Input
            label="Zip Code"
            placeholder="Enter your zip code"
            fullWidth
            required
            type="number"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={handleCheckoutClose}>
            Cancel
          </Button>
          <Button auto onClick={handleCheckout}>
            Confirm Purchase
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;
