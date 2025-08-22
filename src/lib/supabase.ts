import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { User, Building, Hash, Phone, Save, CheckCircle } from 'lucide-react'

interface ProfileData {
  business_name: string | null
  phone_number: string | null
  abn: string | null
  full_name: string | null
}

export default function Settings() {
  const { user, isTrialExpired } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    business_name: '',
    phone_number: '',
    abn: '',
    full_name: ''
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('business_name, phone_number, abn, full_name')
        .eq('id', user!.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 means no rows found
      
      if (data) {
        setProfileData({
          business_name: data.business_name || '',
          phone_number: data.phone_number || '',
          abn: data.abn || '',
          full_name: data.full_name || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user!.id)

      if (error) throw error

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error saving profile. Please try again.')
    } finally {
      setSaving(false)
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your business profile and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Business Profile</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">This information will appear on your invoices</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Email Address</span>
                </div>
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Full Name</span>
                </div>
              </label>
              <input
                type="text"
                value={profileData.full_name || ''}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-colors"
                placeholder="e.g., John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Business Name</span>
                </div>
              </label>
              <input
                type="text"
                value={profileData.business_name || ''}
                onChange={(e) => setProfileData({ ...profileData, business_name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-colors"
                placeholder="e.g., Sweet Treats Bakery"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4" />
                  <span>ABN (Australian Business Number)</span>
                </div>
              </label>
              <input
                type="text"
                value={profileData.abn || ''}
                onChange={(e) => setProfileData({ ...profileData, abn: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-colors"
                placeholder="e.g., 12 345 678 901"
                maxLength={14}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This will appear on your invoices</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone Number</span>
                </div>
              </label>
              <input
                type="tel"
                value={profileData.phone_number || ''}
                onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-colors"
                placeholder="e.g., +61 2 1234 5678"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 focus:ring-4 focus:ring-amber-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : saved ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Account Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Account Information</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Status</h3>
              {isTrialExpired ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Trial Expired
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subscription Plan</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isTrialExpired ? 'Upgrade Required' : '7-Day Free Trial'}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Need help? Contact support at{' '}
                <a href="mailto:hello@pix3l.com.au" className="text-amber-600 hover:text-amber-700">
                  hello@pix3l.com.au
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}