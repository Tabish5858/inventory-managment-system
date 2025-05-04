/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Html5QrcodeScanner } from 'html5-qrcode';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Product, productService } from '../services/productService';

export default function BarcodePage() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [productFound, setProductFound] = useState(false);
  const [message, setMessage] = useState('');
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productService.getAll();
        setAllProducts(products);
      } catch (err) {
        console.error('Failed to fetch products', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Initialize scanner on component mount if not in demo mode
    if (!scannerRef.current && !demoMode) {
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
  }, [demoMode]);

  // Handle successful scan
  const onScanSuccess = async (decodedText: string) => {
    setScanResult(decodedText);
    searchProduct(decodedText);
  };

  // Handle manual search or demo product selection
  const searchProduct = async (code: string) => {
    try {
      setIsLoading(true);
      setError('');
      setMessage('Searching for product...');
      setFoundProduct(null);

      // Search for product by barcode or SKU
      const product = allProducts.find((p) =>
        p.barcode === code || p.sku === code
      );

      if (product) {
        setProductFound(true);
        setMessage(`Product found: ${product.name}`);
        setFoundProduct(product);
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

  // Handle manual code submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      setScanResult(manualCode);
      searchProduct(manualCode);
    }
  };

  // Handle creating a new transaction for the found product
  const createTransaction = (type: 'sale' | 'purchase') => {
    if (foundProduct?.id) {
      router.push(`/transactions/new?product=${foundProduct.id}&type=${type}`);
    }
  };

  // Handle scan errors
  const onScanFailure = (error: string) => {
    // We can ignore scan failures as they happen frequently when nothing is in view
    console.debug(`Scan failure: ${error}`);
  };

  // Toggle between demo mode and scanner mode
  const toggleDemoMode = () => {
    if (scannerRef.current && !demoMode) {
      scannerRef.current.clear().catch(error => {
        console.error("Failed to clear scanner instance:", error);
      });
      scannerRef.current = null;
    }
    setDemoMode(!demoMode);
    setScanResult(null);
    setFoundProduct(null);
    setMessage('');
  };

  // Select a demo product to simulate scanning
  const selectDemoProduct = (product: Product) => {
    setScanResult(product.barcode || product.sku);
    searchProduct(product.barcode || product.sku);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Barcode Scanner</h1>

      <div className="mb-6 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-300">
            {demoMode ?
              "Demo Mode: Select a product to simulate scanning" :
              "Point your camera at a product barcode to scan it"}
          </p>
          <button
            onClick={toggleDemoMode}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
          >
            {demoMode ? "Use Real Scanner" : "Try Demo Mode"}
          </button>
        </div>

        {!demoMode ? (
          <>
            <div id="reader" className="w-full max-w-md mx-auto overflow-hidden rounded-lg bg-gray-900"></div>

            <div className="mt-6">
              <p className="text-gray-300 mb-2">Or enter code manually:</p>
              <form onSubmit={handleManualSubmit} className="flex">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Enter barcode or SKU"
                  className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
                >
                  Search
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="mt-4">
            <h3 className="text-xl font-semibold text-white mb-3">Select a product to simulate scanning:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allProducts.slice(0, 6).map((product) => (
                <div
                  key={product.id}
                  onClick={() => selectDemoProduct(product)}
                  className="bg-gray-700 p-4 rounded-md cursor-pointer hover:bg-gray-600 border border-gray-600"
                >
                  <div className="font-medium text-white">{product.name}</div>
                  <div className="text-sm text-gray-300">SKU: {product.sku}</div>
                  <div className="text-sm text-gray-300">Barcode: {product.barcode || 'N/A'}</div>
                </div>
              ))}
            </div>
            {allProducts.length === 0 && (
              <p className="text-gray-400 text-center p-4">No products available for demo. Please add products first.</p>
            )}
          </div>
        )}

        {scanResult && (
          <div className="mt-6 p-4 border rounded-md border-gray-700 bg-gray-900">
            <p className="font-semibold mb-2 text-white">Scanned Code:</p>
            <p className="font-mono bg-gray-800 p-2 rounded text-green-400">{scanResult}</p>
          </div>
        )}

        {isLoading && (
          <div className="mt-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-300">{message}</p>
          </div>
        )}

        {!isLoading && message && (
          <div className={`mt-6 p-4 rounded-md ${productFound ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-900 text-red-100 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {foundProduct && (
          <div className="mt-6 bg-gray-700 p-4 rounded-md">
            <h3 className="text-xl font-semibold text-white mb-3">Product Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-400">Name:</p>
                <p className="text-white">{foundProduct.name}</p>
              </div>
              <div>
                <p className="text-gray-400">SKU:</p>
                <p className="text-white">{foundProduct.sku}</p>
              </div>
              <div>
                <p className="text-gray-400">Current Stock:</p>
                <p className="text-white">{foundProduct.quantity}</p>
              </div>
              <div>
                <p className="text-gray-400">Price:</p>
                <p className="text-white">${typeof foundProduct.price === 'number' ? foundProduct.price.toFixed(2) : '0.00'}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => router.push(`/products/${foundProduct.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                View Details
              </button>
              <button
                onClick={() => createTransaction('sale')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Record Sale
              </button>
              <button
                onClick={() => createTransaction('purchase')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md"
              >
                Record Purchase
              </button>
            </div>
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
