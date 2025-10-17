import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns'

interface Order {
  id: string
  customer_name: string
  order_details: string
  due_date: string
  status: string
  amount: number
}

export default function Calendar() {
  const { user, accessToken } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    if (user && accessToken) {
      fetchOrders()
    }
  }, [user, accessToken])

  const fetchOrders = async () => {
    if (!accessToken) return
    try {
      const response: any = await api.orders.getAll(accessToken)
      setOrders(response.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getOrdersForDate = (date: Date) => {
    return orders.filter(order => isSameDay(new Date(order.due_date), date))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Inquiry': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200'
      case 'Baking': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Ready': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
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
          <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
          <p className="text-gray-600">View your orders by due date</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={previousMonth}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 bg-gray-50 rounded">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            const dayOrders = getOrdersForDate(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border border-gray-100 rounded ${
                  !isCurrentMonth 
                    ? 'bg-gray-50 text-gray-400' 
                    : isToday 
                    ? 'bg-amber-50 border-amber-200' 
                    : 'bg-white'
                }`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday ? 'text-amber-600' : 'text-gray-800'
                }`}>
                  {format(day, 'd')}
                </div>

                <div className="space-y-1">
                  {dayOrders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className={`text-xs p-1 rounded border ${getStatusColor(order.status)}`}
                      title={`${order.customer_name} - ${order.order_details}`}
                    >
                      <div className="font-medium truncate">{order.customer_name}</div>
                      <div className="truncate">{order.order_details.substring(0, 20)}...</div>
                    </div>
                  ))}
                  {dayOrders.length > 3 && (
                    <div className="text-xs text-gray-500 p-1">
                      +{dayOrders.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
            <span>Inquiry</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span>Confirmed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Baking</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
            <span>Ready</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded"></div>
            <span>Delivered</span>
          </div>
        </div>
      </div>

      {/* Upcoming Orders Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Orders</h2>
        </div>

        {orders.filter(order => new Date(order.due_date) >= new Date()).slice(0, 5).length > 0 ? (
          <div className="space-y-3">
            {orders
              .filter(order => new Date(order.due_date) >= new Date())
              .slice(0, 5)
              .map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">{order.customer_name}</h3>
                    <p className="text-sm text-gray-600">{order.order_details}</p>
                    <p className="text-xs text-gray-500">Due: {format(new Date(order.due_date), 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status).replace('border-', 'border ')}`}>
                      {order.status}
                    </span>
                    <p className="text-sm font-medium text-gray-800 mt-1">${order.amount?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming orders</p>
          </div>
        )}
      </div>
    </div>
  )
}