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
