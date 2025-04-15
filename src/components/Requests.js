// Initialize Requests component and state for requests, loading, error, success, and filters
const [requests, setRequests] = useState([]); // Store requests data
const [loading, setLoading] = useState(true); // Track loading state
const [error, setError] = useState(''); // Track error messages
const [success, setSuccess] = useState(''); // Track success messages
const [filters, setFilters] = useState({ // Track filter options
  requestType: 'All Request Types',
  status: 'All Status',
  search: '',
});
// Use useEffect to fetch requests on component mount
useEffect(() => {
  const fetchRequests = async () => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    if (!userId || userRole !== 'user') {
      setError('You must be logged in as a user to view your requests. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await getRequests();
      if (response.data.success) {
        const userRequests = response.data.requests.filter((req) => req.userId === userId);
        setRequests(userRequests);
      } else {
        setError(response.data.message || 'Failed to fetch requests');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching requests');
    } finally {
      setLoading(false);
    }
  };

  fetchRequests();
}, [navigate]);
// Handle filter changes to update filter state
const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setFilters({ ...filters, [name]: value });
};
