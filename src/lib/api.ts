import { supabase } from './supabase';

export const api = {
  auth: {
    getProfile: async (_token?: string) => {
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

      const { error } = await supabase
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      const returnUrl = typeof window !== 'undefined' && window.location ? window.location.origin : undefined;

      const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          priceId,
          mode,
          userId: user.id,
          ...(returnUrl ? { returnUrl } : {}),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Failed to create checkout session');
      }

      const data = await response.json();
      return data;
    },

    getSubscriptionStatus: async (_token: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_tier, trial_end_date')
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

  landingPages: {
    getBySlug: async (slug: string) => {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*, profiles(business_name, email, phone_number)')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return { landingPage: data };
    },

    getMyLandingPage: async (_token: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return { landingPage: data };
    },

    create: async (_token: string, landingPageData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('landing_pages')
        .insert({
          ...landingPageData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return { landingPage: data };
    },

    update: async (_token: string, landingPageData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('landing_pages')
        .update(landingPageData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { landingPage: data };
    },

    delete: async (_token: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('landing_pages')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    },

    checkSlugAvailability: async (slug: string, currentUserId?: string) => {
      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase
        .from('landing_pages')
        .select('id')
        .eq('slug', slug);

      if (currentUserId) {
        query = query.neq('user_id', currentUserId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return { available: !data };
    },

    uploadImage: async (file: File, folder: string = 'general') => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('landing-page-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('landing-page-assets')
        .getPublicUrl(fileName);

      return { url: publicUrl, path: fileName };
    },

    deleteImage: async (filePath: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.storage
        .from('landing-page-assets')
        .remove([filePath]);

      if (error) throw error;
      return { success: true };
    },
  },

  equipment: {
    getAll: async (_token: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { equipment: data || [] };
    },

    getOne: async (_token: string, id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return { equipment: data };
    },

    create: async (_token: string, equipmentData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('equipment')
        .insert({
          ...equipmentData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return { equipment: data };
    },

    update: async (_token: string, id: string, equipmentData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('equipment')
        .update({
          ...equipmentData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { equipment: data };
    },

    delete: async (_token: string, id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    },

    uploadPhoto: async (file: File) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('equipment-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('equipment-photos')
        .getPublicUrl(fileName);

      return { url: publicUrl, path: fileName };
    },

    deletePhoto: async (filePath: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.storage
        .from('equipment-photos')
        .remove([filePath]);

      if (error) throw error;
      return { success: true };
    },
  },
};
