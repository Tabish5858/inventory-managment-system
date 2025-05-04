import api from "./api";

export interface Category {
  id?: number;
  name: string;
  description: string;
}

export const categoryService = {
  // Get all categories
  getAll: async () => {
    const response = await api.get("/categories/");
    return response.data;
  },

  // Get category by ID
  getById: async (id: number) => {
    const response = await api.get(`/categories/${id}/`);
    return response.data;
  },

  // Create new category
  create: async (category: Category) => {
    const response = await api.post("/categories/", category);
    return response.data;
  },

  // Update category
  update: async (id: number, category: Category) => {
    const response = await api.put(`/categories/${id}/`, category);
    return response.data;
  },

  // Delete category
  delete: async (id: number) => {
    await api.delete(`/categories/${id}/`);
    return true;
  },
};
