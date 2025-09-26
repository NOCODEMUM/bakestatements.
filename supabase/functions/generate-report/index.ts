import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ReportParams {
  type: 'expenses' | 'orders' | 'financial_summary'
  startDate: string
  endDate: string
  format: 'json' | 'csv'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: user } = await supabase.auth.getUser(token)

    if (!user.user) {
      throw new Error('User not authenticated')
    }

    const { type, startDate, endDate, format = 'json' }: ReportParams = await req.json()

    if (!type || !startDate || !endDate) {
      throw new Error('Report type, start date, and end date are required')
    }

    let data: any = null
    let filename = ''

    switch (type) {
      case 'expenses': {
        const { data: expenses, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.user.id)
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: false })

        if (error) throw error

        data = expenses
        filename = `expenses_${startDate}_${endDate}`
        break
      }

      case 'orders': {
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.user.id)
          .gte('created_at', startDate)
          .lte('created_at', endDate)
          .order('created_at', { ascending: false })

        if (error) throw error

        data = orders
        filename = `orders_${startDate}_${endDate}`
        break
      }

      case 'financial_summary': {
        // Get expenses
        const { data: expenses, error: expenseError } = await supabase
          .from('expenses')
          .select('amount, category')
          .eq('user_id', user.user.id)
          .gte('date', startDate)
          .lte('date', endDate)

        if (expenseError) throw expenseError

        // Get orders
        const { data: orders, error: orderError } = await supabase
          .from('orders')
          .select('amount, status')
          .eq('user_id', user.user.id)
          .gte('created_at', startDate)
          .lte('created_at', endDate)

        if (orderError) throw orderError

        // Calculate totals
        const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0
        const totalRevenue = orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0
        const netProfit = totalRevenue - totalExpenses

        // Group expenses by category
        const expensesByCategory = expenses?.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount
          return acc
        }, {} as Record<string, number>) || {}

        // Group orders by status
        const ordersByStatus = orders?.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {}

        data = {
          summary: {
            totalExpenses,
            totalRevenue,
            netProfit,
            expenseCount: expenses?.length || 0,
            orderCount: orders?.length || 0,
          },
          expensesByCategory,
          ordersByStatus,
          period: { startDate, endDate },
        }

        filename = `financial_summary_${startDate}_${endDate}`
        break
      }

      default:
        throw new Error('Invalid report type')
    }

    if (format === 'csv') {
      let csvContent = ''
      
      if (type === 'expenses') {
        csvContent = 'Date,Description,Amount,Category\n'
        csvContent += data.map((expense: any) => 
          `${expense.date},"${expense.description}",${expense.amount},${expense.category}`
        ).join('\n')
      } else if (type === 'orders') {
        csvContent = 'Date,Customer,Details,Amount,Status\n'
        csvContent += data.map((order: any) => 
          `${order.created_at},"${order.customer_name}","${order.order_details}",${order.amount || 0},${order.status}`
        ).join('\n')
      } else {
        // Financial summary as CSV
        csvContent = 'Metric,Value\n'
        csvContent += `Total Revenue,${data.summary.totalRevenue}\n`
        csvContent += `Total Expenses,${data.summary.totalExpenses}\n`
        csvContent += `Net Profit,${data.summary.netProfit}\n`
      }

      return new Response(csvContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`,
        },
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        data,
        filename: `${filename}.json`,
        generatedAt: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error generating report:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})