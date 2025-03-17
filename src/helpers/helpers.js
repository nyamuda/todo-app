/**
 * format number into a monetary value
 * @param {*} amount  the amount for money
 * @param {*} currency  the currency of the money
 * @param {*} locale  the locale of the money
 * @returns {string} - the the formatted value of the money
 */
let formatCurrency = (amount, currency = "ZAR", locale = "en-ZA") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2, // No decimal places for whole numbers
    maximumFractionDigits: 2, // Ensures decimal places for non-whole numbers
  }).format(amount);
};

/**
 * Returns the title and message for an empty booking list based on the selected filter.
 * @param {string} filter - The filter type (e.g., "completed", "confirmed", "pending", etc.)
 * @param {string} isAdmin - whether the filter is for the admin bookings or normal user bookings
 * @returns {Object} - An object containing the title and message for the given filter.
 */
const getBookingFilterNoItemsMessage = (filter, isAdmin = false) => {
  let value = filter ? filter.toLowerCase() : "";
  switch (value) {
    case "completed":
      return {
        title: "No Completed",
        message: isAdmin
          ? "No client bookings have been completed."
          : "You have no completed bookings.",
      };
    case "confirmed":
      return {
        title: "No Confirmed",
        message: isAdmin
          ? "No client bookings have been confirmed."
          : "You have no confirmed bookings.",
      };
    case "pending":
      return {
        title: "No Pending",
        message: isAdmin
          ? "No client bookings are pending."
          : "There are no pending bookings at the moment.",
      };
    case "cancelled":
      return {
        title: "No Cancelled",
        message: isAdmin
          ? "No client bookings have been cancelled."
          : "You have no cancelled bookings.",
      };
    case "en route":
      return {
        title: "No En Route",
        message: isAdmin
          ? "No client bookings are currently en route."
          : "No bookings are currently en route.",
      };
    default:
      return {
        title: "Nothing Booked Yet",
        message: isAdmin
          ? "No client bookings found yet."
          : "No bookings found at the moment.",
      };
  }
};

export { formatCurrency, getBookingFilterNoItemsMessage };
