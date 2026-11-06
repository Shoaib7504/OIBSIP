/**
 * Generates a themed dummy profile avatar matching PizzaCrave brand palette
 * (Deep artisan brick red #941508 background with crisp white typography).
 *
 * @param {string} name - User's display name
 * @returns {string} Fully qualified avatar image URL
 */
export const getDefaultAvatar = (name = "Pizza Craver") => {
  const cleanName = encodeURIComponent((name || "Pizza Craver").trim());
  return `https://ui-avatars.com/api/?name=${cleanName}&background=941508&color=ffffff&bold=true&rounded=true&size=256`;
};

