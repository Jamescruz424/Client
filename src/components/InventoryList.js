import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getInventory, deleteInventory } from '../services/api';
import ProductDetails from './ProductDetails';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();


useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getInventory();
        if (response.data.success) {
          setInventory(response.data.items);
          setFilteredInventory(response.data.items);
        } else {
          setError(response.data.message || 'Failed to load inventory');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching inventory');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setLoading(true);
      setError('');
      try {
        const response = await deleteInventory(itemId);
        if (response.data.success) {
          const updatedInventory = inventory.filter((item) => item.id !== itemId);
          setInventory(updatedInventory);
          setFilteredInventory(updatedInventory);
          alert('Item deleted successfully!');
        } else {
          setError(response.data.message || 'Failed to delete item');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting item');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (itemId) => {
    console.log('Edit button clicked for item ID:', itemId);
    navigate(`/admin-dashboard/edit-inventory/${itemId}`); // Fixed route to match App.js
  };

  const handleViewDetails = (item) => {
    setSelectedProduct(item);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterInventory(term, selectedCategory);
  };

  const handleCategoryFilter = () => {
    const newCategory = selectedCategory === 'Electronics' ? '' : 'Electronics';
    setSelectedCategory(newCategory);
    filterInventory(searchTerm, newCategory);
  };

  const filterInventory = (term, category) => {
    let filtered = [...inventory];
    if (term) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(term));
    }
    if (category) {
      filtered = filtered.filter((item) => item.category === category);
    }
    setFilteredInventory(filtered);
  };

  if (loading) return <div className="p-4 sm:p-8">Loading inventory...</div>;
  if (error && !inventory.length) return <div className="p-4 sm:p-8 text-red-600">{error}</div>;

  return (
    <main className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Inventory List</h1>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/admin-dashboard/add-inventory')}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add New Item
            </button>
            <button
              onClick={handleCategoryFilter}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              Filter by {selectedCategory === 'Electronics' ? 'All' : 'Electronics'}
            </button>
          </div>
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full rounded-lg border-gray-200 focus:border-black focus:ring-black p-2"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Mobile View: Card Layout */}
        <div className="block md:hidden space-y-4">
          {filteredInventory.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-4">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="h-10 w-10 object-cover rounded" />
                ) : (
                  <span className="text-gray-500 text-sm">No Image</span>
                )}
                <div
                  className="text-sm text-gray-900 cursor-pointer hover:text-black"
                  onClick={() => handleViewDetails(item)}
                >
                  {item.name}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>SKU:</strong> {item.sku}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Unit Price:</strong> ${item.unit_price}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="px-2 py-1 text-black hover:text-black/90 text-sm flex items-center"
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2 py-1 text-red-600 hover:text-red-900 text-sm flex items-center"
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table Layout */}
        <div className="hidden md:block bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="h-10 w-10 object-cover rounded" />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </td>
                    <td
                      className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer hover:text-black"
                      onClick={() => handleViewDetails(item)}
                    >
                      {item.name}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sku}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.unit_price}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-black hover:text-black/90 mr-3"
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm text-gray-700">
              Showing 1 to {filteredInventory.length} of {inventory.length} entries
            </span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-black text-white">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedProduct && <ProductDetails product={selectedProduct} onClose={handleCloseModal} />}
    </main>
  );
};

export default InventoryList;
