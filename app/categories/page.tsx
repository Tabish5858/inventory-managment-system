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
    return <div className="flex items-center justify-center min-h-screen"><div className="text-xl">Loading categories...</div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add New Category
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No categories found. Add your first category to start organizing your inventory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">
                  {category.description || 'No description provided'}
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id!)}
                    className="text-red-600 hover:text-red-800"
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
          className="text-blue-600 hover:text-blue-900"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Category' : 'Add New Category'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name*
                  </label>
                  <input
                    required
                    type="text"
                    id="name"
                    name="name"
                    value={currentCategory.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={currentCategory.description}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
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
