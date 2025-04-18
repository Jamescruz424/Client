import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequests, deleteRequest } from '../services/api';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
        const response = await getRequests();
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
      const response = await deleteRequest(requestId, { userId });
      console.log('Delete response:', response.data);
      if (response.data.success) {
        setRequests(requests.filter((req) => req.requestId !== requestId));
        setSuccess('Request deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
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

  if (loading && !requests.length) return <div className="p-4 mt-14 text-center">Loading your requests...</div>;
  if (error && !requests.length) return <div className="p-4 mt-14 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen p-4 mt-14">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 text-center lg:text-left">
          My Requests
        </h2>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          {/* Filters */}
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

          {/* Success/Error Messages */}
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Request ID</th>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.requestId} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{req.requestId}</td>
                    <td className="px-4 py-3">{req.productName}</td>
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3">{new Date(req.timestamp).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(req.requestId)}
                        className="text-red-600 hover:underline text-sm"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req.requestId}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">ID: {req.requestId}</p>
                  <p className="text-xs text-gray-500">Asset: {req.productName}</p>
                  <p className="text-xs">
                    Status:{' '}
                    <span
                      className={`px-2 py-1 font-medium rounded-full ${
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
                  </p>
                  <p className="text-xs text-gray-500">
                    Date: {new Date(req.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(req.requestId)}
                  className="mt-3 w-full text-red-600 hover:underline text-sm"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* No Requests Message */}
          {filteredRequests.length === 0 && (
            <div className="text-center py-4 text-gray-500">You have no requests yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;