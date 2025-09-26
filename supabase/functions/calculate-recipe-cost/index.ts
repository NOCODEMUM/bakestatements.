import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface RecipeCostData {
  recipeId: string
  laborCostPerHour?: number
  overheadPercentage?: number
  packagingCost?: number
  profitMargin?: number
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: user } = await supabase.auth.getUser(token)

    if (!user.user) {
      throw new Error('User not authenticated')
    }

    const { 
      recipeId, 
      laborCostPerHour = 25, 
      overheadPercentage = 15,
      packagingCost = 0,
      profitMargin = 30
    }: RecipeCostData = await req.json()

    if (!recipeId) {
      throw new Error('Recipe ID is required')
    }

    // Get recipe with ingredients
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (
          quantity,
          ingredient:ingredients (
            name,
            cost_per_unit,
            unit_type
          )
        )
      `)
      .eq('id', recipeId)
      .eq('user_id', user.user.id)
      .single()

    if (recipeError || !recipe) {
      throw new Error('Recipe not found or access denied')
    }

    // Calculate ingredient costs
    const ingredientCosts = recipe.recipe_ingredients?.map((ri: any) => {
      const cost = ri.quantity * ri.ingredient.cost_per_unit
      return {
        ingredient: ri.ingredient.name,
        quantity: ri.quantity,
        unit: ri.ingredient.unit_type,
        unitCost: ri.ingredient.cost_per_unit,
        totalCost: cost,
      }
    }) || []

    const totalIngredientCost = ingredientCosts.reduce((sum, item) => sum + item.totalCost, 0)

    // Calculate labor cost (prep time + baking time in minutes)
    const totalTimeMinutes = (recipe.prep_time || 0) + (recipe.baking_time || 0)
    const laborCost = (totalTimeMinutes / 60) * laborCostPerHour

    // Calculate overhead
    const overheadCost = totalIngredientCost * (overheadPercentage / 100)

    // Total cost per batch
    const totalBatchCost = totalIngredientCost + laborCost + overheadCost + packagingCost

    // Cost per unit
    const costPerUnit = totalBatchCost / (recipe.batch_size || 1)

    // Suggested selling price with profit margin
    const suggestedPrice = costPerUnit * (1 + profitMargin / 100)

    // Update recipe with calculated costs
    const { error: updateError } = await supabase
      .from('recipes')
      .update({
        labor_cost_per_hour: laborCostPerHour,
        overhead_percentage: overheadPercentage,
        packaging_cost: packagingCost,
        profit_margin: profitMargin,
      })
      .eq('id', recipeId)

    if (updateError) {
      console.warn('Could not update recipe with cost parameters:', updateError)
    }

    const result = {
      recipe: {
        id: recipe.id,
        name: recipe.name,
        batch_size: recipe.batch_size,
        prep_time: recipe.prep_time,
        baking_time: recipe.baking_time,
      },
      costs: {
        ingredients: {
          items: ingredientCosts,
          total: totalIngredientCost,
        },
        labor: {
          hours: totalTimeMinutes / 60,
          rate: laborCostPerHour,
          total: laborCost,
        },
        overhead: {
          percentage: overheadPercentage,
          total: overheadCost,
        },
        packaging: packagingCost,
        totalBatchCost,
        costPerUnit,
      },
      pricing: {
        profitMargin,
        suggestedPrice,
        markup: suggestedPrice - costPerUnit,
      },
      calculations: {
        totalTimeMinutes,
        calculatedAt: new Date().toISOString(),
      },
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error calculating recipe cost:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})