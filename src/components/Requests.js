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
