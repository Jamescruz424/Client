const [formData, setFormData] = useState({
  role: 'user', // Default to lowercase to match backend expectations
  email: '',
  password: '',
});
const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState(''); // Add success state
const [loading, setLoading] = useState(false);
const handleChange = (e) => {
  const { name, value } = e.target;
  const updatedValue = name === 'role' ? value.toLowerCase() : value;
  setFormData({ ...formData, [name]: updatedValue });
  setError('');
  console.log('Form data updated:', { ...formData, [name]: updatedValue });
};
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');

  if (!formData.email || !formData.password || !formData.role) {
    setError('Please fill in all required fields');
    setLoading(false);
    return;
  }

  console.log('Submitting login with data:', formData);
const response = await loginUser(formData); // Use loginUser from api.js
console.log('Login response:', response.data);
if (response.data.success) {
  const { role, user } = response.data;
  localStorage.setItem('userId', user.id);
  localStorage.setItem('userRole', role);
  console.log('Stored userId:', user.id, 'Role:', role);

  setSuccess('Login successful! Redirecting...');
  setTimeout(() => {
    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else if (role === 'user') {
      navigate('/user-dashboard');
    } else {
      setError('Unknown role received from server');
    }
  }, 1500);
} else {
  setError(response.data.message || 'Login failed');
}
} catch (error) {
  console.error('Login error details:', error);
  if (error.response) {
    setError(error.response.data.message || 'Server error occurred');
  } else if (error.request) {
    setError('Network error: Unable to reach the server');
  } else {
    setError(`An unexpected error occurred: ${error.message}`);
  }
} finally {
  setLoading(false);
}
{error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <span className="block sm:inline">{error}</span>
  </div>
)}
{success && (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
    <span className="block sm:inline">{success}</span>
  </div>
)}
<div>
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
  <div className="mt-1 relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
    </div>
    <input
      id="email"
      name="email"
      type="email"
      required
      value={formData.email}
      onChange={handleChange}
      className="block w-full pl-10 rounded-md border-gray-300 focus:ring-black focus:border-black sm:text-sm"
      placeholder="Enter your email"
    />
  </div>
</div>
<div>
  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
  <div className="mt-1 relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FontAwesomeIcon icon={faLock} className="text-gray-400" />
    </div>
    <input
      id="password"
      name="password"
      type={showPassword ? 'text' : 'password'}
      required
      value={formData.password}
      onChange={handleChange}
      className="block w-full pl-10 pr-10 rounded-md border-gray-300 focus:ring-black focus:border-black sm:text-sm"
      placeholder="Enter your password"
    />
    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
      </button>
    </div>
  </div>
</div>
<div className="flex items-center justify-between">
  <div className="flex items-center">
    <input
      id="remember-me"
      name="remember-me"
      type="checkbox"
      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
    />
    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
  </div>
  <div className="text-sm">
    <a href="#" className="font-medium text-black hover:text-black/80">Forgot password?</a>
  </div>
</div>
<div>
  <button
    type="submit"
    disabled={loading}
    className={`w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
      loading ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    {loading ? 'Signing in...' : 'Sign in'}
  </button>
</div>
