import React, { useState, useEffect } from 'react';
import { Button, Input } from '@nextui-org/react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  // Fetch products from the database/API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Replace with your API endpoint
        const data = await response.json();

        setProducts(data);

        // Initialize quantities with default values
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

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <div className="flex flex-wrap justify-between">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-200 bg-opacity-50 p-4 shadow-lg rounded-lg flex flex-col justify-between m-2"
              style={{ width: '30%', height: '350px' }}
            >
              <div className="h-40 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">${product.price.toFixed(2)}</p>
                </div>

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

                  <Button
                    auto
                    color="primary"
                    className="mt-4 w-full"
                    onClick={() => addToCart(product)}
                  >
                    Add To Cart
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </div>
  );
};

export default Products;
