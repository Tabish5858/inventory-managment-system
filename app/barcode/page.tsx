"use client";

import { Html5QrcodeScanner } from 'html5-qrcode';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { productService } from '../services/productService';

export default function BarcodePage() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [productFound, setProductFound] = useState(false);
  const [message, setMessage] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Initialize scanner on component mount
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
        },
        /* verbose= */ false
      );

      scannerRef.current.render(onScanSuccess, onScanFailure);
    }

    // Clean up on component unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear scanner instance:", error);
        });
      }
    };
  }, []);

  // Handle successful scan
  const onScanSuccess = async (decodedText: string) => {
    setScanResult(decodedText);

    try {
      setIsLoading(true);
      setError('');
      setMessage('Searching for product...');

      // Search for product by barcode
      const products = await productService.getAll();
      const product = products.find(p => p.barcode === decodedText || p.sku === decodedText);

      if (product) {
        setProductFound(true);
        setMessage(`Product found: ${product.name}`);

        // Wait 2 seconds before redirecting to product details
        setTimeout(() => {
          router.push(`/products/${product.id}`);
        }, 2000);
      } else {
        setProductFound(false);
        setMessage('No product found with this barcode/SKU');
      }
    } catch (err) {
      console.error('Error searching for product:', err);
      setError('Failed to search for product');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle scan errors
  const onScanFailure = (error: string) => {
    // We can ignore scan failures as they happen frequently when nothing is in view
    console.debug(`Scan failure: ${error}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Barcode Scanner</h1>

      <div className="mb-6 card bg-gray-800 p-6 rounded-lg shadow-lg">
        <p className="mb-4 text-gray-300">
          Point your camera at a product barcode to scan it. This will search for the product in your inventory.
        </p>

        <div id="reader" className="w-full max-w-md mx-auto overflow-hidden rounded-lg"></div>

        {scanResult && (
          <div className="mt-4 p-4 border rounded-md dark:border-gray-700 bg-gray-900">
            <p className="font-semibold mb-2 text-white">Scanned Code:</p>
            <p className="font-mono bg-gray-800 p-2 rounded text-green-400">{scanResult}</p>
          </div>
        )}

        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-300">{message}</p>
          </div>
        )}

        {!isLoading && message && (
          <div className={`mt-4 p-4 rounded-md ${productFound ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900 text-red-100 rounded-md">
            <p>{error}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <Link href="/" className="text-blue-400 hover:text-blue-300">
          ← Back to Dashboard
        </Link>

        <Link
          href="/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add New Product
        </Link>
      </div>
    </div>
  );
}
