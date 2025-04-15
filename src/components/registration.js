// Change state initialization for better readability
const [formData, setFormData] = useState({
  name: '',
  email: '',
  id: '',
  dept: '',
  password: '',
  role: 'user',
});
// Create a utility function for password strength calculation
const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length > 6) strength += 25;
  if (password.match(/[A-Z]/)) strength += 25;
  if (password.match(/[0-9]/)) strength += 25;
  if (password.match(/[^A-Za-z0-9]/)) strength += 25;
  return strength;
};
// Remove console log for submission debug purposes
// console.log('Submitting registration with data:', formData);
// Add a try-catch block to handle errors in the API call
try {
  const response = await registerUser(formData);
  setSuccess(response.data.message);
} catch (error) {
  setError('An unexpected error occurred: ' + error.message);
} finally {
  setLoading(false);
}

