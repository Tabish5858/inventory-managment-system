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
        return 'bg-green-900 text-green-100';
      case 'sale':
        return 'bg-blue-900 text-blue-100';
      case 'return':
        return 'bg-amber-900 text-amber-100';
      case 'adjustment':
        return 'bg-purple-900 text-purple-100';
      default:
        return 'bg-gray-700 text-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="text-xl text-white">Loading transactions...</div></div>;

  if (error) return (
    <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
      {error}
    </div>
  );

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Transaction History</h1>
        <Link
          href="/transactions/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Record Transaction
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('purchase')}
            className={`px-4 py-2 rounded-md ${filter === 'purchase' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Purchases
          </button>
          <button
            onClick={() => setFilter('sale')}
            className={`px-4 py-2 rounded-md ${filter === 'sale' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Sales
          </button>
          <button
            onClick={() => setFilter('return')}
            className={`px-4 py-2 rounded-md ${filter === 'return' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Returns
          </button>
          <button
            onClick={() => setFilter('adjustment')}
            className={`px-4 py-2 rounded-md ${filter === 'adjustment' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Adjustments
          </button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-700">
          <p className="text-gray-400">No transactions found. Record a transaction to get started.</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {transaction.transaction_date && formatDate(transaction.transaction_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {transaction.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTransactionTypeColor(transaction.transaction_type)}`}>
                      {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.transaction_type === 'sale' ? (
                      <span className="text-red-400">-{transaction.quantity}</span>
                    ) : (
                      <span className="text-green-400">+{transaction.quantity}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
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
          className="text-blue-400 hover:text-blue-300"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
