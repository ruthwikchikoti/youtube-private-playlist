export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { isValid: false, message: 'Email is required' };
  if (!regex.test(email)) return { isValid: false, message: 'Invalid email format' };
  return { isValid: true, message: '' };
};

export const validateOTP = (otp) => {
  if (!otp) return { isValid: false, message: 'OTP is required' };
  if (!/^\d{6}$/.test(otp)) return { isValid: false, message: 'OTP must be 6 digits' };
  return { isValid: true, message: '' };
};

export const validatePassword = (password) => {
  if (!password) return { isValid: false, message: 'Password is required' };
  if (password.length < 8) return { isValid: false, message: 'Password must be at least 8 characters' };
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
    return { 
      isValid: false, 
      message: 'Password must include uppercase, lowercase, numbers and special characters' 
    };
  }

  return { isValid: true, message: '' };
};