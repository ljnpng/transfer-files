"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Create a component that uses useSearchParams
function ScanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const connectId = searchParams.get('connect');
  const [status, setStatus] = useState('Initializing connection...');

  useEffect(() => {
    if (connectId) {
      setStatus('Connection ID: ' + connectId);
      
      // Redirect to home page with connection parameter after short delay
      const timeout = setTimeout(() => {
        router.push(`/?connect=${connectId}`);
      }, 1500);
      
      return () => clearTimeout(timeout);
    } else {
      setStatus('Connection ID not found, please scan again');
    }
  }, [connectId, router]);

  return (
    <>
      <p>QR code scan successful, establishing connection...</p>
      <div className="loader"></div>
      <p id="status">{status}</p>
      <a href="/" className="btn">Return to Home</a>
    </>
  );
}

// Main page component, wrapped in Suspense
export default function ScanPage() {
  return (
    <div className="container">
      <h1>Connecting to Device</h1>
      <Suspense fallback={<div>Loading connection information...</div>}>
        <ScanContent />
      </Suspense>
    </div>
  );
} 