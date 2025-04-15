import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddInventory = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    quantity: '',
    unit_price: '',
    image_url: '',
  });
  const navigate = useNavigate();

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Inventory Item</h1>
      </div>
    </main>
  );
};

export default AddInventory;
<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-lg mt-6">
  <form>
    {/* Form Fields will go here */}
  </form>
</div>
<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-lg mt-6">
  <form>
    {/* Form Fields will go here */}
  </form>
</div>
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
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};




