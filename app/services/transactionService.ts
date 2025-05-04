import api from "./api";

export interface Transaction {
  id?: number;
  product: number;
  product_name?: string;
  quantity: number;
  transaction_type: "purchase" | "sale" | "return" | "adjustment";
  transaction_date?: string;
  notes: string;
}

export const transactionService = {
  // Get all transactions
  getAll: async () => {
    const response = await api.get("/transactions/");
    return response.data;
  },

  // Get transaction by ID
  getById: async (id: number) => {
    const response = await api.get(`/transactions/${id}/`);
    return response.data;
  },

  // Get transactions by product ID
  getByProduct: async (productId: number) => {
    const response = await api.get(
      `/transactions/by_product/?product_id=${productId}`
    );
    return response.data;
  },

  // Create new transaction
  create: async (transaction: Transaction) => {
    const response = await api.post("/transactions/", transaction);
    return response.data;
  },

  // Update transaction
  update: async (id: number, transaction: Transaction) => {
    const response = await api.put(`/transactions/${id}/`, transaction);
    return response.data;
  },

  // Delete transaction
  delete: async (id: number) => {
    await api.delete(`/transactions/${id}/`);
    return true;
  },
};
