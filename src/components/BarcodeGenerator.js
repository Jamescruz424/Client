import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JsBarcode from 'jsbarcode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode, faDownload } from '@fortawesome/free-solid-svg-icons';

const BarcodeGenerator = () => {
  const [productId, setProductId] = useState('');
  const [error, setError] = useState(null);
  const barcodeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated (optional)
    const userId = localStorage.getItem('userId');
    console.log('BarcodeGenerator - userId:', userId); // Debug
    // Uncomment the below if you want to enforce admin-only access
    /*
    const role = localStorage.getItem('role');
    if (!userId || role !== 'admin') {
      setError('You must be an admin to access this page.');
      navigate('/login');
    }
    */
  }, [navigate]);

  const generateBarcode = () => {
    if (!productId.trim()) {
      setError('Please enter a product ID.');
      return;
    }

    setError(null);
    try {
      JsBarcode(barcodeRef.current, productId, {
        format: 'CODE128', // Adjustable based on your needs
        width: 2,
        height: 100,
        displayValue: true,
      });
    } catch (err) {
      setError('Failed to generate barcode. Please ensure the product ID is valid.');
      console.error('Barcode generation error:', err);
    }
  };

  const downloadBarcode = () => {
    const svg = barcodeRef.current;
    if (!svg) {
      setError('No barcode generated yet.');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `barcode_${productId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateBarcode();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto">
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

        {error && <p className="mt-4 text-red-600">{error}</p>}

        <div className="mt-6 flex flex-col items-center">
          <svg ref={barcodeRef} className="max-w-full" />
          {barcodeRef.current && (
            <button
              onClick={downloadBarcode}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Download Barcode
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeGenerator;