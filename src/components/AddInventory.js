import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddInventory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    quantity: '',
    unit_price: '',
    image_url: '',
  });

  return <div>Add Inventory</div>;
};

export default AddInventory;
