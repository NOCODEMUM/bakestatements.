import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { FileText, Download, Eye, DollarSign, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'

interface Order {
  id: string
  customer_name: string
  order_details: string
  due_date: string
  status: string
  amount: number
  created_at: string
  is_paid?: boolean
}

export default function Invoices() {
  const { user, isDemoMode } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    if (user) {
      fetchOrders()
      fetchUserProfile()
    }
  }, [user])

  const fetchOrders = async () => {
    if (isDemoMode) {
      setOrders([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user!.id)
        .in('status', ['Confirmed', 'Baking', 'Ready', 'Delivered'])
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProfile = async () => {
    if (isDemoMode) {
      setUserProfile({
        business_name: 'Demo Bakery',
        abn: '12 345 678 901',
        phone_number: '+61 2 1234 5678'
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('business_name, abn, phone_number')
        .eq('id', user!.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const togglePaymentStatus = async (orderId: string, currentStatus: boolean) => {
    if (isDemoMode) {
      return
    }
    
    try {
      // For now, we'll use a custom field. In a real app, you'd have a separate invoices table
      const { error } = await supabase
        .from('orders')
        .update({ 
          // We can't add is_paid directly to orders table without migration
          // So we'll use the status field for payment tracking
          status: currentStatus ? 'Ready' : 'Delivered' 
        })
        .eq('id', orderId)

      if (error) throw error
      fetchOrders()
    } catch (error) {
      console.error('Error updating payment status:', error)
    }
  }

  const generateInvoicePDF = (order: Order) => {
    // Create a simple HTML structure for the invoice
    const businessName = userProfile?.business_name || 'BakeStatements'
    const abn = userProfile?.abn ? `ABN: ${userProfile.abn}` : ''
    const phone = userProfile?.phone_number ? `Phone: ${userProfile.phone_number}` : ''
    
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.customer_name}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { border-bottom: 2px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { color: #f59e0b; font-size: 24px; font-weight: bold; }
            .invoice-details { margin: 20px 0; }
            .customer-info { background: #f9fafb; padding: 15px; border-radius: 8px; }
            .item-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .item-table th, .item-table td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            .item-table th { background: #f3f4f6; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">${businessName}</div>
            <p>Professional Bakery Services</p>
            ${abn ? `<p class="abn">${abn}</p>` : ''}
            ${phone ? `<p>${phone}</p>` : ''}
          </div>
          
          <div class="invoice-details">
            <h2>Invoice #${order.id.slice(0, 8).toUpperCase()}</h2>
            <p><strong>Invoice Date:</strong> ${format(new Date(), 'MMM dd, yyyy')}</p>
            <p><strong>Due Date:</strong> ${format(new Date(order.due_date), 'MMM dd, yyyy')}</p>
          </div>

          <div class="customer-info">
            <h3>Bill To:</h3>
            <p><strong>${order.customer_name}</strong></p>
          </div>

          <table class="item-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${order.order_details}</td>
                <td>1</td>
                <td>$${order.amount.toFixed(2)}</td>
                <td>$${order.amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            <p>Subtotal: $${order.amount.toFixed(2)}</p>
            <p>GST (10%): $${(order.amount * 0.1).toFixed(2)}</p>
            <p><strong>Total: $${(order.amount * 1.1).toFixed(2)}</strong></p>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Payment is due by ${format(new Date(order.due_date), 'MMM dd, yyyy')}</p>
          </div>
        </body>
      </html>
    `

    // Create and download the PDF
    const blob = new Blob([invoiceHTML], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${order.customer_name.replace(/\s+/g, '-').toLowerCase()}-${format(new Date(), 'yyyy-MM-dd')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const viewInvoice = (order: Order) => {
    setSelectedOrder(order)
    setShowInvoiceModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800'
      case 'Baking': return 'bg-blue-100 text-blue-800'
      case 'Ready': return 'bg-purple-100 text-purple-800'
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
          <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
          <p className="text-gray-600">Manage your customer invoices and payments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(order => order.status === 'Delivered').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">
                ${orders
                  .filter(order => order.status !== 'Delivered')
                  .reduce((sum, order) => sum + order.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(order.created_at), 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{order.customer_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 max-w-xs truncate">{order.order_details}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{format(new Date(order.due_date), 'MMM dd, yyyy')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 font-medium">${order.amount.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">+GST ${(order.amount * 0.1).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status === 'Delivered' ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => viewInvoice(order)}
                        className="p-1 text-blue-600 hover:text-blue-700"
                        title="View Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => generateInvoicePDF(order)}
                        className="p-1 text-green-600 hover:text-green-700"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => togglePaymentStatus(order.id, order.status === 'Delivered')}
                        className={`px-2 py-1 text-xs rounded ${
                          order.status === 'Delivered'
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                        }`}
                      >
                        {order.status === 'Delivered' ? 'Mark Unpaid' : 'Mark Paid'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No invoices found</p>
            <p className="text-sm text-gray-400">Confirmed orders will appear here as invoices</p>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Invoice Preview</h2>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Invoice Header */}
              <div className="border-b-2 border-amber-500 pb-4 mb-6">
                <div className="text-2xl font-bold text-amber-600">{userProfile?.business_name || 'BakeStatements'}</div>
                <p className="text-gray-600">Professional Bakery Services</p>
                {userProfile?.abn && (
                  <p className="text-sm text-gray-500">ABN: {userProfile.abn}</p>
                )}
                {userProfile?.phone_number && (
                  <p className="text-sm text-gray-500">Phone: {userProfile.phone_number}</p>
                )}
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Invoice Details</h3>
                  <p><strong>Invoice #:</strong> {selectedOrder.id.slice(0, 8).toUpperCase()}</p>
                  <p><strong>Date:</strong> {format(new Date(), 'MMM dd, yyyy')}</p>
                  <p><strong>Due Date:</strong> {format(new Date(selectedOrder.due_date), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Bill To</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mb-6">
                <table className="w-full border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Qty</th>
                      <th className="border border-gray-200 px-4 py-2 text-right">Rate</th>
                      <th className="border border-gray-200 px-4 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">{selectedOrder.order_details}</td>
                      <td className="border border-gray-200 px-4 py-2">1</td>
                      <td className="border border-gray-200 px-4 py-2 text-right">${selectedOrder.amount.toFixed(2)}</td>
                      <td className="border border-gray-200 px-4 py-2 text-right">${selectedOrder.amount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Invoice Total */}
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>GST (10%):</span>
                    <span>${(selectedOrder.amount * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t font-bold text-lg">
                    <span>Total:</span>
                    <span>${(selectedOrder.amount * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
                <p>Thank you for your business!</p>
                <p>Payment is due by {format(new Date(selectedOrder.due_date), 'MMM dd, yyyy')}</p>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => generateInvoicePDF(selectedOrder)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}