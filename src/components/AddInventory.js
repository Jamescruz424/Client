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


