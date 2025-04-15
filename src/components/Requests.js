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
// Handle request deletion with confirmation and error handling
const handleDelete = async (requestId) => {
  const userId = localStorage.getItem('userId');
  if (!window.confirm('Are you sure you want to delete this request?')) return;

  setLoading(true);
  setError('');
  setSuccess('');
  try {
    const response = await deleteRequest(requestId, { userId });
    if (response.data.success) {
      setRequests(requests.filter((req) => req.requestId !== requestId));
      setSuccess('Request deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(response.data.message || 'Failed to delete request');
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Error deleting request');
  } finally {
    setLoading(false);
  }
};
// Filter requests based on selected filters (type, status, search)
const filteredRequests = requests.filter((req) => {
  const matchesType = filters.requestType === 'All Request Types' || req.requestType === filters.requestType;
  const matchesStatus = filters.status === 'All Status' || req.status === filters.status;
  const matchesSearch =
    !filters.search || req.requestId.toLowerCase().includes(filters.search.toLowerCase());
  return matchesType && matchesStatus && matchesSearch;
});
// Show loading message if data is being fetched
if (loading && !requests.length) return <div className="p-4 mt-14 text-center">Loading your requests...</div>;
// Show error message if there was an issue fetching the requests
if (error && !requests.length) return <div className="p-4 mt-14 text-center text-red-600">{error}</div>;
// Render filter UI for selecting request type, status, and search query
<div className="flex flex-col sm:flex-row gap-4 mb-6">
  <div className="flex-1">
    <select
      name="requestType"
      value={filters.requestType}
      onChange={handleFilterChange}
      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
      disabled={loading}
    >
      <option>All Request Types</option>
      <option>New Asset</option>
      <option>Return</option>
      <option>Repair</option>
      <option>Transfer</option>
    </select>
  </div>
  <div className="flex-1">
    <select
      name="status"
      value={filters.status}
      onChange={handleFilterChange}
      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
      disabled={loading}
    >
      <option>All Status</option>
      <option>Pending</option>
      <option>Approved</option>
      <option>Rejected</option>
      <option>Completed</option>
    </select>
  </div>
  <div className="flex-1">
    <input
      type="text"
      name="search"
      value={filters.search}
      onChange={handleFilterChange}
      placeholder="Search by request ID..."
      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
      disabled={loading}
    />
  </div>
</div>
