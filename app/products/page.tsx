"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Product, productService } from '../services/productService';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id);
        setProducts(products.filter(product => product.id !== id));
      } catch (err) {
        console.error('Failed to delete product', err);
        alert('Failed to delete product');
      }
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="text-xl text-white">Loading products...</div></div>;

  if (error) return (
    <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
      {error}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Products</h1>
        <Link
          href="/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add New Product
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p>No products found</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/products/${product.id}`} className="text-blue-400 hover:text-blue-300">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.category_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">${typeof product.price === 'number' ? product.price.toFixed(2) : Number(product.price).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.is_low_stock ? (
                      <span className="bg-red-900 text-red-100 px-2 py-1 rounded-full text-xs font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-900 text-green-100 px-2 py-1 rounded-full text-xs font-semibold">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="text-indigo-400 hover:text-indigo-300 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id!)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
