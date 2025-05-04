"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Category, categoryService } from '../../services/categoryService';
import { Product, productService } from '../../services/productService';

// Define a separate interface for form state to handle string inputs
interface ProductFormState {
  name: string;
  description: string;
  sku: string;
  barcode: string;
  category: number | undefined;
  price: number | string;
  cost_price: number | string;
  quantity: number | string;
  low_stock_threshold: number | string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [product, setProduct] = useState<ProductFormState>({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    category: undefined,
    price: '',
    cost_price: '',
    quantity: '',
    low_stock_threshold: 10,
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

    if (name === 'category') {
      setProduct({
        ...product,
        [name]: parseInt(value)
      });
    } else {
      setProduct({
        ...product,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Convert form state to Product type with proper numeric values
      const productToSubmit: Product = {
        name: product.name,
        description: product.description,
        sku: product.sku,
        barcode: product.barcode,
        category: product.category as number,
        price: typeof product.price === 'string' ? parseFloat(product.price) || 0 : product.price,
        cost_price: typeof product.cost_price === 'string' ? parseFloat(product.cost_price) || 0 : product.cost_price,
        quantity: typeof product.quantity === 'string' ? parseInt(product.quantity) || 0 : product.quantity,
        low_stock_threshold: typeof product.low_stock_threshold === 'string'
          ? parseInt(product.low_stock_threshold) || 10
          : product.low_stock_threshold,
      };

      await productService.create(productToSubmit);
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
