import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, CheckCircle } from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import { api } from '../lib/api'

export default function EnquiryForm() {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  useEffect(() => {
    const packageParam = searchParams.get('package')
    if (packageParam) {
      setFormData(prev => ({
        ...prev,
        message: `Hi! I'm interested in your "${packageParam}" package. Please provide more details.`
      }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userIdParam = searchParams.get('userId')
      const packageParam = searchParams.get('package')
      const landingPageIdParam = searchParams.get('landingPageId')

      await api.enquiries.create({
        ...formData,
        user_id: userIdParam || undefined,
        package_selected: packageParam || undefined,
        landing_page_id: landingPageIdParam || undefined,
        status: 'New'
      })
      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Error submitting enquiry:', error)
      alert('There was an error submitting your enquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50">
        <PublicHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your enquiry has been submitted successfully. We'll get back to you within 24 hours.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setSubmitted(false)}
                className="w-full bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Submit Another Enquiry
              </button>
            </div>
          </div>
        </div>
        <PublicFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50">
      <PublicHeader />

      <main className="py-8 px-4">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Get a Custom Quote</h2>
            <p className="text-gray-600">
              Tell us about your baking needs and we'll provide you with a personalized quote within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tell us about your order
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                rows={5}
                placeholder="Please describe what you'd like us to bake, quantities, dates, dietary requirements, and any other details..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 focus:ring-4 focus:ring-amber-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Enquiry</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• We'll review your enquiry within 24 hours</li>
              <li>• Get a personalized quote via email</li>
              <li>• Schedule a consultation if needed</li>
              <li>• Finalize your order details</li>
            </ul>
          </div>
        </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}