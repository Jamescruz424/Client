import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddInventory = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    quantity: '',
    unit_price: '',
    image_url: '' // Change from 'image' to 'image_url'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // No need for FormData since we're sending JSON now
    const data = {
      name: formData.name,
      category: formData.category,
      sku: formData.sku,
      quantity: formData.quantity,
      unit_price: formData.unit_price,
      image_url: formData.image_url || null // Send null if no URL provided
    };

    try {
      const response = await axios.post('http://localhost:5000/inventory', data, {
        headers: {
          'Content-Type': 'application/json' // Change to JSON
        }
      });
      if (response.data.success) {
        alert('Item added successfully!');
        navigate('/admin-dashboard/inventory');
      } else {
        alert('Failed to add item: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item');
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
            <button
              type="submit"
              className="w-full px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add Item
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddInventory;