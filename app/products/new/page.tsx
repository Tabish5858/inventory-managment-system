"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Category, categoryService } from '../../services/categoryService';
import { Product, productService } from '../../services/productService';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    category: undefined, // Changed from 0 to undefined
    price: '',           // Changed from 0 to empty string to fix parsing issues
    cost_price: '',      // Changed from 0 to empty string
    quantity: '',        // Changed from 0 to empty string
    low_stock_threshold: '10', // Changed from 10 to '10' string
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
        if (data.length > 0) {
          setProduct(prev => ({ ...prev, category: data[0].id }));
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
        setError('Failed to load categories. Please try again later.');
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: name === 'category' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Convert numeric strings to numbers before submitting
      const productToSubmit = {
        ...product,
        price: parseFloat(product.price as string) || 0,
        cost_price: parseFloat(product.cost_price as string) || 0,
        quantity: parseInt(product.quantity as string) || 0,
        low_stock_threshold: parseInt(product.low_stock_threshold as string) || 10
      };

      await productService.create(productToSubmit as Product);
      router.push('/products');
    } catch (err) {
      console.error('Failed to create product', err);
      setError('Failed to create product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Add New Product</h1>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Product Name*
            </label>
            <input
              required
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
              Category*
            </label>
            <select
              required
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
            >
              {categories.length === 0 && <option value="">No categories available</option>}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-300 mb-1">
              SKU* (Stock Keeping Unit)
            </label>
            <input
              required
              type="text"
              id="sku"
              name="sku"
              value={product.sku}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="barcode" className="block text-sm font-medium text-gray-300 mb-1">
              Barcode
            </label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={product.barcode}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
              Selling Price*
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="cost_price" className="block text-sm font-medium text-gray-300 mb-1">
              Cost Price*
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              id="cost_price"
              name="cost_price"
              value={product.cost_price}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">
              Initial Quantity*
            </label>
            <input
              required
              type="number"
              min="0"
              id="quantity"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="low_stock_threshold" className="block text-sm font-medium text-gray-300 mb-1">
              Low Stock Alert Threshold*
            </label>
            <input
              required
              type="number"
              min="0"
              id="low_stock_threshold"
              name="low_stock_threshold"
              value={product.low_stock_threshold}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={product.description}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Link
            href="/products"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:bg-blue-800 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
