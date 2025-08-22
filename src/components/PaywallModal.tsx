import { X, Crown, Check } from 'lucide-react'
import StripeCheckout from './StripeCheckout'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full my-8 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Crown className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-bold text-gray-800">Upgrade Required</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4">
            Your free trial has ended. Upgrade to continue managing your bakery with BakeStatements.
          </p>
        </div>

        <StripeCheckout compact={true} onClose={onClose} />
      </div>
    </div>
  )
}