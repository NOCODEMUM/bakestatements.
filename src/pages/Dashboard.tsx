import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePermissions } from '../hooks/usePermissions'
import { api } from '../lib/api'
import { ShoppingCart, DollarSign, TrendingUp, Calendar, FileText, Mail, Wrench, Lock } from 'lucide-react'
import { format } from 'date-fns'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  upcomingOrders: any[]
  pendingInvoices: number
  pendingInvoicesValue: number
  newEnquiries: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const { isReadOnly } = usePermissions()
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    upcomingOrders: [],
    pendingInvoices: 0,
    pendingInvoicesValue: 0,
    newEnquiries: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      const ordersResponse: any = await api.orders.getAll('')
      const expensesResponse: any = await api.expenses.getAll('')
      const enquiriesResponse: any = await api.enquiries.getAll('')

      const orders = ordersResponse.orders || []
      const expenses = expensesResponse.expenses || []
      const enquiries = enquiriesResponse.enquiries || []

      const totalOrders = orders.length
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.amount || 0), 0)
      const totalExpenses = expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0)
      const netProfit = totalRevenue - totalExpenses

      const pendingOrders = orders.filter((order: any) => order.status !== 'Delivered')
      const pendingInvoices = pendingOrders.length
      const pendingInvoicesValue = pendingOrders.reduce((sum: number, order: any) => sum + (order.amount || 0), 0)

      const newEnquiries = enquiries.filter((e: any) => e.status === 'New').length

      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)

      const upcomingOrders = orders.filter((order: any) => {
        const dueDate = new Date(order.due_date)
        const today = new Date()
        return dueDate >= today && dueDate <= nextWeek
      }).slice(0, 5)

      setStats({
        totalOrders,
        totalRevenue,
        totalExpenses,
        netProfit,
        upcomingOrders,
        pendingInvoices,
        pendingInvoicesValue,
        newEnquiries
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your bakery.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Total Expenses"
          value={`$${stats.totalExpenses.toFixed(2)}`}
          icon={DollarSign}
          color="bg-red-500"
        />
        <StatCard
          title="Net Profit"
          value={`$${stats.netProfit.toFixed(2)}`}
          icon={TrendingUp}
          color={stats.netProfit >= 0 ? "bg-emerald-500" : "bg-red-500"}
        />
        <StatCard
          title="Pending Invoices"
          value={stats.pendingInvoices}
          icon={FileText}
          color="bg-orange-500"
        />
        <StatCard
          title="New Enquiries"
          value={stats.newEnquiries}
          icon={Mail}
          color="bg-purple-500"
        />
      </div>

      {/* Upcoming Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Orders</h2>
            </div>
          </div>
          <div className="p-6">
            {stats.upcomingOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">{order.customer_name}</h3>
                      <p className="text-sm text-gray-600">{order.order_details}</p>
                      <p className="text-xs text-gray-500">Due: {format(new Date(order.due_date), 'MMM dd, yyyy')}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        order.status === 'Baking' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Ready' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                      <p className="text-sm font-medium text-gray-800 mt-1">${order.amount?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming orders</p>
                <p className="text-sm text-gray-400">Orders due in the next 7 days will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Invoices Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-800">Pending Invoices</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-orange-600">{stats.pendingInvoices}</div>
              <div className="text-sm text-gray-500">Outstanding invoices</div>
              <div className="text-lg font-semibold text-gray-800 mt-2">
                ${stats.pendingInvoicesValue.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">Total value</div>
            </div>
            {stats.pendingInvoices > 0 && (
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm text-orange-800">
                  You have {stats.pendingInvoices} unpaid invoice{stats.pendingInvoices > 1 ? 's' : ''} 
                  worth ${stats.pendingInvoicesValue.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {isReadOnly ? (
                <>
                  <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed opacity-60 relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute top-2 right-2" />
                    <ShoppingCart className="w-6 h-6 text-gray-500 mb-2" />
                    <p className="text-sm font-medium text-gray-600">New Order</p>
                  </div>
                  <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed opacity-60 relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute top-2 right-2" />
                    <DollarSign className="w-6 h-6 text-gray-500 mb-2" />
                    <p className="text-sm font-medium text-gray-600">Add Expense</p>
                  </div>
                  <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed opacity-60 relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute top-2 right-2" />
                    <Wrench className="w-6 h-6 text-gray-500 mb-2" />
                    <p className="text-sm font-medium text-gray-600">Equipment</p>
                  </div>
                  <Link to="/enquiries" className="p-4 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors group">
                    <Mail className="w-6 h-6 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-gray-800">View Enquiries</p>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/orders" className="p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors group">
                    <ShoppingCart className="w-6 h-6 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-gray-800">New Order</p>
                  </Link>
                  <Link to="/expenses" className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors group">
                    <DollarSign className="w-6 h-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-gray-800">Add Expense</p>
                  </Link>
                  <Link to="/equipment" className="p-4 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors group">
                    <Wrench className="w-6 h-6 text-teal-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-gray-800">Equipment</p>
                  </Link>
                  <Link to="/enquiries" className="p-4 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors group">
                    <Mail className="w-6 h-6 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-gray-800">View Enquiries</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}