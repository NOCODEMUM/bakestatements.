```typescript
            import { useEffect, useState } from 'react'
            import { useParams } from 'react-router-dom'
            import { supabase } from '../lib/supabase'
            import { format } from 'date-fns'
            import { ChefHat, Download, CreditCard, Banknote, Phone, Globe } from 'lucide-react'

            interface InvoiceData {
              id: string
              customer_name: string
              customer_email: string | null
              order_details: string
              due_date: string
              status: string
              amount: number
              created_at: string
              invoice_number: string | null
              public_token: string | null
              user_id: string // Supabase user_id (profile.id)
            }

            interface PaymentSettingsData {
              business_name: string | null
              abn: string | null
              bank_account_name: string | null
              bank_bsb: string | null
              bank_account_number: string | null
              payid: string | null
              stripe_payment_link: string | null
              website: string | null
              notes_to_customer: string | null
            }

            export default function PublicInvoiceView() {
              const { public_token } = useParams<{ public_token: string }>()
              const [invoice, setInvoice] = useState<InvoiceData | null>(null)
              const [paymentSettings, setPaymentSettings] = useState<PaymentSettingsData | null>(null)
              const [loading, setLoading] = useState(true)
              const [error, setError] = useState<string | null>(null)

              useEffect(() => {
                if (public_token) {
                  fetchPublicInvoice()
                } else {
                  setError('Invalid invoice link.')
                  setLoading(false)
                }
              }, [public_token])

              const fetchPublicInvoice = async () => {
                try {
                  // Fetch invoice by public_token
                  const { data: invoiceData, error: invoiceError } = await supabase
                    .from('orders') // Assuming 'orders' table is used for invoices
                    .select('*')
                    .eq('public_token', public_token)
                    .single()

                  if (invoiceError) {
                    if (invoiceError.code === 'PGRST116') { // No rows found
                      setError('Invoice not found or invalid token.')
                    } else {
                      throw invoiceError
                    }
                    return
                  }
                  setInvoice(invoiceData)

                  // Fetch payment settings using the user_id from the invoice
                  const { data: settingsData, error: settingsError } = await supabase
                    .from('payment_settings')
                    .select('*')
                    .eq('user_id', invoiceData.user_id) // Use the Supabase user_id (profile.id) from the invoice
                    .single()

                  if (settingsError && settingsError.code !== 'PGRST116') {
                    console.warn('Could not fetch payment settings for this invoice owner:', settingsError)
                  }
                  setPaymentSettings(settingsData)

                } catch (err: any) {
                  console.error('Error fetching public invoice:', err)
                  setError(err.message || 'Failed to load invoice.')
                } finally {
                  setLoading(false)
                }
              }

              const generatePDF = () => {
                if (!invoice || !paymentSettings) return;

                const businessName = paymentSettings.business_name || 'Your Business Name';
                const abn = paymentSettings.abn ? `ABN: ${paymentSettings.abn}` : '';
                const website = paymentSettings.website ? `<p>Website: <a href="${paymentSettings.website}">${paymentSettings.website}</a></p>` : '';

                const invoiceHTML = `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>Invoice - ${invoice.customer_name}</title>
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
                      ${website}
                    </div>
                    
                    <div class="invoice-details">
                      <h2>Invoice #${invoice.invoice_number || invoice.id.slice(0, 8).toUpperCase()}</h2>
                      <p><strong>Invoice Date:</strong> ${format(new Date(invoice.created_at), 'MMM dd, yyyy')}</p>
                      <p><strong>Due Date:</strong> ${format(new Date(invoice.due_date), 'MMM dd, yyyy')}</p>
                    </div>

                    <div class="customer-info">
                      <h3>Bill To:</h3>
                      <p><strong>${invoice.customer_name}</strong></p>
                      ${invoice.customer_email ? `<p>${invoice.customer_email}</p>` : ''}
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
                          <td>${invoice.order_details}</td>
                          <td>1</td>
                          <td>$${invoice.amount.toFixed(2)}</td>
                          <td>$${invoice.amount.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div class="total">
                      <p>Subtotal: $${invoice.amount.toFixed(2)}</p>
                      <p>GST (10%): $${(invoice.amount * 0.1).toFixed(2)}</p>
                      <p><strong>Total: $${(invoice.amount * 1.1).toFixed(2)}</strong></p>
                    </div>

                    <div class="footer">
                      <p>Thank you for your business!</p>
                      <p>Payment is due by ${format(new Date(invoice.due_date), 'MMM dd, yyyy')}</p>
                      ${paymentSettings.notes_to_customer ? `<p>${paymentSettings.notes_to_customer}</p>` : ''}
                    </div>
                  </body>
                  </html>
                `;

                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(invoiceHTML);
                  printWindow.document.close();
                  printWindow.print();
                }
              };

              if (loading) {
                return (
                  <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                  </div>
                )
              }

              if (error) {
                return (
                  <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                      <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                      <p className="text-gray-600">{error}</p>
                    </div>
                  </div>
                )
              }

              if (!invoice) {
                return (
                  <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Invoice Not Found</h2>
                      <p className="text-gray-600">The invoice you are looking for does not exist or the link is invalid.</p>
                    </div>
                  </div>
                )
              }

              return (
                <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50">
                  {/* Header */}
                  <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex justify-between items-center h-16 md:h-20">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                          <div className="bg-amber-100 p-2 rounded-lg">
                            <ChefHat className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
                          </div>
                          <span className="text-lg md:text-xl font-bold text-teal-600">{paymentSettings?.business_name || 'BakeStatements'}</span>
                        </div>
                        
                        {/* Download Button */}
                        <button
                          onClick={generatePDF}
                          className="bg-emerald-500 text-white px-4 py-2 md:px-6 md:py-2 rounded-full font-bold hover:bg-emerald-600 transition-colors shadow-lg flex items-center space-x-2"
                        >
                          <Download className="w-5 h-5" />
                          <span>Download PDF</span>
                        </button>
                      </div>
                    </nav>
                  </header>

                  {/* Main Content */}
                  <main className="pt-8 pb-16 px-4">
                    <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                      {/* Invoice Header */}
                      <div className="bg-gradient-to-r from-teal-600 to-amber-500 text-white p-6 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Invoice #{invoice.invoice_number || invoice.id.slice(0, 8).toUpperCase()}</h1>
                        <p className="text-teal-100 text-sm md:text-base">
                          Due: {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
                        </p>
                      </div>

                      <div className="p-6 md:p-8 space-y-8">
                        {/* Business Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">From:</h3>
                            <p className="font-medium text-gray-900">{paymentSettings?.business_name || 'Your Business Name'}</p>
                            {paymentSettings?.abn && <p className="text-gray-600">ABN: {paymentSettings.abn}</p>}
                            {paymentSettings?.website && <p className="text-gray-600"><a href={paymentSettings.website} target="_blank" rel="noopener noreferrer">{paymentSettings.website}</a></p>}
                            {paymentSettings?.email_from && <p className="text-gray-600">{paymentSettings.email_from}</p>}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Bill To:</h3>
                            <p className="font-medium text-gray-900">{invoice.customer_name}</p>
                            {invoice.customer_email && <p className="text-gray-600">{invoice.customer_email}</p>}
                          </div>
                        </div>

                        {/* Invoice Items */}
                        <div className="overflow-x-auto">
                          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-white border-b border-gray-200">
                                <td className="px-4 py-3 text-gray-800">{invoice.order_details}</td>
                                <td className="px-4 py-3 text-gray-800">1</td>
                                <td className="px-4 py-3 text-right text-gray-800">${invoice.amount.toFixed(2)}</td>
                                <td className="px-4 py-3 text-right text-gray-800">${invoice.amount.toFixed(2)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end">
                          <div className="w-full md:w-1/2 space-y-2">
                            <div className="flex justify-between text-gray-700">
                              <span>Subtotal:</span>
                              <span>${invoice.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                              <span>GST (10%):</span>
                              <span>${(invoice.amount * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                              <span>Total Due:</span>
                              <span>${(invoice.amount * 1.1).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Instructions */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                            <Banknote className="w-5 h-5 text-amber-600" />
                            <span>Payment Instructions</span>
                          </h3>
                          {paymentSettings?.bank_account_name && paymentSettings?.bank_bsb && paymentSettings?.bank_account_number && (
                            <div>
                              <p className="font-medium text-gray-800">Bank Transfer:</p>
                              <p className="text-gray-700">Account Name: {paymentSettings.bank_account_name}</p>
                              <p className="text-gray-700">BSB: {paymentSettings.bank_bsb}</p>
                              <p className="text-gray-700">Account No: {paymentSettings.bank_account_number}</p>
                            </div>
                          )}
                          {paymentSettings?.payid && (
                            <div>
                              <p className="font-medium text-gray-800">PayID:</p>
                              <p className="text-gray-700">{paymentSettings.payid}</p>
                            </div>
                          )}
                          {paymentSettings?.stripe_payment_link && (
                            <div>
                              <p className="font-medium text-gray-800">Pay by Card:</p>
                              <a href={paymentSettings.stripe_payment_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center space-x-1">
                                <CreditCard className="w-4 h-4" />
                                <span>Pay Securely with Stripe</span>
                              </a>
                            </div>
                          )}
                          {paymentSettings?.notes_to_customer && (
                            <p className="text-gray-700 mt-4">{paymentSettings.notes_to_customer}</p>
                          )}
                          {!paymentSettings?.bank_account_name && !paymentSettings?.payid && !paymentSettings?.stripe_payment_link && (
                            <p className="text-gray-600">No payment instructions configured. Please contact {paymentSettings?.business_name || 'the business'} directly.</p>
                          )}
                        </div>

                        <div className="text-center text-gray-600 text-sm mt-8">
                          <p>Thank you for your business!</p>
                          <p>Invoice status: <span className={`font-semibold ${invoice.status === 'paid' ? 'text-green-600' : invoice.status === 'void' ? 'text-red-600' : 'text-amber-600'}`}>{invoice.status.toUpperCase()}</span></p>
                        </div>
                      </div>
                    </div>
                  </main>

                  {/* Footer */}
                  <footer className="py-8 px-4 bg-white/50">
                    <div className="max-w-4xl mx-auto text-center">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="bg-amber-100 p-2 rounded-lg">
                          <ChefHat className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-lg font-bold text-gray-800">{paymentSettings?.business_name || 'BakeStatements'}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} {paymentSettings?.business_name || 'BakeStatements'}. All rights reserved.
                      </p>
                    </div>
                  </footer>
                </div>
              )
            }
            ```