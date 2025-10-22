export interface Order {
  id: string
  customer_name: string
  order_details: string
  due_date: string
  status: OrderStatus
  amount: number
  created_at: string
  user_id?: string
}

export type OrderStatus = 'Inquiry' | 'Confirmed' | 'Baking' | 'Ready' | 'Delivered'

export interface Expense {
  id: string
  date: string
  description: string
  amount: number
  category: string
  created_at: string
  user_id?: string
}
