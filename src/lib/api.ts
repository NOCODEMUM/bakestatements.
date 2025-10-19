const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiError {
  message: string;
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  auth: {
    register: async (email: string, password: string, businessName?: string) => {
      const data = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, business_name: businessName }),
      });

      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      return data;
    },

    login: async (email: string, password: string) => {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      return data;
    },

    logout: async () => {
      const refreshToken = localStorage.getItem('refreshToken');

      try {
        await fetchApi('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    },

    refresh: async () => {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const data = await fetchApi('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });

      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }

      return data;
    },

    getProfile: async () => {
      return fetchApi('/auth/profile');
    },

    updateProfile: async (profileData: any) => {
      return fetchApi('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    },

    forgotPassword: async (email: string) => {
      return fetchApi('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },

    resetPassword: async (token: string, password: string) => {
      return fetchApi('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
    },
  },

  orders: {
    getAll: async () => {
      const data = await fetchApi('/orders');
      return { orders: data };
    },

    getOne: async (id: string) => {
      const data = await fetchApi(`/orders/${id}`);
      return { order: data };
    },

    create: async (orderData: any) => {
      const data = await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      return { order: data };
    },

    update: async (_token: string, id: string, orderData: any) => {
      const data = await fetchApi(`/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(orderData),
      });
      return { order: data };
    },

    delete: async (_token: string, id: string) => {
      await fetchApi(`/orders/${id}`, {
        method: 'DELETE',
      });
      return { success: true };
    },
  },

  expenses: {
    getAll: async () => {
      const data = await fetchApi('/expenses');
      return { expenses: data };
    },

    getSummary: async () => {
      const data = await fetchApi('/expenses/summary');
      return { summary: data };
    },

    getOne: async (_token: string, id: string) => {
      const data = await fetchApi(`/expenses/${id}`);
      return { expense: data };
    },

    create: async (_token: string, expenseData: any) => {
      const data = await fetchApi('/expenses', {
        method: 'POST',
        body: JSON.stringify(expenseData),
      });
      return { expense: data };
    },

    update: async (_token: string, id: string, expenseData: any) => {
      const data = await fetchApi(`/expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(expenseData),
      });
      return { expense: data };
    },

    delete: async (_token: string, id: string) => {
      await fetchApi(`/expenses/${id}`, {
        method: 'DELETE',
      });
      return { success: true };
    },
  },

  recipes: {
    getAll: async () => {
      const data = await fetchApi('/recipes');
      return { recipes: data };
    },

    getOne: async (_token: string, id: string) => {
      const data = await fetchApi(`/recipes/${id}`);
      return { recipe: data };
    },

    calculateCost: async (_token: string, id: string) => {
      const data = await fetchApi(`/recipes/${id}/cost`);
      return data;
    },

    create: async (_token: string, recipeData: any) => {
      const data = await fetchApi('/recipes', {
        method: 'POST',
        body: JSON.stringify(recipeData),
      });
      return { recipe: data };
    },

    update: async (_token: string, id: string, recipeData: any) => {
      const data = await fetchApi(`/recipes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(recipeData),
      });
      return { recipe: data };
    },

    delete: async (_token: string, id: string) => {
      await fetchApi(`/recipes/${id}`, {
        method: 'DELETE',
      });
      return { success: true };
    },
  },

  ingredients: {
    getAll: async () => {
      const data = await fetchApi('/ingredients');
      return { ingredients: data };
    },

    getOne: async (_token: string, id: string) => {
      const data = await fetchApi(`/ingredients/${id}`);
      return { ingredient: data };
    },

    create: async (_token: string, ingredientData: any) => {
      const data = await fetchApi('/ingredients', {
        method: 'POST',
        body: JSON.stringify(ingredientData),
      });
      return { ingredient: data };
    },

    update: async (_token: string, id: string, ingredientData: any) => {
      const data = await fetchApi(`/ingredients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(ingredientData),
      });
      return { ingredient: data };
    },

    delete: async (_token: string, id: string) => {
      await fetchApi(`/ingredients/${id}`, {
        method: 'DELETE',
      });
      return { success: true };
    },
  },

  stripe: {
    createCheckout: async (_token: string, priceId: string, mode: string = 'subscription') => {
      const data = await fetchApi('/stripe/create-checkout', {
        method: 'POST',
        body: JSON.stringify({ priceId, mode }),
      });
      return data;
    },

    getSubscriptionStatus: async () => {
      return fetchApi('/stripe/subscription-status');
    },
  },

  enquiries: {
    getAll: async () => {
      const data = await fetchApi('/enquiries');
      return { enquiries: data };
    },

    create: async (enquiryData: any) => {
      const data = await fetchApi('/enquiries', {
        method: 'POST',
        body: JSON.stringify(enquiryData),
      });
      return { enquiry: data };
    },

    delete: async (_token: string, id: string) => {
      await fetchApi(`/enquiries/${id}`, {
        method: 'DELETE',
      });
      return { success: true };
    },
  },

  invoices: {
    getAll: async (_token: string) => {
      return api.orders.getAll();
    },

    create: async (_token: string, data: any) => {
      return api.orders.create(data);
    },

    delete: async (_token: string, id: string) => {
      return api.orders.delete(_token, id);
    },
  },

  calendar: {
    getEvents: async () => {
      const data = await fetchApi('/orders');
      return { events: data };
    },
  },

  landingPages: {
    getBySlug: async (slug: string) => {
      const data = await fetchApi(`/landing-pages/${slug}`);
      return { landingPage: data };
    },

    getMyLandingPage: async () => {
      const data = await fetchApi('/landing-pages/my');
      return { landingPage: data };
    },

    create: async (_token: string, landingPageData: any) => {
      const data = await fetchApi('/landing-pages', {
        method: 'POST',
        body: JSON.stringify(landingPageData),
      });
      return { landingPage: data };
    },

    update: async (_token: string, landingPageData: any) => {
      const data = await fetchApi('/landing-pages', {
        method: 'PUT',
        body: JSON.stringify(landingPageData),
      });
      return { landingPage: data };
    },

    delete: async () => {
      await fetchApi('/landing-pages', {
        method: 'DELETE',
      });
      return { success: true };
    },

    checkSlugAvailability: async (slug: string) => {
      const data = await fetchApi(`/landing-pages/check-slug/${slug}`);
      return { available: data.available };
    },

    uploadImage: async (file: File, folder: string = 'general') => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/landing-pages/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      return response.json();
    },

    deleteImage: async (filePath: string) => {
      await fetchApi('/landing-pages/delete-image', {
        method: 'POST',
        body: JSON.stringify({ filePath }),
      });
      return { success: true };
    },
  },

  equipment: {
    getAll: async () => {
      const data = await fetchApi('/equipment');
      return { equipment: data };
    },

    getOne: async (_token: string, id: string) => {
      const data = await fetchApi(`/equipment/${id}`);
      return { equipment: data };
    },

    create: async (_token: string, equipmentData: any) => {
      const data = await fetchApi('/equipment', {
        method: 'POST',
        body: JSON.stringify(equipmentData),
      });
      return { equipment: data };
    },

    update: async (_token: string, id: string, equipmentData: any) => {
      const data = await fetchApi(`/equipment/${id}`, {
        method: 'PUT',
        body: JSON.stringify(equipmentData),
      });
      return { equipment: data };
    },

    delete: async (_token: string, id: string) => {
      await fetchApi(`/equipment/${id}`, {
        method: 'DELETE',
      });
      return { success: true };
    },

    uploadPhoto: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/equipment/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      return response.json();
    },

    deletePhoto: async (filePath: string) => {
      await fetchApi('/equipment/delete-photo', {
        method: 'POST',
        body: JSON.stringify({ filePath }),
      });
      return { success: true };
    },
  },
};
