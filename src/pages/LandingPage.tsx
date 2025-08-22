import React, { useState } from 'react'
import StripeCheckout from '../components/StripeCheckout'
import { Menu, X, Check, ChefHat } from 'lucide-react'
import './LandingPage.css'

export default function LandingPage() {
  const [mailingEmail, setMailingEmail] = useState('')
  const [mailingSubmitted, setMailingSubmitted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false) // Close mobile menu after navigation
  }


  const handleMailingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setMailingSubmitted(true)
      setMailingEmail('')
      
      // Reset after 3 seconds
      setTimeout(() => {
        setMailingSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error('Error submitting email:', error)
    }
  }

  return (
    <div className="landing-page min-h-screen bg-gradient-to-br from-teal-50 to-amber-50">
      {/* Header */}
      <header className="header-fixed">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Empty space for logo area */}
            <div></div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
              >
                Pricing
              </button>
              <a href="/about-us" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                About
              </a>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
              >
                Contact
              </button>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="/auth" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                Sign In
              </a>
              <a 
                href="/auth" 
                className="bg-amber-500 text-white px-6 py-2 rounded-full font-bold hover:bg-amber-600 transition-colors shadow-lg"
              >
                Start Free Trial
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
              <div className="px-4 py-6 space-y-4">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="block w-full text-left py-2 text-gray-600 hover:text-teal-600 font-medium"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="block w-full text-left py-2 text-gray-600 hover:text-teal-600 font-medium"
                >
                  Pricing
                </button>
                <a href="/about-us" className="block py-2 text-gray-600 hover:text-teal-600 font-medium">
                  Sign In
                </a>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block w-full text-left py-2 text-gray-600 hover:text-teal-600 font-medium"
                >
                  Contact
                </button>
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <a href="/auth" className="block py-2 text-gray-600 hover:text-teal-600 font-medium">
                    Login
                  </a>
                  <a 
                    href="/auth" 
                    className="block bg-amber-500 text-white text-center py-3 px-4 rounded-lg font-bold hover:bg-amber-600 transition-colors"
                  >
                    Start Free Trial
                  </a>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero__image-container">
            <img 
              src="/20250821_1326_Baking Koala_remix_01k35afawhfm8tcpx1kf95gj8h.png"
              alt="Friendly koala baker with whisk and calculator - BakeStatements mascot"
              className="hero__image"
            />
          </div>
          <div className="hero__overlay"></div>
          <div className="hero__fade-overlay"></div>
          <div className="hero__content">
            <a className="btn-primary" href="/auth">Start Free Trial</a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 px-4 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
                Everything You Need to Scale Your Baking Passion
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Purpose-built tools for Australian bakers who want to turn their passion into profit. 
                We handle the complex business side so you can focus on what you love - creating delicious bakes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Order Management */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 md:p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl md:text-3xl">
                  📋
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Smart Order Management</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Keep track of every customer order from inquiry to delivery. Manage due dates, 
                  track progress, and never miss a deadline again.
                </p>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-teal-700 font-semibold text-sm">
                  Perfect for managing multiple custom orders and catering jobs
                </div>
              </div>

              {/* Expense Tracking */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 md:p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl md:text-3xl">
                  💰
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">ATO-Ready Expense Tracking</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Automatically categorize your business expenses into ATO-friendly buckets. 
                  From ingredients to equipment, make tax time stress-free.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 font-semibold text-sm">
                  Save hours during tax season with pre-organized expense reports
                </div>
              </div>

              {/* Recipe Costing */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 md:p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl md:text-3xl">
                  🧮
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Recipe Costing Calculator</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Know exactly what each recipe costs to make. Input your ingredients, 
                  get accurate pricing, and set profitable prices with confidence.
                </p>
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 text-pink-700 font-semibold text-sm">
                  Stop guessing and start pricing with precision for better profits
                </div>
              </div>

              {/* Professional Invoicing */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 md:p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl md:text-3xl">
                  📄
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Professional Invoicing</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Generate branded, ATO-compliant invoices in seconds. Include your ABN, 
                  business details, and look professional to every client.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 font-semibold text-sm">
                  Build trust with professional invoices that get paid faster
                </div>
              </div>

              {/* Customer Enquiries */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 md:p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl md:text-3xl">
                  ✉️
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Customer Enquiry Forms</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Share your branded enquiry form and receive customer requests directly. 
                  No more missed emails or lost opportunities.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-purple-700 font-semibold text-sm">
                  Streamline customer communication and capture every opportunity
                </div>
              </div>

              {/* Calendar View */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 md:p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl md:text-3xl">
                  📅
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Visual Calendar View</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  See your entire baking schedule at a glance. Plan ahead, avoid overbooking, 
                  and keep your kitchen organized.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 font-semibold text-sm">
                  Never double-book again with clear visual planning tools
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
                Simple Pricing for Growing Bakers
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Start with our 7-day free trial, then choose the plan that fits your baking journey. 
                All plans include every feature you need to succeed.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
              {/* Monthly Plan */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Monthly</h3>
                  <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">
                    $19<span className="text-lg text-gray-500">/month</span>
                  </div>
                  <p className="text-sm text-amber-600 font-semibold">Perfect for getting started</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    'Unlimited orders & recipes',
                    'ATO-compliant expense tracking',
                    'Professional invoicing',
                    'Recipe costing calculator',
                    'Customer enquiry forms',
                    'CSV/PDF exports',
                    'Email support'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-amber-500 text-white py-3 md:py-4 rounded-lg font-bold text-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  Start Monthly Plan
                </button>
              </div>
              
              {/* Annual Plan - Featured */}
              <div className="bg-white border-2 border-teal-500 rounded-2xl p-6 md:p-8 shadow-xl relative md:scale-105 hover:shadow-2xl transition-all duration-300">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </div>
                
                <div className="text-center mb-6 mt-2">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Annual</h3>
                  <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">
                    $180<span className="text-lg text-gray-500">/year</span>
                  </div>
                  <p className="text-sm text-pink-600 font-semibold">Save $48 compared to monthly!</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    'Unlimited orders & recipes',
                    'ATO-compliant expense tracking',
                    'Professional invoicing',
                    'Recipe costing calculator',
                    'Customer enquiry forms',
                    'CSV/PDF exports',
                    'Priority email support'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-teal-600 text-white py-3 md:py-4 rounded-lg font-bold text-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  Start Annual Plan
                </button>
              </div>
              
              {/* Lifetime Plan */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Founder's Lifetime</h3>
                  <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">
                    $299<span className="text-lg text-gray-500"> once</span>
                  </div>
                  <p className="text-sm text-pink-600 font-semibold">Limited time - First 100 users only</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    'Everything in Annual plan',
                    'Lifetime access - no recurring fees',
                    'All future features included',
                    'Priority support for life',
                    'Founder badge & recognition',
                    'Early access to new tools',
                    'Community access'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-pink-600 text-white py-3 md:py-4 rounded-lg font-bold text-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
                >
                  Get Lifetime Access
                </button>
              </div>
            </div>
            
            {/* Trial CTA */}
            <div className="text-center mt-12 md:mt-20">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto shadow-xl">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                  Join Australian Bakers Who've Gone Pro
                </h3>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-6">
                  <a 
                    href="/auth" 
                    className="w-full sm:w-auto bg-amber-500 text-white px-8 py-4 md:px-12 md:py-5 rounded-full text-lg md:text-xl font-bold hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Start Your Free Trial Today
                  </a>
                  <button 
                    onClick={() => scrollToSection('pricing')}
                    className="w-full sm:w-auto bg-white/80 backdrop-blur-sm text-teal-600 px-6 py-3 md:px-8 md:py-4 border-2 border-teal-600 rounded-full text-lg font-semibold hover:bg-teal-600 hover:text-white transition-all duration-300"
                  >
                    View Pricing Plans
                  </button>
                </div>

                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-bold text-sm md:text-base mb-6">
                  <span>✓</span>
                  <span>No Credit Card Required • Cancel Anytime</span>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  Start managing orders, tracking expenses, and generating professional invoices in under 5 minutes. 
                  Risk-free trial with full access to all features – upgrade only when you're ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mailing List Section */}
        <section id="contact" className="py-16 md:py-24 px-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Join the BakeStatements Community
            </h2>
            <p className="text-lg md:text-xl mb-8 md:mb-12 opacity-95 leading-relaxed">
              Get exclusive baking business insights, early access to new features, and proven strategies 
              from successful Australian bakers delivered straight to your inbox.
            </p>
            
            <form onSubmit={handleMailingSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8 md:mb-12">
              <input
                type="email"
                value={mailingEmail}
                onChange={(e) => setMailingEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-6 py-4 rounded-full text-gray-800 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-white/50 text-lg"
                required
                disabled={mailingSubmitted}
              />
              <button 
                type="submit" 
                className="bg-amber-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg disabled:opacity-50"
                disabled={mailingSubmitted}
              >
                {mailingSubmitted ? 'Thanks! ✓' : 'Join Community'}
              </button>
            </form>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="flex flex-col items-center space-y-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                <span className="text-2xl">📧</span>
                <span className="font-semibold text-sm">Join the PIX3L Crew</span>
              </div>
              <div className="flex flex-col items-center space-y-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                <span className="text-2xl">🚀</span>
                <span className="font-semibold text-sm">Early Feature Access</span>
              </div>
              <div className="flex flex-col items-center space-y-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                <span className="text-2xl">🎁</span>
                <span className="font-semibold text-sm">Member-Only Offers</span>
              </div>
              <div className="flex flex-col items-center space-y-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                <span className="text-2xl">🔒</span>
                <span className="font-semibold text-sm">No Spam Promise</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Acknowledgement of Country */}
      <section className="py-12 md:py-16 px-4 bg-white/80">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
            Acknowledgement of Country
          </h3>
          <p className="text-gray-600 leading-relaxed">
            BakeStatements acknowledges the Dharawal people as the Traditional Custodians of the 
            land on which we operate in Macquarie Fields. We pay our respects to Elders past and 
            present, and extend that respect to all Aboriginal and Torres Strait Islander peoples.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 px-4 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <ChefHat className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-xl font-bold">BakeStatements</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                The complete business management platform for Australian bakers. 
                From hobby to profit, we're with you every step of the way.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('pricing')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <a href="/auth" className="text-gray-300 hover:text-white transition-colors">
                    Sign Up
                  </a>
                </li>
                <li>
                  <a href="/enquiry" className="text-gray-300 hover:text-white transition-colors">
                    Get Quote
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/about-us" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <a href="/privacy-terms" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/privacy-terms" className="text-gray-300 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-700 gap-4">
            <p className="text-gray-400">
              © 2025 BakeStatements by <a href="https://www.pix3l.com.au" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">PIX3L</a>. Made with ❤️ in Sydney, Australia.
            </p>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span>🇦🇺</span>
              <span className="font-semibold">From the Creators of <a href="https://www.pix3l.com.au" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200 transition-colors">PIX3L</a></span>
            </div>
          </div>
        </div>
      </footer>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full my-8 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Choose Your Plan</h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <StripeCheckout onClose={() => setShowCheckout(false)} />
          </div>
        </div>
      )}
    </div>
  )
}