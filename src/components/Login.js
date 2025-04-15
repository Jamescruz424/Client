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
