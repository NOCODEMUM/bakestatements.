import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Building, Mail, Banknote, CreditCard, Globe, Save, CheckCircle, Hash, Phone } from 'lucide-react'

interface PaymentSettingsData {
  business_name: string | null
  abn: string | null
  email_from: string | null
  reply_to: string | null
  bank_account_name: string | null
  bank_bsb: string | null
  bank_account_number: string | null
  payid: string | null
  stripe_payment_link: string | null
  website: string | null
  default_due_days: number | null
  notes_to_customer: string | null
}

export default function PaymentSettings() {
  const { user, profile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settingsData, setSettingsData] = useState<PaymentSettingsData>({
    business_name: '',
    abn: '',
    email_from: '',
    reply_to: '',
    bank_account_name: '',
    bank_bsb: '',
    bank_account_number: '',
    payid: '',
    stripe_payment_link: '',
    website: '',
    default_due_days: 14,
    notes_to_customer: '',
  })

  useEffect(() => {
    if (!authLoading && user && profile) {
      fetchPaymentSettings()
    }
  }, [user, profile, authLoading])

  const fetchPaymentSettings = async () => {
    try {
      const token = await user!.getIdToken()
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/settings/get`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error('Failed to fetch settings')
      
      const { data } = await response.json()
      
      if (data) {
        setSettingsData({
          business_name: data.business_name || '',
          abn: data.abn || '',
          email_from: data.email_from || '',
          reply_to: data.reply_to || '',
          bank_account_name: data.bank_account_name || '',
          bank_bsb: data.bank_bsb || '',
          bank_account_number: data.bank_account_number || '',
          payid: data.payid || '',
          stripe_payment_link: data.stripe_payment_link || '',
          website: data.website || '',
          default_due_days: data.default_due_days || 14,
          notes_to_customer: data.notes_to_customer || '',
        })
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = await user!.getIdToken()
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/settings/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settingsData)
      })

      if (!response.ok) throw new Error('Failed to save settings')

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving payment settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return <div className="text-center text-gray-600">Please sign in to view payment settings.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Payment Settings</h1>
        <p className="text-gray-600">Configure your invoice and payment details</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2"><Building className="w-4 h-4" /><span>Business Name</span></div>
              </label>
              <input type="text" value={settingsData.business_name || ''} onChange={(e) => setSettingsData({ ...settingsData, business_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="e.g., Sweet Treats Bakery" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2"><Hash className="w-4 h-4" /><span>ABN (Australian Business Number)</span></div>
              </label>
              <input type="text" value={settingsData.abn || ''} onChange={(e) => setSettingsData({ ...settingsData, abn: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="e.g., 12 345 678 901" maxLength={14} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2"><Globe className="w-4 h-4" /><span>Website (Optional)</span></div>
              </label>
              <input type="url" value={settingsData.website || ''} onChange={(e) => setSettingsData({ ...settingsData, website: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="https://yourbakery.com.au" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Email Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2"><Mail className="w-4 h-4" /><span>Email From Address</span></div>
              </label>
              <input type="email" value={settingsData.email_from || ''} onChange={(e) => setSettingsData({ ...settingsData, email_from: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="invoices@yourbakery.com.au" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2"><Mail className="w-4 h-4" /><span>Reply-To Address (Optional)</span></div>
              </label>
              <input type="email" value={settingsData.reply_to || ''} onChange={(e) => setSettingsData({ ...settingsData, reply_to: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="support@yourbakery.com.au" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Payment Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2"><Banknote className="w-4 h-4" /><span>Bank Account Name</span></div>
              </label>
              <input type="text" value={settingsData.bank_account_name || ''} onChange={(e) => setSettingsData({ ...settingsData, bank_account_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Your Business Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2"><Banknote className="w-4 h-4" /><span>Bank BSB</span></div>
              </label>
              <input type="text" value={settingsData.bank_bsb || ''} onChange={(e) => setSettingsData({ ...settingsData, bank_bsb: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="000-000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2"><Banknote className="w-4 h-4" /><span>Bank Account Number</span></div>
              </label>
              <input type="text" value={settingsData.bank_account_number || ''} onChange={(e) => setSettingsData({ ...settingsData, bank_account_number: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="123456789" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2"><Phone className="w-4 h-4" /><span>PayID (Optional)</span></div>
              </label>
              <input type="text" value={settingsData.payid || ''} onChange={(e) => setSettingsData({ ...settingsData, payid: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="your.payid@email.com" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2"><CreditCard className="w-4 h-4" /><span>Stripe Payment Link (Optional)</span></div>
              </label>
              <input type="url" value={settingsData.stripe_payment_link || ''} onChange={(e) => setSettingsData({ ...settingsData, stripe_payment_link: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="https://buy.stripe.com/your_link" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Invoice Defaults</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Due Days
              </label>
              <input type="number" value={settingsData.default_due_days || 14} onChange={(e) => setSettingsData({ ...settingsData, default_due_days: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes to Customer (appears on invoice)
              </label>
              <textarea value={settingsData.notes_to_customer || ''} onChange={(e) => setSettingsData({ ...settingsData, notes_to_customer: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" rows={4} placeholder="e.g., Thank you for your order! Please make payment within 14 days."></textarea>
            </div>
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
                <span>Save Settings</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}