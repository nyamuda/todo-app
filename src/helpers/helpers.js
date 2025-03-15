//format number into a monetary value
let formatCurrency = (amount, currency = "ZAR", locale = "en-ZA") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2, // No decimal places for whole numbers
    maximumFractionDigits: 2, // Ensures decimal places for non-whole numbers
  }).format(amount);
};

export { formatCurrency };
