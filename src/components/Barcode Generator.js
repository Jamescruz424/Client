import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BarcodeGenerator = () => {
  const [productId, setProductId] = useState('');
  const [error, setError] = useState(null);
  const barcodeRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto">
        {/* Content will go here */}
      </div>
    </div>
  );
};

export default BarcodeGenerator;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';

<h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
  <FontAwesomeIcon icon={faBarcode} className="mr-2 text-indigo-600" />
  Generate Barcode (Admin)
</h2>
<p className="text-sm text-gray-600 mb-6">
  Enter a product ID to generate its barcode.
</p>
<form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
      Product ID
    </label>
    <input
      type="text"
      id="productId"
      value={productId}
      onChange={(e) => setProductId(e.target.value)}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      placeholder="Enter product ID (e.g., 12345)"
    />
  </div>
  <button
    type="submit"
    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    Generate Barcode
  </button>
</form>
import JsBarcode from 'jsbarcode';

const generateBarcode = () => {
  if (!productId.trim()) {
    setError('Please enter a product ID.');
    return;
  }

  setError(null);
  try {
    JsBarcode(barcodeRef.current, productId, {
      format: 'CODE128',
      width: 2,
      height: 100,
      displayValue: true,
    });
  } catch (err) {
    setError('Failed to generate barcode. Please ensure the product ID is valid.');
    console.error('Barcode generation error:', err);
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  generateBarcode();
};

