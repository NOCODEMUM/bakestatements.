import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Mail, Calendar, User, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'

interface Enquiry {
  id: string
  name: string
  email: string
  message: string
  status: string
  created_at: string
}

export default function Enquiries() {
  const { user, isDemoMode } = useAuth()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchEnquiries()
    }
  }, [user])

  const fetchEnquiries = async () => {
    // Skip database query in demo mode to avoid UUID error
    if (isDemoMode) {
      setEnquiries([])
      setLoading(false)
      return
    }

    try {
      if (isDemoMode) {
        // Set empty array for demo mode to avoid UUID error
        setEnquiries([])
      } else {
        const { data, error } = await supabase
          .from('enquiries')
          .select('*')
          .or(`user_id.eq.${user!.id},user_id.is.null`)
          .order('created_at', { ascending: false })

        if (error) throw error
        setEnquiries(data || [])
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateEnquiryStatus = async (enquiryId: string, newStatus: string) => {
    if (isDemoMode) {
      // Prevent database operations in demo mode
      return
    }
    
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ status: newStatus })
        .eq('id', enquiryId)

      if (error) throw error
      fetchEnquiries()
    } catch (error) {
      console.error('Error updating enquiry status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800'
      case 'Contacted': return 'bg-yellow-100 text-yellow-800'
      case 'Quoted': return 'bg-purple-100 text-purple-800'
      case 'Archived': return 'bg-gray-100 text-gray-800'
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Enquiries</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage customer enquiries and follow up on potential orders</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Share your enquiry form:</p>
          <div className="flex items-center space-x-2 mt-1">
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
              {window.location.origin}/enquiry
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/enquiry`)}
              className="bg-amber-500 text-white px-3 py-1 rounded text-sm hover:bg-amber-600 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['New', 'Contacted', 'Quoted', 'Archived'].map((status) => {
          const count = enquiries.filter(enquiry => enquiry.status === status).length
          return (
            <div key={status} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Mail className="w-8 h-8 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{status} Enquiries</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{count}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Enquiries List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{enquiry.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{enquiry.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 dark:text-gray-100 max-w-xs truncate">
                      {enquiry.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-100">{format(new Date(enquiry.created_at), 'MMM dd, yyyy')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={enquiry.status}
                      onChange={(e) => updateEnquiryStatus(enquiry.id, e.target.value)}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {enquiries.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No enquiries yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Share your enquiry form link to start receiving customer enquiries</p>
          </div>
        )}
      </div>
    </div>
  )
}