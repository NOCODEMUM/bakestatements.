export const calculateGST = (amount: number, rate: number = 0.1): number => {
  return amount * rate
}

export const calculateTotal = (amount: number, gstRate: number = 0.1): number => {
  return amount + calculateGST(amount, gstRate)
}

export const calculateProfit = (revenue: number, expenses: number): number => {
  return revenue - expenses
}

export const calculateMarkup = (cost: number, markupPercentage: number): number => {
  return cost * (1 + markupPercentage / 100)
}

export const calculateCostPerUnit = (totalCost: number, units: number): number => {
  if (units === 0) return 0
  return totalCost / units
}

export const calculateSuggestedPrice = (cost: number, markupPercentage: number = 150): number => {
  return calculateMarkup(cost, markupPercentage)
}
