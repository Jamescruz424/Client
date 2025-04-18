import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { getInventory, updateInventory } from '../services/api';

const EditInventory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    quantity: '',
    unit_price: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        setError('No item ID provided');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        console.log('Fetching item with ID:', id);
        const response = await getInventory();
        console.log('Inventory response:', response.data);
        if (response.data.success) {
          const item = response.data.items.find((item) => item.id === id);
          if (item) {
            setFormData({
              name: item.name,
              category: item.category,
              sku: item.sku,
              quantity: item.quantity.toString(),
              unit_price: item.unit_price.toString(),
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
    console.log('Form submitted with ID:', id);
    if (!id) {
      setError('No item ID provided');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('category', formData.category.trim());
    data.append('sku', formData.sku.trim());

    const quantity = parseInt(formData.quantity, 10);
    if (isNaN(quantity) || formData.quantity === '' || quantity < 0) {
      setError('Please enter a valid, non-negative quantity');
      setLoading(false);
      return;
    }
    data.append('quantity', quantity);

    const unit_price = parseFloat(formData.unit_price);
    if (isNaN(unit_price) || formData.unit_price === '' || unit_price < 0) {
      setError('Please enter a valid, non-negative unit price');
      setLoading(false);
      return;
    }
    data.append('unit_price', unit_price);

    if (formData.image_url.trim()) {
      data.append('image_url', formData.image_url.trim());
    }

    console.log('Submitting update for item:', id);
    try {
      const response = await updateInventory(id, data);
      console.log('Update response:', response.data);
      if (response.data.success) {
        setSuccess('Item updated successfully!');
        console.log('Navigating to /admin-dashboard/inventory');
        setTimeout(() => navigate('/admin-dashboard/inventory'), 1500);
      } else {
        setError(response.data.message || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      if (error.response) {
        console.log('Server response:', error.response.data, 'Status:', error.response.status);
        setError(error.response.data.message || Server error: ${error.response.status});
      } else if (error.request) {
        console.log('No response received:', error.request);
        setError('Network error: Unable to reach the server');
      } else {
        console.log('Request setup error:', error.message);
        setError(An unexpected error occurred: ${error.message});
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

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className={w-full px-4 py-2 text-white rounded-lg text-sm font-medium flex items-center justify-center ${
                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-black/90'
              }}
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
