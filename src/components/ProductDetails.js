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

