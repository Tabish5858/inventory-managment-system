"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Category, categoryService } from '../services/categoryService';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category>({ id: 0, name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setCurrentCategory(category);
      setIsEditing(true);
    } else {
      setCurrentCategory({ id: 0, name: '', description: '' });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await categoryService.update(currentCategory.id!, currentCategory);
      } else {
        await categoryService.create(currentCategory);
      }

      fetchCategories();
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save category', err);
      setError('Failed to save category. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? This may affect products using this category.')) {
      try {
        await categoryService.delete(id);
        fetchCategories();
      } catch (err) {
        console.error('Failed to delete category', err);
        setError('Failed to delete category. It may be in use by products.');
      }
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-xl text-white">Loading categories...</div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Categories</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add New Category
        </button>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-700">
          <p className="text-gray-400">No categories found. Add your first category to start organizing your inventory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">{category.name}</h3>
                <p className="text-gray-300 mb-4">
                  {category.description || 'No description provided'}
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id!)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
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

      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">
                {isEditing ? 'Edit Category' : 'Add New Category'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Category Name*
                  </label>
                  <input
                    required
                    type="text"
                    id="name"
                    name="name"
                    value={currentCategory.name}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={currentCategory.description}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    {isEditing ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
