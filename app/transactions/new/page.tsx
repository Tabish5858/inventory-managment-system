/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Product, productService } from '../../services/productService';
import { Transaction, transactionService } from '../../services/transactionService';

export default function NewTransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [error, setError] = useState('');

  const [transaction, setTransaction] = useState<Partial<Transaction>>({
    product: 0,
    quantity: 1,
    transaction_type: 'sale',
    notes: ''
  });

  useEffect(() => {
    // Get product ID and transaction type from URL parameters if available
    const productId = searchParams.get('product');
    const transactionType = searchParams.get('type');

    if (productId) {
      setTransaction(prev => ({ ...prev, product: parseInt(productId) }));
    }

    if (transactionType && ['purchase', 'sale', 'return', 'adjustment'].includes(transactionType)) {
      setTransaction(prev => ({ ...prev, transaction_type: transactionType as 'purchase' | 'sale' | 'return' | 'adjustment' }));
    }

    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setIsProductsLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);

      // Set the first product as default if no product was specified in URL
      if (!searchParams.get('product') && data.length > 0) {
        setTransaction(prev => ({ ...prev, product: data[0].id! }));
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setIsProductsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Convert quantity to number
    if (name === 'quantity') {
      setTransaction({
        ...transaction,
        [name]: parseInt(value) || 1
      });
    } else if (name === 'product') {
      setTransaction({
        ...transaction,
        [name]: parseInt(value)
      });
    } else {
      setTransaction({
        ...transaction,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await transactionService.create(transaction as Transaction);
      router.push('/transactions');
    } catch (err) {
      console.error('Failed to create transaction', err);
      setError('Failed to record transaction. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isProductsLoading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-xl text-white">Loading products...</div></div>;
  }

  // Find the selected product
  const selectedProduct = products.find(p => p.id === transaction.product);

  // Safely format price to prevent TypeError
  const formatPrice = (price: any): string => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    } else if (typeof price === 'string') {
      const numPrice = parseFloat(price);
      return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    }
    return '0.00';
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Record Transaction</h1>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="transaction_type" className="block text-sm font-medium text-gray-300 mb-1">
              Transaction Type*
            </label>
            <select
              required
              id="transaction_type"
              name="transaction_type"
              value={transaction.transaction_type}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="sale">Sale</option>
              <option value="purchase">Purchase</option>
              <option value="return">Return</option>
              <option value="adjustment">Inventory Adjustment</option>
            </select>
          </div>

          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-300 mb-1">
              Product*
            </label>
            <select
              required
              id="product"
              name="product"
              value={transaction.product}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              {products.length === 0 && <option value="">No products available</option>}
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (Current Stock: {product.quantity})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="bg-gray-700 p-4 rounded-md border border-gray-600">
              <h3 className="font-semibold mb-2 text-white">Product Details</h3>
              <p className="text-gray-300"><span className="text-gray-400">SKU:</span> {selectedProduct.sku}</p>
              <p className="text-gray-300"><span className="text-gray-400">Current Stock:</span> {selectedProduct.quantity}</p>
              <p className="text-gray-300"><span className="text-gray-400">Price:</span> ${formatPrice(selectedProduct.price)}</p>
            </div>
          )}

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">
              Quantity*
            </label>
            <input
              required
              type="number"
              min="1"
              id="quantity"
              name="quantity"
              value={transaction.quantity}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />

            {transaction.transaction_type === 'sale' && selectedProduct && (transaction.quantity ?? 0) > selectedProduct.quantity && (
              <p className="text-red-400 text-sm mt-1">Warning: Quantity exceeds current stock ({selectedProduct.quantity}).</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={transaction.notes}
              onChange={handleChange}
              placeholder="Add any additional information about this transaction"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Link
            href="/transactions"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:bg-blue-800 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Record Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}
