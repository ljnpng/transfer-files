"use client";

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface ConnectionPanelProps {
  myPeerId: string;
  connectionStatus: string;
  onConnect: (peerId: string) => void;
}

export default function ConnectionPanel({ myPeerId, connectionStatus, onConnect }: ConnectionPanelProps) {
  const [peerIdInput, setPeerIdInput] = useState('');
  const [copyBtnText, setCopyBtnText] = useState('Copy');
  const [copyLinkBtnText, setCopyLinkBtnText] = useState('Copy Link');
  const qrcodeRef = useRef<HTMLCanvasElement>(null);

  // Fallback function for copying text when clipboard API is not available
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
    } catch (err) {
      console.warn('Fallback: Unable to copy text to clipboard');
    }
    
    document.body.removeChild(textArea);
  };

  // Generate QR code
  useEffect(() => {
    if (myPeerId && qrcodeRef.current) {
      const scanUrl = `${window.location.origin}/scan?connect=${myPeerId}`;
      QRCode.toCanvas(qrcodeRef.current, scanUrl, {
        width: 180,
        margin: 2,
        color: {
          dark: '#F9D71C',
          light: '#ffffff'
        }
      });
    }
  }, [myPeerId]);

  // Copy ID to clipboard
  const copyIdToClipboard = async () => {
    if (!myPeerId) return;
    
    try {
      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(myPeerId);
        setCopyBtnText('Copied!');
        setTimeout(() => setCopyBtnText('Copy'), 2000);
      } else {
        // Fallback for older browsers or non-secure contexts
        fallbackCopyTextToClipboard(myPeerId);
        setCopyBtnText('Copied!');
        setTimeout(() => setCopyBtnText('Copy'), 2000);
      }
    } catch (err) {
      // Fallback if clipboard API fails
      fallbackCopyTextToClipboard(myPeerId);
      setCopyBtnText('Copied!');
      setTimeout(() => setCopyBtnText('Copy'), 2000);
    }
  };

  // Copy connection link to clipboard
  const copyLinkToClipboard = async () => {
    if (!myPeerId) return;
    
    const scanUrl = `${window.location.origin}/scan?connect=${myPeerId}`;
    
    try {
      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(scanUrl);
        setCopyLinkBtnText('Copied!');
        setTimeout(() => setCopyLinkBtnText('Copy Link'), 2000);
      } else {
        // Fallback for older browsers or non-secure contexts
        fallbackCopyTextToClipboard(scanUrl);
        setCopyLinkBtnText('Copied!');
        setTimeout(() => setCopyLinkBtnText('Copy Link'), 2000);
      }
    } catch (err) {
      // Fallback if clipboard API fails
      fallbackCopyTextToClipboard(scanUrl);
      setCopyLinkBtnText('Copied!');
      setTimeout(() => setCopyLinkBtnText('Copy Link'), 2000);
    }
  };

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
      <div className="connection-header">
        <h2>Connection Setup</h2>
        <p>Fast & secure file transfer</p>
      </div>
      
      <div className="my-id-container">
        <div className="section-label">My ID</div>
        <div className="my-id-value">
          <span>{myPeerId || "Generating..."}</span>
          <button 
            className="btn-small" 
            onClick={copyIdToClipboard}
          >
            {copyBtnText}
          </button>
        </div>
      </div>
      
      <div className="connect-section">
        <div className="section-label">Connect to peer</div>
        <input 
          type="text" 
          placeholder="Enter 8-digit ID (e.g. e24e3703)" 
          value={peerIdInput}
          onChange={(e) => setPeerIdInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn" onClick={handleConnect}>
          <span>Connect</span>
        </button>
      </div>
      
      <div className="divider">
        <span>OR</span>
      </div>
      
      <div id="qr-container">
        <div className="section-label">Scan QR Code to Connect</div>
        <div className="qr-container">
          <canvas id="qrcode" ref={qrcodeRef}></canvas>
        </div>
        <div className="share-url">
          Use mobile device to scan and connect
        </div>
      </div>

      <div className="connection-link-section">
        <div className="section-label">Or Share Connection Link</div>
        <div className="connection-link-container">
          <div className="connection-link-value">
            <span className="link-text">
              {myPeerId ? `${window.location.origin}/scan?connect=${myPeerId}` : "Generating..."}
            </span>
            <button 
              className="btn-small" 
              onClick={copyLinkToClipboard}
              disabled={!myPeerId}
            >
              {copyLinkBtnText}
            </button>
          </div>
        </div>
        <div className="share-url">
          Send this link to connect from any device
        </div>
      </div>
      
      <div className={`status-indicator ${connectionStatus.includes('Connected') ? 'status-connected' : 
                                       connectionStatus.includes('Connecting') ? 'status-connecting' : 
                                       connectionStatus.includes('Error') ? 'status-error' : ''}`}>
        <div className="status-icon"></div>
        <div>Status: {connectionStatus}</div>
      </div>
    </div>
  );
} 