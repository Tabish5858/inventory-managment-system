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

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="text-xl">Loading products...</div></div>;

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          href="/products/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add New Product
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/products/${product.id}`} className="text-blue-600 hover:text-blue-900">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${typeof product.price === 'number' ? product.price.toFixed(2) : Number(product.price).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.is_low_stock ? (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id!)}
                      className="text-red-600 hover:text-red-900"
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
          className="text-blue-600 hover:text-blue-900"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
