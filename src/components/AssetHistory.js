import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssetHistory } from '../services/api';

const AssetHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');
      console.log('Fetching asset history:', { userId, userRole });

      if (!userId || userRole !== 'admin') {
        setError('You must be an admin to view this page. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const response = await getAssetHistory();
        console.log('Asset history response:', response.data);
        if (response.data.success) {
          setHistory(response.data.requests);
        } else {
          setError(response.data.message || 'Failed to fetch asset history.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || 'Error fetching asset history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  const filteredHistory = history.filter((req) => {
    if (filter === 'All') return true;
    if (filter === 'Issued') return req.issueDate && !req.returnDate;
    if (filter === 'Returned') return req.returnDate;
    return true;
  });

  if (loading && !history.length) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading asset history...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Asset History</h2>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {/* Filter */}
          <div className="mb-4 flex justify-center space-x-2">
            {['All', 'Issued', 'Returned'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {/* Mobile View: Card Layout */}
          <div className="block md:hidden space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No asset history available.</div>
            ) : (
              filteredHistory.map((req) => (
                <div
                  key={req.requestId}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col space-y-2"
                >
                  <div className="text-sm text-gray-900">
                    <strong>Asset:</strong> {req.productName}
                  </div>
                  <div className="text-sm text-gray-500">
                    <p><strong>Request ID:</strong> {req.requestId}</p>
                    <p><strong>User:</strong> {req.userName || req.issuedTo || 'Unknown'}</p>
                    <p><strong>Issue Date:</strong> {req.issueDate ? new Date(req.issueDate).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Return Date:</strong> {req.returnDate ? new Date(req.returnDate).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Status:</strong> {req.returnDate ? 'Returned' : req.issueDate ? 'Issued' : 'N/A'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Desktop View: Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No asset history available.</div>
            ) : (
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Asset</th>
                    <th className="px-6 py-3">Request ID</th>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Issue Date</th>
                    <th className="px-6 py-3">Return Date</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((req) => (
                    <tr key={req.requestId} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{req.productName}</td>
                      <td className="px-6 py-4">{req.requestId}</td>
                      <td className="px-6 py-4">{req.userName || req.issuedTo || 'Unknown'}</td>
                      <td className="px-6 py-4">{req.issueDate ? new Date(req.issueDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-4">{req.returnDate ? new Date(req.returnDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-4">{req.returnDate ? 'Returned' : req.issueDate ? 'Issued' : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetHistory;