import { format } from 'date-fns'

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}

export const formatDate = (date: string | Date, formatString: string = 'MMM dd, yyyy'): string => {
  return format(new Date(date), formatString)
}

export const formatDateShort = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd')
}

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm')
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}
