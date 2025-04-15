const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [success, setSuccess] = useState(''); // Add success state for feedback
const [filters, setFilters] = useState({
  requestType: 'All Request Types',
  status: 'All Status',
  search: '',
});
useEffect(() => {
  const fetchOrders = async () => {
    const userRole = localStorage.getItem('userRole');
    console.log('User role:', userRole);

    if (!userRole || userRole !== 'admin') {
      setError('You must be an admin to view this page. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await getRequests(); // Use getRequests from api.js
      console.log('Fetch response:', response.data);
      if (response.data.success) {
        setOrders(response.data.requests);
        console.log('Set orders:', response.data.requests);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || 'Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, [navigate]);
const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setFilters({ ...filters, [name]: value });
};

