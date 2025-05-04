import api from "./api";

export interface Product {
  id?: number;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  category: number;
  category_name?: string;
  price: number;
  cost_price: number;
  quantity: number;
  low_stock_threshold: number;
  is_low_stock?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const productService = {
  // Get all products
  getAll: async () => {
    const response = await api.get("/products/");
    return response.data;
  },

  // Get product by ID
  getById: async (id: number) => {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },

  // Create new product
  create: async (product: Product) => {
    const response = await api.post("/products/", product);
    return response.data;
  },

  // Update product
  update: async (id: number, product: Product) => {
    const response = await api.put(`/products/${id}/`, product);
    return response.data;
  },

  // Delete product
  delete: async (id: number) => {
    await api.delete(`/products/${id}/`);
    return true;
  },

  // Get low stock products
  getLowStock: async () => {
    const response = await api.get("/products/low_stock/");
    return response.data;
  },
};
