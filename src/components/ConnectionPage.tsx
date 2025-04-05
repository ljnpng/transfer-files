"use client";

import { useState, useEffect, useRef } from 'react';

interface ConnectionPageProps {
  myPeerId: string;
  connectionStatus: string;
  onConnect: (peerId: string) => void;
}

export default function ConnectionPage({ myPeerId, connectionStatus, onConnect }: ConnectionPageProps) {
  const [peerIdInput, setPeerIdInput] = useState('');
  const [copyBtnText, setCopyBtnText] = useState('Copy');
  const qrcodeRef = useRef<HTMLCanvasElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Copy Peer ID to clipboard
  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(myPeerId)
      .then(() => {
        setCopyBtnText('Copied');
        setIsCopied(true);
        setTimeout(() => {
          setCopyBtnText('Copy');
          setIsCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Copy failed:', err);
      });
  };

  // Generate QR code
  useEffect(() => {
    if (!myPeerId || typeof window === 'undefined' || !qrcodeRef.current) return;
    
    // Use type assertion to check if QRCode exists
    const qrCode = (window as any).QRCode;
    if (!qrCode) return;

    try {
      // Clear previous content
      const context = qrcodeRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, qrcodeRef.current.width, qrcodeRef.current.height);
      }
      
      // Get the base URL
      const baseUrl = window.location.origin + window.location.pathname;
      const basePath = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
      
      // Create URL for the scan page
      const scanUrl = `${basePath}scan?connect=${myPeerId}`;
      
      // Set canvas size
      qrcodeRef.current.width = 180;
      qrcodeRef.current.height = 180;
      
      // Generate QR code
      qrCode.toCanvas(qrcodeRef.current, scanUrl, {
        width: 180,
        margin: 1,
        color: {
          dark: '#3498db',
          light: '#ffffff'
        }
      }, function (error: Error | null) {
        if (error) {
          console.error('QR Code generation error:', error);
        }
      });
    } catch (e) {
      console.error('QR Code generation exception:', e);
    }
  }, [myPeerId]);

  const handleConnect = () => {
    if (peerIdInput.trim()) {
      onConnect(peerIdInput.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConnect();
    }
  };

  // Generate status class name
  const getStatusClassName = () => {
    if (connectionStatus.includes('Connected')) return 'status-connected';
    if (connectionStatus.includes('Error') || connectionStatus.includes('Failed')) return 'status-error';
    if (connectionStatus.includes('Connecting')) return 'status-connecting';
    return '';
  };

  return (
    <div className="connection-panel">
      <div className="connection-info">
        <h2 className="connection-header">Step 1: Establish Connection</h2>
        <div className="connection-guide">
          Connect with another device to send or receive files and text messages. No installation required.
        </div>
        
        <div className="connection-methods">
          <div className="id-section">
            <div className="section-label">Option 1: Connect with ID</div>
            <div className="my-id-container">
              <div className="my-id-label">My ID:</div>
              <div className={`my-id-value ${isCopied ? 'copied' : ''}`}>
                <span id="my-id">{myPeerId || "Generating..."}</span>
                <button 
                  id="copy-id" 
                  className={`btn-small ${isCopied ? 'copied' : ''}`} 
                  onClick={copyIdToClipboard}
                >
                  {copyBtnText}
                </button>
              </div>
            </div>
            <div className="connect-section">
              <input 
                type="text" 
                id="peer-id" 
                placeholder="Enter remote ID" 
                value={peerIdInput}
                onChange={(e) => setPeerIdInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button id="connect-btn" className="btn" onClick={handleConnect}>Connect</button>
            </div>
          </div>
          
          <div className="or-divider">
            <span>or</span>
          </div>
          
          <div className="qr-section">
            <div className="section-label">Option 2: Scan QR Code</div>
            <div id="qr-container">
              <canvas id="qrcode" ref={qrcodeRef}></canvas>
              <div id="share-url" className="share-url">
                <small>Share link: 
                  <a href={`/scan?connect=${myPeerId}`} target="_blank" title={myPeerId ? `${window.location.origin}/scan?connect=${myPeerId}` : ''}>
                    {myPeerId ? 'View link' : 'Generating...'}
                  </a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`status-indicator ${getStatusClassName()}`}>
        <div className="status-icon"></div>
        <p>Status: <span id="connection-status">{connectionStatus}</span></p>
      </div>
    </div>
  );
} 