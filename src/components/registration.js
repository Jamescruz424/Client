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
// Extract conditional rendering logic to a function
const renderPasswordStrength = () => {
  return (
    <div className="mt-2">
      <div className="h-1 w-full bg-gray-200 rounded-full">
        <div
          className={`h-1 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${passwordStrength}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-600">
        Strength: <span className="font-medium">{getStrengthText()}</span>
      </p>
    </div>
  );
};
// Add helper text for department selection to improve accessibility
<label htmlFor="department" className="block text-sm font-medium text-gray-700">
  Department <span className="text-gray-500 text-xs">(Select your department)</span>
</label>
// Use utility classes for consistent margin/padding adjustments
<div className="mt-4 mb-6">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
  <input
    type="email"
    id="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    className="block w-full mt-1 p-2 border rounded-md"
    placeholder="you@example.com"
  />
</div>
// Create a helper function to render success/error messages
const renderMessage = (type, message) => {
  const bgColor = type === 'error' ? 'bg-red-100' : 'bg-green-100';
  const borderColor = type === 'error' ? 'border-red-500' : 'border-green-500';
  const textColor = type === 'error' ? 'text-red-700' : 'text-green-700';

  return (
    <div className={`${bgColor} border-l-4 ${borderColor} ${textColor} p-4 rounded-lg text-sm`}>
      {message}
    </div>
  );
};

