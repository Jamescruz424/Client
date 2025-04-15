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

