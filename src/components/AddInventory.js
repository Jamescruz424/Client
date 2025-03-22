import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { addInventory } from '../services/api'; // Import from api.js (adjust path if needed)

const AddInventory = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    quantity: '',
    unit_price: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(''); // Add error state
  const [success, setSuccess] = useState(''); // Add success state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Prepare data for API (convert quantity and unit_price to numbers)
    const data = {
      name: formData.name,
      category: formData.category,
      sku: formData.sku,
      quantity: parseInt(formData.quantity, 10), // Convert to integer
      unit_price: parseFloat(formData.unit_price), // Convert to float
      image_url: formData.image_url || null, // Send null if empty
    };

    try {
      console.log('Submitting inventory item:', data);
      const response = await addInventory(data); // Use addInventory from api.js
      console.log('Add inventory response:', response.data);
      setSuccess(response.data.message || 'Item added successfully!');
      setTimeout(() => navigate('/admin-dashboard/inventory'), 1500);
    } catch (error) {
      console.error('Error adding item:', error);
      if (error.response) {
        setError(error.response.data.message || 'Failed to add item');
      } else if (error.request) {
        setError('Network error: Unable to reach the server');
      } else {
        setError(`An unexpected error occurred: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Inventory Item</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-lg mt-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border-gray-200 focus:border-black focus:ring-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border-gray-200 focus:border-black focus:ring-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border-gray-200 focus:border-black focus:ring-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border-gray-200 focus:border-black focus:ring-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Unit Price</label>
              <input
                type="number"
                step="0.01"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border-gray-200 focus:border-black focus:ring-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border-gray-200 focus:border-black focus:ring-black"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Display Success/Error Messages */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 text-white rounded-lg text-sm font-medium flex items-center justify-center ${
                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-black/90'
              }`}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              {loading ? 'Adding Item...' : 'Add Item'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddInventory;
