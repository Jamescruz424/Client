import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequests, deleteRequest } from '../services/api'; // Import from api.js (adjust path if needed)

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Add success state for feedback
  const [filters, setFilters] = useState({
    requestType: 'All Request Types',
    status: 'All Status',
    search: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');
      console.log('User ID:', userId, 'User Role:', userRole);

      if (!userId || userRole !== 'user') {
        setError('You must be logged in as a user to view your requests. Redirecting to login...');
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
          const userRequests = response.data.requests.filter((req) => req.userId === userId);
          setRequests(userRequests);
          console.log('Set user requests:', userRequests);
        } else {
          setError(response.data.message || 'Failed to fetch requests');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || 'Error fetching requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleDelete = async (requestId) => {
    const userId = localStorage.getItem('userId');
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await deleteRequest(requestId, { userId }); // Use deleteRequest from api.js
      console.log('Delete response:', response.data);
      if (response.data.success) {
        setRequests(requests.filter((req) => req.requestId !== requestId));
        setSuccess('Request deleted successfully!');
        setTimeout(() => setSuccess(''), 3000); // Clear success message after 3s
      } else {
        setError(response.data.message || 'Failed to delete request');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Error deleting request');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesType = filters.requestType === 'All Request Types' || req.requestType === filters.requestType;
    const matchesStatus = filters.status === 'All Status' || req.status === filters.status;
    const matchesSearch =
      !filters.search || req.requestId.toLowerCase().includes(filters.search.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  if (loading && !requests.length) return <div className="p-4 lg:ml-64 mt-14">Loading your requests...</div>;
  if (error && !requests.length) return <div className="p-4 lg:ml-64 mt-14 text-red-600">{error}</div>;

  return (
    <div className="p-4 lg:ml-64 mt-14">
      <div className="p-4 mb-8">
        <h2 className="text-2xl font-semibold mb-6">My Requests</h2>
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1">
              <select
                name="requestType"
                value={filters.requestType}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg p-2.5"
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
                className="w-full border border-gray-300 rounded-lg p-2.5"
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
                className="w-full border border-gray-300 rounded-lg p-2.5"
                disabled={loading}
              />
            </div>
          </div>
          {/* Display Success/Error Messages */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Request ID</th>
                <th className="px-6 py-3">Asset</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.requestId} className="bg-white border-b">
                  <td className="px-6 py-4">{req.requestId}</td>
                  <td className="px-6 py-4">{req.productName}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        req.status === 'Pending'
                          ? 'text-yellow-700 bg-yellow-100'
                          : req.status === 'Approved'
                          ? 'text-green-700 bg-green-100'
                          : req.status === 'Rejected'
                          ? 'text-red-700 bg-red-100'
                          : 'text-gray-700 bg-gray-100'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(req.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(req.requestId)}
                      className="text-red-600 hover:underline"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRequests.length === 0 && (
            <div className="text-center py-4 text-gray-500">You have no requests yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;
