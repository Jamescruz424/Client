import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequests, issueRequest } from '../services/api';

const IssuePage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedRequests = async () => {
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
        const response = await getRequests();
        console.log('Fetch response:', response.data);
        if (response.data.success) {
          const approvedRequests = response.data.requests
            .filter((req) => req.status === 'Approved' && !req.issueDate)
            .map((req) => ({ ...req, issuing: false }));
          setRequests(approvedRequests);
          console.log('Set approved requests:', approvedRequests);
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

    fetchApprovedRequests();
  }, [navigate]);

  const handleIssue = async (requestId) => {
    if (!window.confirm('Are you sure you want to issue this item?')) return;
    setRequests((prev) =>
      prev.map((req) =>
        req.requestId === requestId ? { ...req, issuing: true } : req
      )
    );
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const adminId = localStorage.getItem('userId');
      if (!adminId) {
        setError('Admin ID not found. Please log in again.');
        setLoading(false);
        return;
      }
      console.log(`Issuing requestId: ${requestId}, adminId: ${adminId}`);
      const response = await issueRequest(requestId, adminId);
      console.log('Issue response:', response.data);
      if (response.data.success) {
        setRequests((prev) =>
          prev.filter((req) => req.requestId !== requestId)
        );
        setSuccess('Item issued successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Failed to issue item');
      }
    } catch (err) {
      console.error('Error issuing item:', err);
      const errorMessage = err.response?.data?.message || 'Error issuing item';
      if (err.response?.status === 404) {
        setError('Request not found. It may have been deleted.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
      setRequests((prev) =>
        prev.map((req) =>
          req.requestId === requestId ? { ...req, issuing: false } : req
        )
      );
    }
  };

  if (loading && !requests.length) {
    return <div className="text-center text-gray-500 py-8">Loading requests...</div>;
  }
  if (error && !requests.length) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Issue Items</h2>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
      {/* Mobile View: Card Layout */}
      <div className="block md:hidden space-y-4">
        {requests.map((request) => (
          <div
            key={request.requestId}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col space-y-2"
          >
            <div className="text-sm text-gray-900">
              <strong>ID:</strong> {request.requestId}
            </div>
            <div className="text-sm text-gray-500">
              <p><strong>Requester:</strong> {request.requester}</p>
              <p><strong>Asset:</strong> {request.productName}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className="px-2 py-1 text-xs font-medium rounded-full text-green-700 bg-green-100">
                  {request.status}
                </span>
              </p>
              <p><strong>Requested:</strong> {new Date(request.timestamp).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => handleIssue(request.requestId)}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-blue-300"
              disabled={loading || request.issuing}
            >
              Issue Item
            </button>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="text-center py-4 text-gray-500">No approved requests to issue.</div>
        )}
      </div>
      {/* Desktop View: Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Request ID</th>
              <th className="px-6 py-3">Requester</th>
              <th className="px-6 py-3">Asset</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.requestId} className="bg-white border-b">
                <td className="px-6 py-4">{request.requestId}</td>
                <td className="px-6 py-4">{request.requester}</td>
                <td className="px-6 py-4">{request.productName}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-full text-green-700 bg-green-100">
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(request.timestamp).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleIssue(request.requestId)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-blue-300"
                    disabled={loading || request.issuing}
                  >
                    Issue Item
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && (
          <div className="text-center py-4 text-gray-500">No approved requests to issue.</div>
        )}
      </div>
    </div>
  );
};

export default IssuePage;