import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import { Mail, Calendar, User, MessageSquare, Globe, Link as LinkIcon, Settings } from 'lucide-react'
import { format } from 'date-fns'
import { generateLandingPageUrl } from '../lib/slugUtils'

interface Enquiry {
  id: string
  name: string
  email: string
  message: string
  status: string
  package_selected?: string
  created_at: string
}

interface LandingPage {
  id: string
  slug: string
  is_active: boolean
}

export default function Enquiries() {
  const { user } = useAuth()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingLandingPage, setLoadingLandingPage] = useState(true)

  useEffect(() => {
    if (user) {
      fetchEnquiries()
      fetchLandingPage()
    }
  }, [user])

  const fetchEnquiries = async () => {
    if (!user) return
    try {
      const response: any = await api.enquiries.getAll('')
      setEnquiries(response.enquiries || [])
    } catch (error) {
      console.error('Error fetching enquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLandingPage = async () => {
    if (!user) return
    try {
      const response = await api.landingPages.getMyLandingPage('')
      setLandingPage(response.landingPage)
    } catch (error) {
      console.error('Error fetching landing page:', error)
    } finally {
      setLoadingLandingPage(false)
    }
  }

  const updateEnquiryStatus = async (enquiryId: string, newStatus: string) => {
    if (!user) return
    try {
      await api.enquiries.delete('', enquiryId)
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
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Enquiries</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage customer enquiries and follow up on potential orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Direct Enquiry Form</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Share this link to receive direct enquiries</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-sm">
                  {window.location.origin}/enquiry
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/enquiry`)}
                  className="bg-amber-500 text-white px-3 py-2 rounded text-sm hover:bg-amber-600 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-5 h-5 text-teal-600" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Landing Page</h3>
              </div>
              {loadingLandingPage ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Loading...</span>
                </div>
              ) : landingPage ? (
                landingPage.is_active ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Your landing page is live!</p>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-sm truncate">
                        {generateLandingPageUrl(landingPage.slug)}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(generateLandingPageUrl(landingPage.slug))}
                        className="bg-teal-500 text-white px-3 py-2 rounded text-sm hover:bg-teal-600 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-amber-600 dark:text-amber-400 mb-3">Your landing page is not active yet</p>
                    <a
                      href="/my-landing-page"
                      className="flex items-center space-x-2 text-sm text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Activate in Settings</span>
                    </a>
                  </>
                )
              ) : (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Create your personalized landing page</p>
                  <a
                    href="/my-landing-page"
                    className="inline-flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded text-sm hover:bg-teal-600 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Setup Landing Page</span>
                  </a>
                </>
              )}
            </div>
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
                    <div className="space-y-1">
                      {enquiry.package_selected && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 mb-1">
                          {enquiry.package_selected}
                        </span>
                      )}
                      <div className="text-gray-900 dark:text-gray-100 max-w-xs truncate">
                        {enquiry.message}
                      </div>
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