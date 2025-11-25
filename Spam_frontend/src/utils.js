export function formatSnippet(text) {
  if (!text) return "";
  return text.length > 80 ? text.slice(0, 77) + "..." : text;
}

export function isValidEmail(email) {
  // Only allow gmail.com domain
  const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9.+_-]*@gmail\.com$/;
  return emailRegex.test(email);
}
