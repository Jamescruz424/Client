import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import { scanQR } from '../services/api';

const ScanQRPage = () => {
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const navigate = useNavigate();

  useEffect(() => {
    const startScanner = async () => {
      try {
        setError('');
        setScanning(true);
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        scanFrame();
      } catch (err) {
        console.error('Camera error:', err);
        setError('Failed to access camera. Please allow camera permissions and try again.');
        setScanning(false);
      }
    };

    const scanFrame = () => {
      if (!videoRef.current || !scanning) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code) {
          handleQRCode(code.data);
          return;
        }
      }
      requestAnimationFrame(scanFrame);
    };

    if (scanning) {
      startScanner();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
      }
      setScanning(false);
    };
  }, [scanning]);

  const handleQRCode = async (data) => {
    setScanning(false);
    setError('');
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Please log in to scan QR codes.');
        navigate('/login');
        return;
      }
      const response = await scanQR({ qrData: data, userId });
      console.log('Scan response:', response.data);
      if (response.data.success) {
        const { requestId, issuedToUser } = response.data;
        if (issuedToUser) {
          navigate(`/user-dashboard/return?requestId=${requestId}`);
        } else {
          setError('This item is not issued to you. Please check the QR code.');
        }
      } else {
        setError(response.data.message || 'Invalid QR code. Please try again.');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError(err.response?.data?.message || 'Error scanning QR code.');
    }
  };

  const startScanning = () => {
    setScanning(true);
    setError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Scan QR Code</h2>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <div className="flex flex-col items-center">
            {scanning ? (
              <video ref={videoRef} className="w-full max-w-md rounded-lg" />
            ) : (
              <button
                onClick={startScanning}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Start Scanning
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanQRPage;