import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import { Plus, Search, Calendar, DollarSign, Edit, Clock, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface Order {
  id: string
  customer_name: string
  order_details: string
  due_date: string
  status: string
  amount: number
  created_at: string
}

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    order_details: '',
    due_date: '',
    amount: 0,
    status: 'Inquiry'
  })

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    if (!user) return
    try {
      const response: any = await api.orders.getAll('')
      setOrders(response.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!user) return

      if (editingOrder) {
        await api.orders.update('', editingOrder.id, formData)
      } else {
        await api.orders.create('', formData)
      }

      setFormData({
        customer_name: '',
        order_details: '',
        due_date: '',
        amount: 0,
        status: 'Inquiry'
      })
      setShowForm(false)
      setEditingOrder(null)
      fetchOrders()
    } catch (error) {
      console.error('Error saving order:', error)
    }
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order)
    setFormData({
      customer_name: order.customer_name,
      order_details: order.order_details,
      due_date: order.due_date,
      amount: order.amount,
      status: order.status
    })
    setShowForm(true)
  }

  const handleCancelOrder = () => {
    setShowForm(false)
    setEditingOrder(null)
    setFormData({
      customer_name: '',
      order_details: '',
      due_date: '',
      amount: 0,
      status: 'Inquiry'
    })
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!user) return
    try {
      await api.orders.update('', orderId, { status: newStatus })
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handleDeleteOrder = async () => {
    if (!user || !deletingOrder) return
    try {
      await api.orders.delete('', deletingOrder.id)
      setShowDeleteConfirm(false)
      setDeletingOrder(null)
      fetchOrders()
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }

  const confirmDelete = (order: Order) => {
    setDeletingOrder(order)
    setShowDeleteConfirm(true)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setDeletingOrder(null)
  }

  const filteredOrders = orders.filter(order =>
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.order_details.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const upcomingOrders = orders
    .filter(order => {
      const dueDate = new Date(order.due_date)
      const today = new Date()
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      return dueDate >= today && dueDate <= nextWeek && order.status !== 'Delivered'
    })
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 8)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Inquiry': return 'bg-gray-100 text-gray-800'
      case 'Confirmed': return 'bg-green-100 text-green-800'
      case 'Baking': return 'bg-blue-100 text-blue-800'
      case 'Ready': return 'bg-teal-100 text-teal-800'
      case 'Delivered': return 'bg-emerald-100 text-emerald-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-600">Manage your customer orders and track their progress</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Order</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Orders Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Orders</h2>
            </div>
          </div>
          <div className="p-6">
            {upcomingOrders.length > 0 ? (
              <div className="space-y-3">
                {upcomingOrders.map((order) => (
                  <div key={order.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 text-sm">{order.customer_name}</h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{order.order_details}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="p-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                          title="Edit order"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(order)}
                          className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{format(new Date(order.due_date), 'MMM dd')}</span>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Inquiry">Inquiry</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Baking">Baking</option>
                        <option value="Ready">Ready</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">${order.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming orders</p>
                <p className="text-xs text-gray-400 mt-1">Orders due in next 7 days</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium mt-2"
                >
                  Create your first order
                </button>
              </div>
            )}
          </div>
        </div>

        {/* All Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">All Orders</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by customer or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{minWidth: '150px'}}>
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{minWidth: '200px'}}>
                      Order Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{minWidth: '140px'}}>
                      Due Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{minWidth: '120px'}}>
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{minWidth: '140px'}}>
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{minWidth: '100px'}}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{order.customer_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 max-w-xs">{order.order_details}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{format(new Date(order.due_date), 'MMM dd, yyyy')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">${order.amount.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                        >
                          <option value="Inquiry">Inquiry</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Baking">Baking</option>
                          <option value="Ready">Ready</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                            title="Edit order"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(order)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base mb-1">{order.customer_name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{order.order_details}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={() => handleEditOrder(order)}
                      className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                      title="Edit order"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete(order)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Delete order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <div className="flex items-center space-x-2 text-gray-500 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">Due Date</span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{format(new Date(order.due_date), 'MMM dd, yyyy')}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-gray-500 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">Amount</span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">${order.amount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  >
                    <option value="Inquiry">Inquiry</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Baking">Baking</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No orders found</div>
              <button
                onClick={() => setShowForm(true)}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                Create your first order
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Order Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingOrder ? 'Edit Order' : 'New Order'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Details
                </label>
                <textarea
                  value={formData.order_details}
                  onChange={(e) => setFormData({ ...formData, order_details: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                >
                  <option value="Inquiry">Inquiry</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Baking">Baking</option>
                  <option value="Ready">Ready</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors"
                >
                  {editingOrder ? 'Update Order' : 'Create Order'}
                </button>
                {editingOrder && (
                  <button
                    type="button"
                    onClick={() => confirmDelete(editingOrder)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Delete Order</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm font-medium text-gray-700">Order Details:</p>
              <p className="text-sm text-gray-900 mt-1"><strong>Customer:</strong> {deletingOrder.customer_name}</p>
              <p className="text-sm text-gray-900 mt-1"><strong>Details:</strong> {deletingOrder.order_details}</p>
              <p className="text-sm text-gray-900 mt-1"><strong>Amount:</strong> ${deletingOrder.amount.toFixed(2)}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteOrder}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Order
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}