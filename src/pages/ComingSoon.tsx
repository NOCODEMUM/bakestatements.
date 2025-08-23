import React from 'react'
import { ChefHat, Clock, Wrench } from 'lucide-react'

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-2xl w-full p-8 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-10 h-10 text-amber-600" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Coming Soon! 🚧
        </h1>
        
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          We're working hard to bring you amazing new features including:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="text-2xl mb-2">📄</div>
            <h3 className="font-semibold text-gray-800 mb-1">Professional Invoicing</h3>
            <p className="text-sm text-gray-600">Generate and send professional invoices</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl mb-2">💳</div>
            <h3 className="font-semibold text-gray-800 mb-1">Payment Processing</h3>
            <p className="text-sm text-gray-600">Accept payments online securely</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-semibold text-gray-800 mb-1">Payment Settings</h3>
            <p className="text-sm text-gray-600">Configure your business details</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-800 mb-1">Advanced Analytics</h3>
            <p className="text-sm text-gray-600">Detailed business insights</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-amber-600 mb-6">
          <Clock className="w-5 h-5" />
          <span className="font-medium">Expected launch: Q2 2025</span>
        </div>
        
        <p className="text-gray-600 mb-6">
          In the meantime, enjoy our core features like order management, expense tracking, 
          and recipe costing to keep your bakery running smoothly!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a 
            href="/orders" 
            className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            Manage Orders
          </a>
          <a 
            href="/expenses" 
            className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors font-medium"
          >
            Track Expenses
          </a>
        </div>
      </div>
    </div>
  )
}