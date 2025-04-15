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
