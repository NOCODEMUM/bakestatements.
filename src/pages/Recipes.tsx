import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import { Plus, Calculator, Package, DollarSign, Edit, Trash2 } from 'lucide-react'

interface Ingredient {
  id: string
  name: string
  cost_per_unit: number
  unit_type: string
}

interface Recipe {
  id: string
  name: string
  batch_size: number
  total_cost?: number
  cost_per_unit?: number
  suggested_price?: number
  ingredients?: Array<{
    ingredient: Ingredient
    quantity: number
  }>
}

interface RecipeIngredient {
  id: string
  recipe_id: string
  ingredient_id: string
  quantity: number
  ingredient: Ingredient
}

export default function Recipes() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [showIngredientForm, setShowIngredientForm] = useState(false)
  const [showRecipeForm, setShowRecipeForm] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  const [ingredientForm, setIngredientForm] = useState({
    name: '',
    cost_per_unit: 0,
    unit_type: 'kg'
  })

  const [recipeForm, setRecipeForm] = useState({
    name: '',
    batch_size: 1,
    ingredients: [] as Array<{ ingredient_id: string, quantity: number }>
  })

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return
    try {
      const ingredientsResponse: any = await api.ingredients.getAll('')
      const recipesResponse: any = await api.recipes.getAll('')

      const ingredientsData = ingredientsResponse.ingredients || []
      const recipesData = recipesResponse.recipes || []

      setIngredients(ingredientsData || [])
      
      // Calculate costs for recipes
      const recipesWithCosts = recipesData?.map(recipe => {
        const totalCost = recipe.recipe_ingredients?.reduce((sum: number, ri: any) => {
          return sum + (ri.quantity * ri.ingredient.cost_per_unit)
        }, 0) || 0
        
        const costPerUnit = recipe.batch_size > 0 ? totalCost / recipe.batch_size : 0
        const suggestedPrice = costPerUnit * 2.5 // 150% markup

        return {
          ...recipe,
          total_cost: totalCost,
          cost_per_unit: costPerUnit,
          suggested_price: suggestedPrice,
          ingredients: recipe.recipe_ingredients?.map((ri: any) => ({
            ingredient: ri.ingredient,
            quantity: ri.quantity
          })) || []
        }
      }) || []

      setRecipes(recipesWithCosts)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleIngredientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!user) return
      await api.ingredients.create('', ingredientForm)

      setIngredientForm({ name: '', cost_per_unit: 0, unit_type: 'kg' })
      setShowIngredientForm(false)
      fetchData()
    } catch (error) {
      console.error('Error creating ingredient:', error)
    }
  }

  const handleRecipeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!user) return
      await api.recipes.create('', {
        name: recipeForm.name,
        batch_size: recipeForm.batch_size,
        ingredients: recipeForm.ingredients
      })

      setRecipeForm({ name: '', batch_size: 1, ingredients: [] })
      setShowRecipeForm(false)
      fetchData()
    } catch (error) {
      console.error('Error creating recipe:', error)
    }
  }

  const addIngredientToRecipe = () => {
    setRecipeForm({
      ...recipeForm,
      ingredients: [...recipeForm.ingredients, { ingredient_id: '', quantity: 0 }]
    })
  }

  const updateRecipeIngredient = (index: number, field: string, value: any) => {
    const updatedIngredients = recipeForm.ingredients.map((ingredient, i) => 
      i === index ? { ...ingredient, [field]: value } : ingredient
    )
    setRecipeForm({ ...recipeForm, ingredients: updatedIngredients })
  }

  const removeRecipeIngredient = (index: number) => {
    setRecipeForm({
      ...recipeForm,
      ingredients: recipeForm.ingredients.filter((_, i) => i !== index)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Recipes & Costing</h1>
          <p className="text-gray-600">Manage your recipes and calculate accurate costs</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowIngredientForm(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
          >
            <Package className="w-5 h-5" />
            <span>Add Ingredient</span>
          </button>
          <button
            onClick={() => setShowRecipeForm(true)}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Recipe</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ingredients Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-800">Ingredients</h2>
            </div>
          </div>
          <div className="p-6">
            {ingredients.length > 0 ? (
              <div className="space-y-3">
                {ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">{ingredient.name}</h3>
                      <p className="text-sm text-gray-600">
                        ${ingredient.cost_per_unit.toFixed(2)} per {ingredient.unit_type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No ingredients added yet</p>
                <button
                  onClick={() => setShowIngredientForm(true)}
                  className="text-green-600 hover:text-green-700 font-medium mt-2"
                >
                  Add your first ingredient
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recipes Panel */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-gray-800">Recipes</h2>
            </div>
          </div>
          <div className="p-6">
            {recipes.length > 0 ? (
              <div className="space-y-4">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{recipe.name}</h3>
                      <span className="text-sm text-gray-500">Batch size: {recipe.batch_size}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-lg font-bold text-red-600">
                          ${recipe.total_cost?.toFixed(2) || '0.00'}
                        </div>
                        <div className="text-sm text-gray-600">Total Cost</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          ${recipe.cost_per_unit?.toFixed(2) || '0.00'}
                        </div>
                        <div className="text-sm text-gray-600">Cost per Unit</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          ${recipe.suggested_price?.toFixed(2) || '0.00'}
                        </div>
                        <div className="text-sm text-gray-600">Suggested Price (150% markup)</div>
                      </div>
                    </div>

                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Ingredients:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {recipe.ingredients.map((ingredient, index) => (
                            <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                              <span>{ingredient.ingredient.name}</span>
                              <span className="font-medium">
                                {ingredient.quantity} {ingredient.ingredient.unit_type}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recipes created yet</p>
                <button
                  onClick={() => setShowRecipeForm(true)}
                  className="text-amber-600 hover:text-amber-700 font-medium mt-2"
                >
                  Create your first recipe
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Ingredient Modal */}
      {showIngredientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Add Ingredient</h2>
            <form onSubmit={handleIngredientSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredient Name
                </label>
                <input
                  type="text"
                  value={ingredientForm.name}
                  onChange={(e) => setIngredientForm({ ...ingredientForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Plain Flour"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost per Unit ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={ingredientForm.cost_per_unit}
                  onChange={(e) => setIngredientForm({ ...ingredientForm, cost_per_unit: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Type
                </label>
                <select
                  value={ingredientForm.unit_type}
                  onChange={(e) => setIngredientForm({ ...ingredientForm, unit_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="L">Litre (L)</option>
                  <option value="mL">Millilitre (mL)</option>
                  <option value="dozen">Dozen</option>
                  <option value="piece">Piece</option>
                </select>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Add Ingredient
                </button>
                <button
                  type="button"
                  onClick={() => setShowIngredientForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Recipe Modal */}
      {showRecipeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Create Recipe</h2>
            <form onSubmit={handleRecipeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe Name
                </label>
                <input
                  type="text"
                  value={recipeForm.name}
                  onChange={(e) => setRecipeForm({ ...recipeForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Chocolate Chip Cookies"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Size
                </label>
                <input
                  type="number"
                  min="1"
                  value={recipeForm.batch_size}
                  onChange={(e) => setRecipeForm({ ...recipeForm, batch_size: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Number of units this recipe makes"
                  required
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Ingredients
                  </label>
                  <button
                    type="button"
                    onClick={addIngredientToRecipe}
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    + Add Ingredient
                  </button>
                </div>
                
                {recipeForm.ingredients.map((recipeIngredient, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <select
                      value={recipeIngredient.ingredient_id}
                      onChange={(e) => updateRecipeIngredient(index, 'ingredient_id', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select ingredient...</option>
                      {ingredients.map(ingredient => (
                        <option key={ingredient.id} value={ingredient.id}>
                          {ingredient.name} (${ingredient.cost_per_unit}/{ingredient.unit_type})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={recipeIngredient.quantity}
                      onChange={(e) => updateRecipeIngredient(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Qty"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeRecipeIngredient(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Create Recipe
                </button>
                <button
                  type="button"
                  onClick={() => setShowRecipeForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}