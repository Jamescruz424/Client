import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'; // Added chevron icons
import ProductDetails from './ProductDetails';

const ViewAssets = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/inventory');
        if (response.data.success) {
          const mappedAssets = response.data.items.map(item => ({
            id: item.id,
            assetId: item.sku,
            name: item.name,
            category: item.category || 'Uncategorized',
            status: item.quantity > 0 ? 'Available' : 'In Use', // Simplified; adjust if backend provides status
            lastUpdated: new Date().toISOString().split('T')[0], // Placeholder
            image_url: item.image_url || 'https://via.placeholder.com/50', // Fallback image
            unit_price: item.unit_price,
            quantity: item.quantity,
          }));
          setAssets(mappedAssets);
          setFilteredAssets(mappedAssets);
        } else {
          alert('Failed to load assets: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error fetching assets:', error);
        alert('Error fetching assets');
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
    let filtered = assets;
    if (term) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(term) || asset.assetId.toLowerCase().includes(term)
      );
    }
    if (category && category !== 'All Categories') {
      filtered = filtered.filter(asset => asset.category === category);
    }
    if (status && status !== 'All Status') {
      filtered = filtered.filter(asset => asset.status === status);
    }
    setFilteredAssets(filtered);
  };

  const handleViewDetails = (asset) => {
    setSelectedAsset(asset);
  };

  const handleCloseModal = () => {
    setSelectedAsset(null);
  };

  return (
    <div className="p-4 lg:ml-64 mt-14">
      <div className="p-4 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Asset Inventory</h2>
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1">
              <select
                className="w-full border border-gray-300 rounded-lg p-2.5"
                value={selectedCategory}
                onChange={handleCategoryFilter}
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
                className="w-full border border-gray-300 rounded-lg p-2.5"
                value={selectedStatus}
                onChange={handleStatusFilter}
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
                className="w-full border border-gray-300 rounded-lg p-2.5 pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Image</th> {/* Added Image Column */}
                <th className="px-6 py-3">Asset ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Last Updated</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map(asset => (
                <tr key={asset.id} className="bg-white border-b">
                  <td className="px-6 py-4">
                    <img
                      src={asset.image_url}
                      alt={asset.name}
                      className="h-10 w-10 object-cover rounded"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/50')} // Fallback on error
                    />
                  </td>
                  <td className="px-6 py-4">{asset.assetId}</td>
                  <td className="px-6 py-4">{asset.name}</td>
                  <td className="px-6 py-4">{asset.category}</td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4">{asset.lastUpdated}</td>
                  <td className="px-6 py-4">
                    <button
                      className="text-black hover:underline"
                      onClick={() => handleViewDetails(asset)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{' '}
                  <span className="font-medium">{filteredAssets.length}</span> of{' '}
                  <span className="font-medium">{assets.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
                  </button>
                  <button className="relative inline-flex items-center bg-black px-4 py-2 text-sm font-semibold text-white">
                    1
                  </button>
                  <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedAsset && (
        <ProductDetails product={selectedAsset} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ViewAssets;