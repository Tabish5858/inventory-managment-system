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
        [name]: parseInt(value)
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
    return <div className="flex items-center justify-center min-h-screen"><div className="text-xl">Loading products...</div></div>;
  }

  // Find the selected product
  const selectedProduct = products.find(p => p.id === transaction.product);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Record Transaction</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="transaction_type" className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type*
            </label>
            <select
              required
              id="transaction_type"
              name="transaction_type"
              value={transaction.transaction_type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="sale">Sale</option>
              <option value="purchase">Purchase</option>
              <option value="return">Return</option>
              <option value="adjustment">Inventory Adjustment</option>
            </select>
          </div>

          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
              Product*
            </label>
            <select
              required
              id="product"
              name="product"
              value={transaction.product}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
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
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Product Details</h3>
              <p><span className="text-gray-600">SKU:</span> {selectedProduct.sku}</p>
              <p><span className="text-gray-600">Current Stock:</span> {selectedProduct.quantity}</p>
              <p><span className="text-gray-600">Price:</span> ${selectedProduct.price.toFixed(2)}</p>
            </div>
          )}

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full p-2 border border-gray-300 rounded-md"
            />

            {transaction.transaction_type === 'sale' && selectedProduct && (transaction.quantity ?? 0) > selectedProduct.quantity && (
              <p className="text-red-500 text-sm mt-1">Warning: Quantity exceeds current stock ({selectedProduct.quantity}).</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={transaction.notes}
              onChange={handleChange}
              placeholder="Add any additional information about this transaction"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Link
            href="/transactions"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-blue-300"
          >
            {isLoading ? 'Saving...' : 'Record Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}
