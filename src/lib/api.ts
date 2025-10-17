import { supabase } from './supabase';

export const api = {
  auth: {
    getProfile: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return { user: data };
    },

    updateProfile: async (_token: string, profileData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;
      return { success: true };
    },
  },

  orders: {
    getAll: async (_token: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { orders: data || [] };
    },

    getOne: async (_token: string, id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return { order: data };
    },

    create: async (_token: string, orderData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return { order: data };
    },

    update: async (_token: string, id: string, orderData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .update(orderData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { order: data };
    },

    delete: async (_token: string, id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    },
  },

  expenses: {
    getAll: async (_token: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return { expenses: data || [] };
    },

    getSummary: async (_token: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('expenses')
        .select('category, amount')
        .eq('user_id', user.id);

      if (error) throw error;
      return { summary: data || [] };
    },

    getOne: async (_token: string, id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return { expense: data };
    },

    create: async (_token: string, expenseData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...expenseData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return { expense: data };
    },

    update: async (_token: string, id: string, expenseData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('expenses')
        .update(expenseData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { expense: data };
    },

    delete: async (_token: string, id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    },
  },

  recipes: {
    getAll: async (_token: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (
            id,
            quantity,
            ingredient:ingredients (
              id,
              name,
              cost_per_unit,
              unit_type
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { recipes: data || [] };
    },

    getOne: async (_token: string, id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (
            id,
            quantity,
            ingredient:ingredients (
              id,
              name,
              cost_per_unit,
              unit_type
            )
          )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return { recipe: data };
    },

    calculateCost: async (_token: string, id: string) => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (
            quantity,
            ingredient:ingredients (
              cost_per_unit
            )
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      const totalCost = data?.recipe_ingredients?.reduce((sum: number, ri: any) => {
        return sum + (ri.quantity * ri.ingredient.cost_per_unit);
      }, 0) || 0;

      return { cost: totalCost };
    },

    create: async (_token: string, recipeData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { name, batch_size, ingredients } = recipeData;

      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          name,
          batch_size,
          user_id: user.id,
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      if (ingredients && ingredients.length > 0) {
        const recipeIngredients = ingredients.map((ing: any) => ({
          recipe_id: recipe.id,
          ingredient_id: ing.ingredient_id,
          quantity: ing.quantity,
        }));

        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(recipeIngredients);

        if (ingredientsError) throw ingredientsError;
      }

      return { recipe };
    },

    update: async (_token: string, id: string, recipeData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('recipes')
        .update(recipeData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { recipe: data };
    },

    delete: async (_token: string, id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error} = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    },
  },

  ingredients: {
    getAll: async (_token: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      return { ingredients: data || [] };
    },

    getOne: async (_token: string, id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return { ingredient: data };
    },

    create: async (_token: string, ingredientData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('ingredients')
        .insert({
          ...ingredientData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return { ingredient: data };
    },

    update: async (_token: string, id: string, ingredientData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('ingredients')
        .update(ingredientData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { ingredient: data };
    },

    delete: async (_token: string, id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    },
  },

  stripe: {
    createCheckout: async (_token: string, priceId: string, mode: string = 'subscription') => {
      throw new Error('Stripe integration not yet implemented');
    },

    getSubscriptionStatus: async (_token: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_tier')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  },

  enquiries: {
    getAll: async (_token: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { enquiries: data || [] };
    },

    create: async (enquiryData: any) => {
      const { data, error } = await supabase
        .from('enquiries')
        .insert(enquiryData)
        .select()
        .single();

      if (error) throw error;
      return { enquiry: data };
    },

    delete: async (_token: string, id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('enquiries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    },
  },

  invoices: {
    getAll: async (_token: string) => {
      return api.orders.getAll(_token);
    },

    create: async (_token: string, data: any) => {
      return api.orders.create(_token, data);
    },

    delete: async (_token: string, id: string) => {
      return api.orders.delete(_token, id);
    },
  },

  calendar: {
    getEvents: async (_token: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .select('id, customer_name, order_details, due_date, status, amount')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return { events: data || [] };
    },
  },
};
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

  enquiries: {
    getAll: (token: string) =>
      request('/enquiries', { token }),

    create: (data: any) =>
      request('/enquiries', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    delete: (token: string, id: string) =>
      request(`/enquiries/${id}`, {
        method: 'DELETE',
        token,
      }),
  },

  invoices: {
    getAll: (token: string) =>
      request('/invoices', { token }),

    create: (token: string, data: any) =>
      request('/invoices', {
        method: 'POST',
        token,
        body: JSON.stringify(data),
      }),

    delete: (token: string, id: string) =>
      request(`/invoices/${id}`, {
        method: 'DELETE',
        token,
      }),
  },

  calendar: {
    getEvents: (token: string) =>
      request('/calendar/events', { token }),
  },
};

export { ApiError };
