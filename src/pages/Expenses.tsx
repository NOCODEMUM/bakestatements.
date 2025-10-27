import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import { Plus, Download, PieChart, Edit, Receipt } from 'lucide-react'
import { format } from 'date-fns'

interface Expense {
  id: string
  date: string
  description: string
  amount: number
  category: string
  created_at: string
}

const ATO_CATEGORIES = [
  'Ingredients',
  'Packaging',
  'Equipment',
  'Utilities',
  'Rent/Kitchen Hire',
  'Marketing',
  'Vehicle/Delivery',
  'Other'
]

export default function Expenses() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    amount: 0,
    category: 'Ingredients'
  })

  useEffect(() => {
    if (user) {
      fetchExpenses()
    }
  }, [user])

  const fetchExpenses = async () => {
    if (!user) return
    try {
      const response: any = await api.expenses.getAll('')
      setExpenses(response.expenses || [])
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      if (editingExpense) {
        await api.expenses.update('', editingExpense.id, formData)
      } else {
        await api.expenses.create('', formData)
      }

      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        amount: 0,
        category: 'Ingredients'
      })
      setShowForm(false)
      setEditingExpense(null)
      fetchExpenses()
    } catch (error) {
      console.error('Error saving expense:', error)
    }
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setFormData({
      date: expense.date,
      description: expense.description,
      amount: expense.amount,
      category: expense.category
    })
    setShowForm(true)
  }

  const handleCancelExpense = () => {
    setShowForm(false)
    setEditingExpense(null)
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      amount: 0,
      category: 'Ingredients'
    })
  }

  const filteredExpenses = selectedCategory === 'All' 
    ? expenses 
    : expenses.filter(expense => expense.category === selectedCategory)

  const categoryTotals = ATO_CATEGORIES.reduce((acc, category) => {
    acc[category] = expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
    return acc
  }, {} as Record<string, number>)

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const exportToCSV = () => {
    const csvHeaders = ['Date', 'Description', 'Amount', 'Category']
    const csvData = expenses.map(expense => [
      expense.date,
      `"${expense.description}"`,
      expense.amount.toFixed(2),
      expense.category
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bakestatements-expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
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
          <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
          <p className="text-gray-600">ATO-compliant expense tracking for your bakery</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportToCSV}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Expenses Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-800">Recent Expenses</h2>
            </div>
          </div>
          <div className="p-6">
            {expenses.length > 0 ? (
              <div className="space-y-3">
                {expenses.slice(0, 8).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800 text-sm">{expense.description}</h3>
                        <button
                          onClick={() => handleEditExpense(expense)}
                          className="p-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                          title="Edit expense"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{format(new Date(expense.date), 'MMM dd')}</span>
                          <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                            {expense.category}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-red-600">${expense.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No expenses recorded yet</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-red-600 hover:text-red-700 font-medium mt-2"
                >
                  Add your first expense
                </button>
              </div>
            )}
          </div>
        </div>

        {/* All Expenses List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">All Expenses</h2>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-red-600">${totalExpenses.toFixed(2)}</span> total
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">
                      ${expenses
                        .filter(expense => {
                          const expenseDate = new Date(expense.date)
                          const now = new Date()
                          return expenseDate.getMonth() === now.getMonth() &&
                                 expenseDate.getFullYear() === now.getFullYear()
                        })
                        .reduce((sum, expense) => sum + expense.amount, 0)
                        .toFixed(2)
                      }
                    </span> this month
                  </div>
                </div>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="All">All Categories</option>
                {ATO_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(expense.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <span className="font-medium text-gray-900">${expense.amount.toFixed(2)}</span>
                        <button
                          onClick={() => handleEditExpense(expense)}
                          className="p-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                          title="Edit expense"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No expenses found</div>
              <button
                onClick={() => setShowForm(true)}
                className="flex-1 bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Add your first expense
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Expense Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingExpense ? 'Edit Expense' : 'Add Expense'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Flour purchase from supplier"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ATO Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                >
                  {ATO_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelExpense}
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