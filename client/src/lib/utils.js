// This utility file defines reusable utility functions for your application

/**
 * Combines class names with Tailwind CSS
 * @param  {Array} classes - Array of class strings
 * @returns {String} - Combined class string
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats a date to a string
 * @param {Date} date - Date to format
 * @param {String} format - Format string
 * @returns {String} - Formatted date string
 */
export function formatDate(date, format = "YYYY-MM-DD") {
  if (!date) return "";
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  
  return format
    .replace("YYYY", year)
    .replace("MM", month)
    .replace("DD", day);
}

/**
 * Capitalizes the first letter of a string
 * @param {String} string - String to capitalize
 * @returns {String} - Capitalized string
 */
export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
