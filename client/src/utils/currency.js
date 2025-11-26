// Currency utility for South African Rand (ZAR)
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'R 0.00';
  return `R ${parseFloat(amount).toFixed(2)}`;
};

export const formatCurrencyShort = (amount) => {
  if (amount === null || amount === undefined) return 'R0';
  return `R${parseFloat(amount).toFixed(2)}`;
};

