export const getOrderStatusColor = (status: string): string => {
  switch (status) {
    case 'Inquiry':
      return 'bg-gray-100 text-gray-800'
    case 'Confirmed':
      return 'bg-green-100 text-green-800'
    case 'Baking':
      return 'bg-blue-100 text-blue-800'
    case 'Ready':
      return 'bg-teal-100 text-teal-800'
    case 'Delivered':
      return 'bg-emerald-100 text-emerald-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
