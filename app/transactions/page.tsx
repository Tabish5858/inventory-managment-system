"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Transaction, transactionService } from '../services/transactionService';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
      setError('Failed to load transactions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    if (filter === 'all') return transactions;
    return transactions.filter(transaction => transaction.transaction_type === filter);
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'bg-green-100 text-green-800';
      case 'sale':
        return 'bg-blue-100 text-blue-800';
      case 'return':
        return 'bg-amber-100 text-amber-800';
      case 'adjustment':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="text-xl">Loading transactions...</div></div>;

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  );

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <Link
          href="/transactions/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Record Transaction
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('purchase')}
            className={`px-4 py-2 rounded-md ${filter === 'purchase' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            Purchases
          </button>
          <button
            onClick={() => setFilter('sale')}
            className={`px-4 py-2 rounded-md ${filter === 'sale' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            Sales
          </button>
          <button
            onClick={() => setFilter('return')}
            className={`px-4 py-2 rounded-md ${filter === 'return' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            Returns
          </button>
          <button
            onClick={() => setFilter('adjustment')}
            className={`px-4 py-2 rounded-md ${filter === 'adjustment' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            Adjustments
          </button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No transactions found. Record a transaction to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.transaction_date && formatDate(transaction.transaction_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTransactionTypeColor(transaction.transaction_type)}`}>
                      {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.transaction_type === 'sale' ? (
                      <span className="text-red-600">-{transaction.quantity}</span>
                    ) : (
                      <span className="text-green-600">+{transaction.quantity}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {transaction.notes || '-'}
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
