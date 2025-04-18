import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { getInventory, getAssetHistory } from '../services/api'; // Import getAssetHistory
import ProductDetails from './ProductDetails';

const ViewAssets = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetHistory, setAssetHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getInventory();
        console.log('Inventory response:', response.data);
        if (response.data.success) {
          const mappedAssets = response.data.items.map((item) => ({
            id: item.id,
            assetId: item.sku,
            name: item.name,
            category: item.category || 'Uncategorized',
            status: item.quantity > 0 ? 'Available' : 'In Use',
            lastUpdated: new Date().toISOString().split('T')[0],
            image_url: item.image_url || 'https://via.placeholder.com/50',
            unit_price: item.unit_price,
            quantity: item.quantity,
          }));
          setAssets(mappedAssets);
          setFilteredAssets(mappedAssets);
        } else {
          setError(response.data.message || 'Failed to load assets');
        }
      } catch (error) {
        console.error('Error fetching assets:', error);
        setError(error.response?.data?.message || 'Error fetching assets');
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterAssets(term, selectedCategory, selectedStatus);
  };

  const handleCategoryFilter = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterAssets(searchTerm, category, selectedStatus);
  };

  const handleStatusFilter = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    filterAssets(searchTerm, selectedCategory, status);
  };

  const filterAssets = (term, category, status) => {
    let filtered = [...assets];
    if (term) {
      filtered = filtered.filter((asset) =>
        asset.name.toLowerCase().includes(term) || asset.assetId.toLowerCase().includes(term)
      );
    }
    if (category && category !== 'All Categories') {
      filtered = filtered.filter((asset) => asset.category === category);
    }
    if (status && status !== 'All Status') {
      filtered = filtered.filter((asset) => asset.status === status);
    }
    setFilteredAssets(filtered);
  };

  const handleViewDetails = (asset) => {
    setSelectedAsset(asset);
  };

  const handleCloseModal = () => {
    setSelectedAsset(null);
  };

  const handleViewAssetHistory = async (asset) => {
    setHistoryLoading(true);
    setHistoryError('');
    try {
      if (!asset?.id) {
        throw new Error('Invalid or missing asset ID');
      }
      console.log('Fetching history for asset ID:', asset.id);
      const response = await getAssetHistory(asset.id); // Pass asset.id
      console.log('Asset history response:', response.data);
      if (response.data.success) {
        setAssetHistory(response.data.data || []);
        setShowHistoryModal(true);
      } else {
        setHistoryError(response.data.message || 'Failed to load asset history');
      }
    } catch (error) {
      console.error('Error fetching asset history:', error);
      const errorMessage = error.response?.data?.message ||
                         (error.response?.status === 404 ? 'Asset not found' : error.message || 'Error fetching asset history');
      setHistoryError(errorMessage);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
    setAssetHistory([]);
  };

  if (loading) return <div className="p-4 mt-14 text-center">Loading assets...</div>;
  if (error) return <div className="p-4 mt-14 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen p-4 mt-14">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 text-center lg:text-left">
          Asset Inventory
        </h2>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <select
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedCategory}
                onChange={handleCategoryFilter}
                disabled={loading}
              >
                <option>All Categories</option>
                <option>Laptops</option>
                <option>Monitors</option>
                <option>Tablets</option>
                <option>Cameras</option>
              </select>
            </div>
            <div className="flex-1">
              <select
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedStatus}
                onChange={handleStatusFilter}
                disabled Descriptive={loading}
              >
                <option>All Status</option>
                <option>Available</option>
                <option>In Use</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="w-full border border-gray-300 rounded-lg p-2 pl-10 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={handleSearch}
                disabled={loading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Asset ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Updated</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={asset.image_url}
                        alt={asset.name}
                        className="h-10 w-10 object-cover rounded"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/50')}
                      />
                    </td>
                    <td className="px-4 py-3">{asset.assetId}</td>
                    <td className="px-4 py-3">{asset.name}</td>
                    <td className="px-4 py-3">{asset.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          asset.status === 'Available'
                            ? 'text-green-700 bg-green-100'
                            : asset.status === 'In Use'
                            ? 'text-yellow-700 bg-yellow-100'
                            : 'text-red-700 bg-red-100'
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{asset.lastUpdated}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        className="text-indigo-600 hover:underline text-sm"
                        onClick={() => handleViewDetails(asset)}
                        disabled={loading}
                      >
                        View Details
                      </button>
                      <button
                        className="text-blue-600 hover:underline text-sm"
                        onClick={() => handleViewAssetHistory(asset)}
                        disabled={loading || historyLoading}
                      >
                        View Asset History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={asset.image_url}
                    alt={asset.name}
                    className="h-12 w-12 object-cover rounded"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/50')}
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{asset.name}</h3>
                    <p className="text-xs text-gray-500">ID: {asset.assetId}</p>
                    <p className="text-xs text-gray-500">Category: {asset.category}</p>
                    <p className="text-xs">
                      Status:{' '}
                      <span
                        className={`px-2 py-1 font-medium rounded-full ${
                          asset.status === 'Available'
                            ? 'text-green-700 bg-green-100'
                            : asset.status === 'In Use'
                            ? 'text-yellow-700 bg-yellow-100'
                            : 'text-red-700 bg-red-100'
                        }`}
                      >
                        {asset.status}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">Updated: {asset.lastUpdated}</p>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button
                    className="flex-1 text-indigo-600 hover:underline text-sm"
                    onClick={() => handleViewDetails(asset)}
                    disabled={loading}
                  >
                    View Details
                  </button>
                  <button
                    className="flex-1 text-blue-600 hover:underline text-sm"
                    onClick={() => handleViewAssetHistory(asset)}
                    disabled={loading || historyLoading}
                  >
                    View Asset History
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
            <div className="flex-1 text-sm text-gray-700 sm:flex sm:items-center sm:justify-between">
              <p className="hidden sm:block">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{filteredAssets.length}</span> of{' '}
                <span className="font-medium">{assets.length}</span> results
              </p>
              <p className="sm:hidden">
                {filteredAssets.length} of {assets.length} results
              </p>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  disabled
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
                </button>
                <button className="relative inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                  1
                </button>
                <button
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  disabled
                >
                  <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedAsset && <ProductDetails product={selectedAsset} onClose={handleCloseModal} />}

      {/* Asset History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Asset History</h3>
            {historyLoading ? (
              <p>Loading history...</p>
            ) : historyError ? (
              <p className="text-red-600">{historyError}</p>
            ) : assetHistory.length === 0 ? (
              <p>No history available for this asset.</p>
            ) : (
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Action</th>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {assetHistory.map((history, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-4 py-2">{new Date(history.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{history.action}</td>
                      <td className="px-4 py-2">{history.user || 'N/A'}</td>
                      <td className="px-4 py-2">{history.details || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              onClick={handleCloseHistoryModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAssets;