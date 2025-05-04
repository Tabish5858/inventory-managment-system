"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { notificationService } from './services/notificationService';
import { Product, productService } from './services/productService';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, lowStockData] = await Promise.all([
          productService.getAll(),
          productService.getLowStock()
        ]);
        setProducts(productsData);
        setLowStockProducts(lowStockData);

        // Check for low stock and send notifications
        if (lowStockData && lowStockData.length > 0) {
          notificationService.checkLowStockAndNotify(lowStockData);
        }
      } catch (err) {
        setError('Failed to fetch data. Please check if the Django server is running.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-white">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-2"></div>
        Loading...
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4 max-w-lg">
        {error}
      </div>
      <div className="text-center text-white">
        <p className="mb-4">Make sure your Django backend is running:</p>
        <div className="bg-gray-800 p-4 rounded-md text-left">
          <code>cd backend && python manage.py runserver</code>
        </div>
      </div>
    </div>
  );

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.quantity, 0);
  const totalValue = products.reduce((sum, product) => sum + (typeof product.price === 'number' ? product.price * product.quantity : Number(product.price) * product.quantity), 0);

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Inventory Management Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Summary Cards */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <h3 className="font-semibold text-gray-400">Total Products</h3>
          <p className="text-3xl font-bold text-white">{totalProducts}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <h3 className="font-semibold text-gray-400">Total Items in Stock</h3>
          <p className="text-3xl font-bold text-white">{totalStock}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <h3 className="font-semibold text-gray-400">Inventory Value</h3>
          <p className="text-3xl font-bold text-white">${totalValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Low Stock Alerts</h2>
          <Link
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            View All Products
          </Link>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="bg-green-900 p-4 rounded-md text-green-100">
            <p>No low stock alerts. All inventory levels are good!</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Threshold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {lowStockProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-white">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-red-400 font-semibold">{product.quantity}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.low_stock_threshold}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/transactions/new?product=${product.id}&type=purchase`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Restock
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link
                href="/products/new"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-center"
              >
                Add New Product
              </Link>
              <Link
                href="/categories"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md text-center"
              >
                Manage Categories
              </Link>
              <Link
                href="/transactions"
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-md text-center"
              >
                View All Transactions
              </Link>
              <Link
                href="/barcode"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-center"
              >
                Scan Barcode
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">System Status</h2>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-300">Backend API: Connected</span>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-300">Database: Connected</span>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Last data update: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
