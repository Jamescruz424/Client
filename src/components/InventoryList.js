import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ProductDetails from './ProductDetails'; // Import ProductDetails component

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/inventory');
        if (response.data.success) {
          setInventory(response.data.items);
          setFilteredInventory(response.data.items);
        } else {
          alert('Failed to load inventory: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
        alert('Error fetching inventory');
      }
    };
    fetchInventory();
  }, []);

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/inventory/${itemId}`);
        if (response.data.success) {
          const updatedInventory = inventory.filter(item => item.id !== itemId);
          setInventory(updatedInventory);
          setFilteredInventory(updatedInventory);
          alert('Item deleted successfully!');
        } else {
          alert('Failed to delete item: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item');
      }
    }
  };

  const handleEdit = (itemId) => {
    console.log('Edit button clicked for item ID:', itemId);
    navigate(`/admin-dashboard/edit-inventory/${itemId}`);
  };

  const handleViewDetails = (item) => {
    setSelectedProduct(item); // Open modal with selected product
  };

  const handleCloseModal = () => {
    setSelectedProduct(null); // Close modal
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
    let filtered = inventory;
    if (term) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(term));
    }
    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }
    setFilteredInventory(filtered);
  };

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Inventory List</h1>
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/admin-dashboard/add-inventory')}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add New Item
            </button>
            <button
              onClick={handleCategoryFilter}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              Filter by {selectedCategory === 'Electronics' ? 'All' : 'Electronics'}
            </button>
          </div>
          <div className="w-64">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full rounded-lg border-gray-200 focus:border-black focus:ring-black"
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="h-10 w-10 object-cover rounded" />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer hover:text-black"
                      onClick={() => handleViewDetails(item)}
                    >
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.unit_price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-black hover:text-black/90 mr-3"
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm text-gray-700">Showing 1 to {filteredInventory.length} of {inventory.length} entries</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50">Previous</button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-black text-white">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetails product={selectedProduct} onClose={handleCloseModal} />
      )}
    </main>
  );
};

export default InventoryList;