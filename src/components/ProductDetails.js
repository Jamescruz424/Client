const [showNotification, setShowNotification] = useState(true);
const [loading, setLoading] = useState(false); // Add loading state for request
const [error, setError] = useState(''); // Add error state
const [success, setSuccess] = useState(''); // Add success state
const barcodeRefTop = useRef(null);
const barcodeRefBottom = useRef(null);
useEffect(() => {
  if (product && barcodeRefTop.current && barcodeRefBottom.current) {
    try {
      console.log('Generating barcode for product ID:', product.id);
      JsBarcode(barcodeRefTop.current, product.id, {
        format: 'CODE128',
        width: 2,
        height: 80,
        displayValue: true,
        fontSize: 14,
        background: '#ffffff',
        lineColor: '#000000',
      });
      JsBarcode(barcodeRefBottom.current, product.id, {
        format: 'CODE128',
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 16,
        background: '#ffffff',
        lineColor: '#000000',
      });
      console.log('Barcodes generated successfully');
    } catch (error) {
      console.error('Barcode generation error:', error);
    }
  } else {
    console.warn('Missing product or barcode refs:', { product, barcodeRefTop, barcodeRefBottom });
  }
}, [product]);
const handlePrint = () => {
  const printContent = document.querySelector('#print-content').outerHTML;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Product Details - ${product.name}</title>
        <style>
          body { font-family: 'Inter', sans-serif; padding: 20px; }
          .print-container { max-width: 800px; margin: auto; }
          img { max-width: 50%; height: auto; float: left; margin-right: 20px; }
          canvas { display: block; margin: 10px 0; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
          h1 { font-size: 24px; margin-bottom: 20px; }
          p { margin: 5px 0; }
          .barcode-bottom { text-align: center; margin-top: 20px; }
          @media print {
            .no-print { display: none; }
            img { max-width: 40%; }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${printContent}
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};
const handleShare = async () => {
  const shareUrl = `${window.location.origin}/product/${product.id}`;
  const shareData = {
    title: product.name,
    text: `Check out this product: ${product.name}`,
    url: shareUrl,
  };

  if (navigator.share && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      console.log('Shared successfully');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  } else {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Product link copied to clipboard!');
      console.log('Copied to clipboard:', shareUrl);
    }).catch((err) => {
      console.error('Failed to copy:', err);
      alert('Failed to copy link. Share this URL manually: ' + shareUrl);
    });
  }
};
const handleRequest = async () => {
  const userId = getCurrentUserId();
  if (!userId) {
    setError('You must be logged in to request an item. Redirecting to login...');
    setTimeout(() => navigate('/login'), 2000);
    return;
  }

  setLoading(true);
  setError('');
  setSuccess('');

  const requestData = {
    userId: userId,
    productId: product.id,
    productName: product.name,
    timestamp: new Date().toISOString(),
    status: 'Pending',
  };

  try {
    if (!requestData.userId || !requestData.productId || !requestData.productName || !requestData.timestamp) {
      throw new Error('Missing required fields in request payload');
    }

    console.log('Sending request payload:', JSON.stringify(requestData, null, 2));
    const response = await createRequest(requestData); // Use createRequest from api.js
    console.log('Server response:', JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      setSuccess('Request submitted successfully!');
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3s
    } else {
      setError(response.data.message || 'Failed to submit request');
    }
  } catch (error) {
    console.error('Request error:', error);
    setError(error.response?.data?.message || 'Error submitting request: ' + error.message);
  } finally {
    setLoading(false);
  }
};
{showNotification && (
  <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center space-x-3 z-50 animate-fade-in-down no-print">
    <div className="flex-shrink-0">
      <FaBell className="text-black text-xl" />
    </div>
    <div>
      <p className="font-medium text-gray-900">New Item Available!</p>
      <p className="text-sm text-gray-500">Check out this product in our inventory.</p>
    </div>
    <button
      className="ml-4 text-gray-400 hover:text-gray-500"
      onClick={() => setShowNotification(false)}
    >
      <FaTimes />
    </button>
  </div>
)}
<div className="relative">
  <img
    src={product.image_url || 'https://via.placeholder.com/600'}
    alt={product.name}
    className="w-full h-auto rounded-lg object-cover"
    onError={(e) => (e.target.src = 'https://via.placeholder.com/600')}
  />
  <div className="absolute top-4 right-4">
    <canvas ref={barcodeRefTop} className="w-32"></canvas>
  </div>
</div>
<div className="grid grid-cols-2 gap-4 mb-8 details-grid">
  <div>
    <p className="text-sm text-gray-500">Product ID</p>
    <p className="font-medium">{product.assetId || product.sku || 'N/A'}</p>
  </div>
  <div>
    <p className="text-sm text-gray-500">Unit Price</p>
    <p className="font-medium">${product.unit_price || 'N/A'}</p>
  </div>
  <div>
    <p className="text-sm text-gray-500">Availability</p>
    <p className={`font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
      {product.quantity > 0 ? `In Stock (${product.quantity})` : 'Out of Stock'}
    </p>
  </div>
  <div>
    <p className="text-sm text-gray-500">Category</p>
    <p className="font-medium">{product.category || 'N/A'}</p>
  </div>
</div>
{error && <p className="text-red-500 text-sm mb-4">{error}</p>}
{success && <p className="text-green-500 text-sm mb-4">{success}</p>}

