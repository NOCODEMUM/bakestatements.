const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const request = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new ApiError(response.status, error.error || error.message || 'Request failed');
  }

  return response.json();
};

export const api = {
  auth: {
    register: (email: string, password: string, businessName?: string) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, business_name: businessName }),
      }),

    login: (email: string, password: string) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    logout: (refreshToken: string) =>
      request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }),

    refreshToken: (refreshToken: string) =>
      request('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }),

    getProfile: (token: string) =>
      request('/auth/profile', { token }),

    updateProfile: (token: string, data: any) =>
      request('/auth/profile', {
        method: 'PUT',
        token,
        body: JSON.stringify(data),
      }),

    forgotPassword: (email: string) =>
      request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    resetPassword: (token: string, newPassword: string) =>
      request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      }),
  },

  orders: {
    getAll: (token: string) =>
      request('/orders', { token }),

    getOne: (token: string, id: string) =>
      request(`/orders/${id}`, { token }),

    create: (token: string, data: any) =>
      request('/orders', {
        method: 'POST',
        token,
        body: JSON.stringify(data),
      }),

    update: (token: string, id: string, data: any) =>
      request(`/orders/${id}`, {
        method: 'PUT',
        token,
        body: JSON.stringify(data),
      }),

    delete: (token: string, id: string) =>
      request(`/orders/${id}`, {
        method: 'DELETE',
        token,
      }),
  },

  expenses: {
    getAll: (token: string) =>
      request('/expenses', { token }),

    getSummary: (token: string) =>
      request('/expenses/summary', { token }),

    getOne: (token: string, id: string) =>
      request(`/expenses/${id}`, { token }),

    create: (token: string, data: any) =>
      request('/expenses', {
        method: 'POST',
        token,
        body: JSON.stringify(data),
      }),

    update: (token: string, id: string, data: any) =>
      request(`/expenses/${id}`, {
        method: 'PUT',
        token,
        body: JSON.stringify(data),
      }),

    delete: (token: string, id: string) =>
      request(`/expenses/${id}`, {
        method: 'DELETE',
        token,
      }),
  },

  recipes: {
    getAll: (token: string) =>
      request('/recipes', { token }),

    getOne: (token: string, id: string) =>
      request(`/recipes/${id}`, { token }),

    calculateCost: (token: string, id: string) =>
      request(`/recipes/${id}/cost`, { token }),

    create: (token: string, data: any) =>
      request('/recipes', {
        method: 'POST',
        token,
        body: JSON.stringify(data),
      }),

    update: (token: string, id: string, data: any) =>
      request(`/recipes/${id}`, {
        method: 'PUT',
        token,
        body: JSON.stringify(data),
      }),

    delete: (token: string, id: string) =>
      request(`/recipes/${id}`, {
        method: 'DELETE',
        token,
      }),
  },

  ingredients: {
    getAll: (token: string) =>
      request('/ingredients', { token }),

    getOne: (token: string, id: string) =>
      request(`/ingredients/${id}`, { token }),

    create: (token: string, data: any) =>
      request('/ingredients', {
        method: 'POST',
        token,
        body: JSON.stringify(data),
      }),

    update: (token: string, id: string, data: any) =>
      request(`/ingredients/${id}`, {
        method: 'PUT',
        token,
        body: JSON.stringify(data),
      }),

    delete: (token: string, id: string) =>
      request(`/ingredients/${id}`, {
        method: 'DELETE',
        token,
      }),
  },

  stripe: {
    createCheckout: (token: string, priceId: string, mode: string = 'subscription') =>
      request('/stripe/create-checkout', {
        method: 'POST',
        token,
        body: JSON.stringify({ priceId, mode }),
      }),

    getSubscriptionStatus: (token: string) =>
      request('/stripe/subscription-status', { token }),
  },
};

export { ApiError };
