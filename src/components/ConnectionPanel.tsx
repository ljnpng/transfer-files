"use client";

import { useState, useEffect, useRef } from 'react';

interface ConnectionPanelProps {
  myPeerId: string;
  connectionStatus: string;
  onConnect: (peerId: string) => void;
}

export default function ConnectionPanel({ myPeerId, connectionStatus, onConnect }: ConnectionPanelProps) {
  const [peerIdInput, setPeerIdInput] = useState('');
  const [copyBtnText, setCopyBtnText] = useState('Copy');
  const qrcodeRef = useRef<HTMLCanvasElement>(null);

  // Copy Peer ID to clipboard
  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(myPeerId)
      .then(() => {
        setCopyBtnText('Copied');
        setTimeout(() => {
          setCopyBtnText('Copy');
        }, 2000);
      })
      .catch(err => {
        console.error('Copy failed:', err);
      });
  };

  // Generate QR code
  useEffect(() => {
    if (!myPeerId || typeof window === 'undefined' || !window.QRCode || !qrcodeRef.current) return;

    try {
      // Clear content
      const context = qrcodeRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, qrcodeRef.current.width, qrcodeRef.current.height);
      }
      
      // Get base URL part (without query parameters)
      const baseUrl = window.location.origin + window.location.pathname;
      const basePath = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
      
      // Create URL pointing to scan page
      const scanUrl = `${basePath}scan?connect=${myPeerId}`;
      
      // Set canvas size
      qrcodeRef.current.width = 150;
      qrcodeRef.current.height = 150;
      
      // Generate QR code using QRCode library
      window.QRCode.toCanvas(qrcodeRef.current, scanUrl, {
        width: 150,
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

  return (
    <div className="connection-panel">
      <div className="connection-info">
        <h2>Connection Setup</h2>
        <div className="id-section">
          <p>My ID: <span id="my-id">{myPeerId || "Generating..."}</span> 
            <button id="copy-id" className="btn-small" onClick={copyIdToClipboard}>{copyBtnText}</button>
          </p>
        </div>
        <div className="connect-section">
          <input 
            type="text" 
            id="peer-id" 
            placeholder="Enter peer ID" 
            value={peerIdInput}
            onChange={(e) => setPeerIdInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button id="connect-btn" className="btn" onClick={handleConnect}>Connect</button>
        </div>
        <div id="qr-container">
          <h3>Scan QR Code to Connect</h3>
          <canvas id="qrcode" ref={qrcodeRef}></canvas>
          <div id="share-url" className="share-url">
            <small>Or share link: <a href={`/scan?connect=${myPeerId}`} target="_blank">
              {myPeerId ? `${window.location.origin}/scan?connect=${myPeerId}` : 'Generating...'}
            </a></small>
          </div>
        </div>
      </div>
      <div className="status">
        <p>Status: <span id="connection-status">{connectionStatus}</span></p>
      </div>
    </div>
  );
} 