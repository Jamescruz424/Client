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
// Update logic for password strength color
const getStrengthColor = () => {
  if (passwordStrength < 33) return 'bg-red-500';
  if (passwordStrength < 66) return 'bg-yellow-500';
  return 'bg-green-500';
};
// Extract PasswordInput component for better readability
const PasswordInput = ({ value, onChange, showPassword, toggleShowPassword }) => (
  <div className="mt-1 relative">
    <input
      type={showPassword ? 'text' : 'password'}
      id="password"
      name="password"
      value={value}
      onChange={onChange}
      required
      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 pr-10 transition-all"
      placeholder="••••••••"
    />
    <button
      type="button"
      onClick={toggleShowPassword}
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
    >
      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
    </button>
  </div>
);
// Use async-await more consistently in handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');
  
  // Password strength check
  if (passwordStrength < 50) {
    setError('Password is too weak.');
    setLoading(false);
    return;
  }

  try {
    const response = await registerUser(formData);
    setSuccess(response.data.message);
    setTimeout(() => navigate('/login'), 1500);
  } catch (error) {
    setError(error.response ? error.response.data.message : 'Registration failed');
  } finally {
    setLoading(false);
  }
};

