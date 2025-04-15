const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [success, setSuccess] = useState(''); // Add success state for feedback
const [filters, setFilters] = useState({
  requestType: 'All Request Types',
  status: 'All Status',
  search: '',
});

