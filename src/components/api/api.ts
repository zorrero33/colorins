import {
  Product,
  Category,
  Order,
  Customer,
  SiteSettings,
  DesignSettings,
  SEOSettings,
  LegalSettings,
  LogEntry,
  SecurityStatus,
  DatabaseStatus,
} from "./types";

const TOKEN_KEY = "colorins_admin_token";

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Error HTTP ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.error) {
        errorMsg = data.error;
      }
    } catch {
      // not JSON
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ success: boolean; user: any; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  checkSession: () =>
    request<{ authenticated: boolean; user?: any }>("/api/auth/session"),

  changePassword: (data: { email?: string; currentPassword: string; newPassword: string }) =>
    request<{ success: boolean; message: string }>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Products
  getProducts: (params?: { search?: string; category?: string; activeOnly?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.category) q.set("category", params.category);
    if (params?.activeOnly) q.set("activeOnly", "true");
    const qs = q.toString();
    return request<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
  },

  createProduct: (product: Partial<Product>) =>
    request<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),

  updateProduct: (id: string, product: Partial<Product>) =>
    request<Product>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),

  updateStock: (id: string, stock: number) =>
    request<{ success: boolean; stock: number }>(`/api/products/${id}/stock`, {
      method: "PATCH",
      body: JSON.stringify({ stock }),
    }),

  toggleProduct: (id: string) =>
    request<{ success: boolean; active: number }>(`/api/products/${id}/toggle`, {
      method: "PATCH",
    }),

  deleteProduct: (id: string) =>
    request<{ success: boolean }>(`/api/products/${id}`, {
      method: "DELETE",
    }),

  // Categories
  getCategories: () => request<Category[]>("/api/categories"),

  createCategory: (name: string) =>
    request<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  updateCategory: (id: string, name: string) =>
    request<{ success: boolean; name: string }>(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),

  toggleCategory: (id: string) =>
    request<{ success: boolean; active: number }>(`/api/categories/${id}/toggle`, {
      method: "PATCH",
    }),

  deleteCategory: (id: string) =>
    request<{ success: boolean }>(`/api/categories/${id}`, {
      method: "DELETE",
    }),

  // Orders
  getOrders: () => request<Order[]>("/api/orders"),

  createOrder: (order: Partial<Order> & { items?: any[] }) =>
    request<Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify(order),
    }),

  updateOrderStatus: (id: string, status: string) =>
    request<{ success: boolean; status: string }>(`/api/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  deleteOrder: (id: string) =>
    request<{ success: boolean }>(`/api/orders/${id}`, {
      method: "DELETE",
    }),

  // Customers
  getCustomers: () => request<Customer[]>("/api/customers"),

  createCustomer: (customer: Partial<Customer>) =>
    request<Customer>("/api/customers", {
      method: "POST",
      body: JSON.stringify(customer),
    }),

  toggleCustomer: (id: string) =>
    request<{ success: boolean; active: number }>(`/api/customers/${id}/toggle`, {
      method: "PATCH",
    }),

  deleteCustomer: (id: string) =>
    request<{ success: boolean }>(`/api/customers/${id}`, {
      method: "DELETE",
    }),

  // Settings
  getStoreSettings: () => request<SiteSettings>("/api/settings/store"),
  saveStoreSettings: (settings: SiteSettings) =>
    request<{ success: boolean }>("/api/settings/store", {
      method: "POST",
      body: JSON.stringify(settings),
    }),

  getDesignSettings: () => request<DesignSettings>("/api/settings/design"),
  saveDesignSettings: (design: DesignSettings) =>
    request<{ success: boolean }>("/api/settings/design", {
      method: "POST",
      body: JSON.stringify(design),
    }),

  getSEOSettings: () => request<SEOSettings>("/api/settings/seo"),
  saveSEOSettings: (seo: SEOSettings) =>
    request<{ success: boolean }>("/api/settings/seo", {
      method: "POST",
      body: JSON.stringify(seo),
    }),

  getLegalSettings: () => request<LegalSettings>("/api/settings/legal"),
  saveLegalSettings: (legal: LegalSettings) =>
    request<{ success: boolean }>("/api/settings/legal", {
      method: "POST",
      body: JSON.stringify(legal),
    }),

  // Security
  getSecurityAudit: () => request<SecurityStatus>("/api/security/env-status"),

  // Database Tools
  getDatabaseStatus: () => request<DatabaseStatus>("/api/database/status"),
  getDatabaseTables: () => request<string[]>("/api/database/tables"),
  getTableRows: (table: string) => request<any[]>(`/api/database/table-data/${table}`),
  runQuery: (query: string) =>
    request<{ success: boolean; count: number; rows: any[] }>("/api/database/query", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),
  seedDatabase: () =>
    request<{ success: boolean; message: string }>("/api/database/seed", {
      method: "POST",
    }),
  restoreDatabase: (data: any) =>
    request<{ success: boolean; message: string }>("/api/database/restore", {
      method: "POST",
      body: JSON.stringify({ data }),
    }),
  vacuumDatabase: () =>
    request<{ success: boolean; message: string }>("/api/database/vacuum", {
      method: "POST",
    }),

  // Logs
  getLogs: () => request<LogEntry[]>("/api/logs"),
  clearLogs: () =>
    request<{ success: boolean; message: string }>("/api/logs", {
      method: "DELETE",
    }),
};
