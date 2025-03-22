import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { getInventory, updateInventory } from '../services/api'; // Import from api.js (adjust path if needed)

const EditInventory = () => {
  const { id } = useParams(); // Get item ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    quantity: '',
    unit_price: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(true); // Add loading state for fetching
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getInventory(); // Use getInventory from api.js
        console.log('Inventory response:', response.data);
        if (response.data.success) {
          const item = response.data.items.find((item) => item.id === id);
          if (item) {
            setFormData({
              name: item.name,
              category: item.category,
              sku: item.sku,
              quantity: item.quantity,
              unit_price: item.unit_price,
              image_url: item.image_url || '',
            });
          } else {
            setError('Item not found');
            setTimeout(() => navigate('/admin-dashboard/inventory'), 1500);
          }
        } else {
          setError(response.data.message || 'Failed to fetch inventory');
        }
      } catch (error) {
        console.error('Error fetching item:', error);
        setError(error.response?.data?.message || 'Error fetching item');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Prepare data with correct types
    const data = {
      name: formData.name,
      category: formData.category,
      sku: formData.sku,
      quantity: parseInt(formData.quantity, 10),
      unit_price: parseFloat(formData.unit_price),
      image_url: formData.image_url || null,
    };

    try {
      console.log('Submitting update for item:', id, data);
      const response = await updateInventory(id, data); // Use updateInventory from api.js
      console.log('Update response:', response.data);
      if (response.data.success) {
        setSuccess('Item updated successfully!');
        setTimeout(() => navigate('/admin-dashboard/inventory'), 1500);
      } else {
        setError(response.data.message || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      if (error.response) {
        setError(error.response.data.message || 'Failed to update item');
      } else if (error.request) {
        setError('Network error: Unable to reach the server');
      } else {
        setError(`An unexpected error occurred: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) return <div className="p-8">Loading item details...</div>;
  if (error && !formData.name) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Inventory Item</h1>
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
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditInventory;
