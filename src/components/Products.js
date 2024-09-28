import React, { useState } from 'react';
import { Button, Input } from '@nextui-org/react';

const mockProducts = [
  { id: 1, name: 'Product 1', price: 29.99, image: 'https://example.com/product1.jpg' },
  { id: 2, name: 'Product 2', price: 19.99, image: 'https://example.com/product2.jpg' },
  { id: 3, name: 'Product 3', price: 39.99, image: 'https://example.com/product3.jpg' },
  { id: 4, name: 'Product 4', price: 24.99, image: 'https://example.com/product4.jpg' },
  { id: 5, name: 'Product 5', price: 14.99, image: 'https://example.com/product5.jpg' },
  { id: 6, name: 'Product 6', price: 44.99, image: 'https://example.com/product6.jpg' },
];

const Products = () => {
  const [quantities, setQuantities] = useState(
    mockProducts.reduce((acc, product) => {
      acc[product.id] = 1;
      return acc;
    }, {})
  );

  const handleQuantityChange = (productId, delta) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, prevQuantities[productId] + delta),
    }));
  };

  const addToCart = (product) => {
    alert(`Added ${quantities[product.id]} of ${product.name} to the cart!`);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      {/* Flexbox Layout for 3 Items per Row */}
      <div className="flex flex-wrap justify-between">
        {mockProducts.map((product) => (
          <div
            key={product.id}
            className="bg-gray-200 bg-opacity-50 p-4 shadow-lg rounded-lg flex flex-col justify-between m-2"
            style={{ width: '30%', height: '350px' }} // Fixed width and height
          >
            {/* Product Image */}
            <div className="h-40 mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
              </div>

              {/* Quantity Selector and Add to Cart */}
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <button
                      className="bg-gray-300 px-2 py-1 rounded"
                      onClick={() => handleQuantityChange(product.id, -1)}
                    >
                      -
                    </button>
                    <Input
                      type="number"
                      value={quantities[product.id]}
                      readOnly
                      className="mx-2 text-center border border-gray-300 rounded w-12"
                    />
                    <button
                      className="bg-gray-300 px-2 py-1 rounded"
                      onClick={() => handleQuantityChange(product.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  auto
                  color="primary"
                  className="mt-4 w-full"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
