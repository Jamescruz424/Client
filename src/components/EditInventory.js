import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

const EditInventory = () => {
  const { id } = useParams(); // Get item ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    quantity: '',
    unit_price: '',
    image_url: ''
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/inventory`);
        if (response.data.success) {
          const item = response.data.items.find(item => item.id === id);
          if (item) {
            setFormData({
              name: item.name,
              category: item.category,
              sku: item.sku,
              quantity: item.quantity,
              unit_price: item.unit_price,
              image_url: item.image_url || ''
            });
          } else {
            alert('Item not found');
            navigate('/admin-dashboard/inventory');
          }
        }
      } catch (error) {
        console.error('Error fetching item:', error);
        alert('Error fetching item');
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
    try {
      // Note: You'll need a PUT endpoint in app.py for this to work fully
      const response = await axios.put(`http://localhost:5000/inventory/${id}`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data.success) {
        alert('Item updated successfully!');
        navigate('/admin-dashboard/inventory');
      } else {
        alert('Failed to update item: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item');
    }
  };

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
            <button
              type="submit"
              className="w-full px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditInventory;