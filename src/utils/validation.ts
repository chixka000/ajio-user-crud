// Email validation utility
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return emailRegex.test(email);
};

// User form validation
export const validateUserForm = (name: string, email: string): string | null => {
  if (!name.trim()) return 'Name is required';
  if (!email.trim()) return 'Email is required';
  if (!validateEmail(email)) return 'Invalid email address';
  return null;
};