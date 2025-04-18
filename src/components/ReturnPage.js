import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRequests, returnRequest } from '../services/api';

const ReturnPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchIssuedRequests = async () => {
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');
      console.log('Fetching requests for:', { userId, userRole });

      if (!userId) {
        setError('You must be logged in. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const response = await getRequests();
        console.log('API response:', response.data);
        if (response.data.success) {
          const issuedRequests = response.data.requests
            .filter((req) => {
              const isUserMatch = req.issuedTo === userId;
              const isIssued = !!req.issueDate;
              const notReturned = !req.returnDate;
              console.log(`Request ${req.requestId}:`, { isUserMatch, isIssued, notReturned });
              return isUserMatch && isIssued && notReturned;
            })
            .map((req) => ({ ...req, returning: false }));
          setRequests(issuedRequests);
          console.log('Filtered requests:', issuedRequests);

          // Handle QR redirect
          const params = new URLSearchParams(location.search);
          const requestId = params.get('requestId');
          if (requestId && issuedRequests.some((req) => req.requestId === requestId)) {
            handleReturn(requestId);
          }
        } else {
          setError(response.data.message || 'Failed to fetch issued items.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || 'Error fetching issued items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssuedRequests();
  }, [navigate, location.search]);

  const handleReturn = async (requestId) => {
    if (!window.confirm('Are you sure you want to return this item?')) return;
    setRequests((prev) =>
      prev.map((req) =>
        req.requestId === requestId ? { ...req, returning: true } : req
      )
    );
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const userId = localStorage.getItem('userId');
      console.log('Returning:', { requestId, userId });
      const response = await returnRequest(requestId, userId);
      console.log('Return response:', response.data);
      if (response.data.success) {
        setRequests((prev) =>
          prev.filter((req) => req.requestId !== requestId)
        );
        setSuccess('Item returned successfully!');
        setTimeout(() => setSuccess(''), 3000);
        navigate('/user-dashboard/return', { replace: true });
      } else {
        setError(response.data.message || 'Failed to return item.');
        setRequests((prev) =>
          prev.map((req) =>
            req.requestId === requestId ? { ...req, returning: false } : req
          )
        );
      }
    } catch (err) {
      console.error('Return error:', err);
      setError(err.response?.data?.message || 'Error returning item.');
      setRequests((prev) =>
        prev.map((req) =>
          req.requestId === requestId ? { ...req, returning: false } : req
        )
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !requests.length) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading issued items...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Return Items</h2>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
          {/* Mobile View: Card Layout */}
          <div className="block md:hidden space-y-4">
            {requests.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No items issued to you.</div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.requestId}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col space-y-2"
                >
                  <div className="text-sm text-gray-900">
                    <strong>ID:</strong> {request.requestId}
                  </div>
                  <div className="text-sm text-gray-500">
                    <p><strong>Asset:</strong> {request.productName}</p>
                    <p><strong>Issued By:</strong> {request.adminId || 'Unknown'}</p>
                    <p><strong>Issue Date:</strong> {request.issueDate ? new Date(request.issueDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <button
                    onClick={() => handleReturn(request.requestId)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:bg-red-300"
                    disabled={request.returning}
                  >
                    {request.returning ? 'Returning...' : 'Return Item'}
                  </button>
                </div>
              ))
            )}
          </div>
          {/* Desktop View: Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            {requests.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No items issued to you.</div>
            ) : (
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Request ID</th>
                    <th className="px-6 py-3">Asset</th>
                    <th className="px-6 py-3">Issued By</th>
                    <th className="px-6 py-3">Issue Date</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.requestId} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{request.requestId}</td>
                      <td className="px-6 py-4">{request.productName}</td>
                      <td className="px-6 py-4">{request.adminId || 'Unknown'}</td>
                      <td className="px-6 py-4">{request.issueDate ? new Date(request.issueDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleReturn(request.requestId)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:bg-red-300"
                          disabled={request.returning}
                        >
                          {request.returning ? 'Returning...' : 'Return Item'}
                        </button>
                      </td>
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

export default ReturnPage;