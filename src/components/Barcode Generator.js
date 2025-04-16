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
