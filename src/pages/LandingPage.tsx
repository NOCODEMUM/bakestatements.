import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Menu, X, Check, ChefHat, Mail, CheckCircle } from 'lucide-react'
import './LandingPage.css'

export default function LandingPage() {
  const [mailingEmail, setMailingEmail] = useState('')
  const [mailingSubmitted, setMailingSubmitted] = useState(false)
  const [mailingLoading, setMailingLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  const handleMailingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMailingLoading(true)
    setSubmitMessage('')
    
    try {
      const { error } = await supabase
        .from('mailing_list')
        .insert([{ email: mailingEmail }])

      if (error) {
        if (error.message?.includes('duplicate key value violates unique constraint')) {
          setSubmitMessage('You\'re already on our waiting list! We\'ll be in touch soon.')
        } else {
          throw error
        }
      } else {
        setMailingSubmitted(true)
        setSubmitMessage('Welcome to the waiting list! We\'ll notify you when BakeStatements launches.')
      }
      
      setMailingEmail('')
      
      // Reset after 5 seconds
      setTimeout(() => {
        setMailingSubmitted(false)
        setSubmitMessage('')
      }, 5000)
    } catch (error) {
      console.error('Error submitting email:', error)
      setSubmitMessage('Something went wrong. Please try again.')
    } finally {
      setMailingLoading(false)
    }
  }

  return (
    <div className="landing-page min-h-screen bg-gradient-to-br from-teal-50 to-amber-50">
      {/* Header */}
      <header className="header-fixed">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <ChefHat className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
              </div>
              <span className="text-lg md:text-xl font-bold text-teal-600">BakeStatements</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
              >
                Features
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
              <button 
                onClick={() => scrollToSection('waitlist')}
                className="bg-amber-500 text-white px-6 py-2 rounded-full font-bold hover:bg-amber-600 transition-colors shadow-lg"
              >
                Join Waiting List
              </button>
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
                <a href="/about-us" className="block py-2 text-gray-600 hover:text-teal-600 font-medium">
                  About Us
                </a>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block w-full text-left py-2 text-gray-600 hover:text-teal-600 font-medium"
                >
                  Contact
                </button>
                <div className="pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => scrollToSection('waitlist')}
                    className="block w-full bg-amber-500 text-white text-center py-3 px-4 rounded-lg font-bold hover:bg-amber-600 transition-colors"
                  >
                    Join Waiting List
                  </button>
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
        </section>

        {/* Hero Content Section - positioned below hero image */}
        <section className="mt-[400px]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              Professional Bakery Management for Australian Bakers
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              The complete business toolkit that helps you turn your baking passion into profitable success
            </p>
            <button 
              onClick={() => scrollToSection('waitlist')}
              className="btn-primary"
            >
              Join the Waiting List
            </button>
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

        {/* Why BakeStatements Section */}
        <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-teal-600 to-amber-600 text-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8">
              Why Australian Bakers Choose BakeStatements
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-12 md:mt-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  🇦🇺
                </div>
                <h3 className="text-xl font-bold mb-3">Built for Australia</h3>
                <p className="opacity-90 leading-relaxed">
                  ATO compliance, ABN integration, and GST calculations built right in. 
                  No more wrestling with overseas software that doesn't understand Australian business.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  🍞
                </div>
                <h3 className="text-xl font-bold mb-3">Made by Makers</h3>
                <p className="opacity-90 leading-relaxed">
                  Created by PIX3L, who've spent 5 years working directly with Australian bakers and makers. 
                  We understand your challenges because we've lived them.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  ⚡
                </div>
                <h3 className="text-xl font-bold mb-3">Simple & Powerful</h3>
                <p className="opacity-90 leading-relaxed">
                  No complicated setup or steep learning curves. Get up and running in minutes, 
                  not days. Focus on baking, we'll handle the business side.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Waiting List Section */}
        <section id="waitlist" className="py-16 md:py-24 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
                Be First to Experience the Future of Bakery Management
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                BakeStatements is launching soon! Join our exclusive waiting list to get early access, 
                special launch pricing, and be among the first Australian bakers to revolutionize their business operations.
              </p>
            </div>

            {mailingSubmitted ? (
              <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-2xl p-8 md:p-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">Welcome to the Crew!</h3>
                <p className="text-green-700 text-lg">
                  You're now on our exclusive waiting list. We'll send you early access and launch updates 
                  as we get closer to release. Get ready to transform your baking business!
                </p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <form onSubmit={handleMailingSubmit} className="mb-8">
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <input
                      type="email"
                      value={mailingEmail}
                      onChange={(e) => setMailingEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 px-6 py-4 rounded-full text-gray-800 bg-white border-2 border-gray-200 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-200 text-lg transition-all"
                      required
                      disabled={mailingLoading}
                    />
                    <button 
                      type="submit" 
                      className="bg-teal-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={mailingLoading}
                    >
                      {mailingLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Joining...</span>
                        </div>
                      ) : (
                        'Join Waiting List'
                      )}
                    </button>
                  </div>

                  {submitMessage && (
                    <div className={`p-4 rounded-lg text-sm mb-4 ${
                      submitMessage.includes('already on our waiting list') || submitMessage.includes('Welcome to the waiting list')
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                      {submitMessage}
                    </div>
                  )}

                  <div className="text-sm text-gray-500">
                    Join 500+ Australian bakers already on the list • No spam, unsubscribe anytime
                  </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="flex flex-col items-center space-y-3 bg-teal-50 p-6 rounded-xl border border-teal-200">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-teal-600" />
                    </div>
                    <h4 className="font-bold text-gray-800">Early Access</h4>
                    <p className="text-sm text-gray-600 text-center">Be first to try BakeStatements before public launch</p>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-3 bg-amber-50 p-6 rounded-xl border border-amber-200">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-amber-600 text-xl font-bold">%</span>
                    </div>
                    <h4 className="font-bold text-gray-800">Launch Pricing</h4>
                    <p className="text-sm text-gray-600 text-center">Exclusive discounts for waiting list members</p>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-3 bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-xl font-bold">🎁</span>
                    </div>
                    <h4 className="font-bold text-gray-800">Founder's Perks</h4>
                    <p className="text-sm text-gray-600 text-center">Special bonuses and lifetime member benefits</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-16 md:py-24 px-4 bg-gradient-to-br from-amber-100 to-teal-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
              Ready to Transform Your Baking Business?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 leading-relaxed">
              Join hundreds of Australian bakers who are preparing to revolutionize how they manage their business. 
              Don't get left behind when we launch.
            </p>
            
            <button 
              onClick={() => scrollToSection('waitlist')}
              className="bg-amber-500 text-white px-8 py-4 md:px-12 md:py-5 rounded-full text-lg md:text-xl font-bold hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Secure Your Spot on the Waiting List
            </button>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="flex flex-col items-center space-y-2 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-lg">
                <span className="text-2xl">🚀</span>
                <span className="font-semibold text-sm text-gray-700">Launching Soon</span>
              </div>
              <div className="flex flex-col items-center space-y-2 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-lg">
                <span className="text-2xl">🎯</span>
                <span className="font-semibold text-sm text-gray-700">Built for Bakers</span>
              </div>
              <div className="flex flex-col items-center space-y-2 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-lg">
                <span className="text-2xl">🇦🇺</span>
                <span className="font-semibold text-sm text-gray-700">Australian Made</span>
              </div>
              <div className="flex flex-col items-center space-y-2 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-lg">
                <span className="text-2xl">💪</span>
                <span className="font-semibold text-sm text-gray-700">ATO Ready</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
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

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Company</h4>
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
                  <a href="/about-us" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('waitlist')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Join Waiting List
                  </button>
                </li>
                <li>
                  <a href="/enquiry" className="text-gray-300 hover:text-white transition-colors">
                    Get Quote
                  </a>
                </li>
                <li>
                  <a href="/privacy-terms" className="text-gray-300 hover:text-white transition-colors">
                    Privacy & Terms
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
    </div>
  )
}