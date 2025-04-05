"use client";

import { useState, useEffect, useRef } from 'react';
import ConnectionPanel from './ConnectionPanel';
import TransferPage from './TransferPage';
import usePeerConnection from '@/hooks/usePeerConnection';
import { formatFileSize, showToast } from '@/utils/helpers';

interface FileItem {
  file: File;
  id: string;
}

interface ReceivedFile {
  name: string;
  size: number;
  url: string;
  type: string;
  id: string;
}

interface ReceivedText {
  content: string;
  timestamp: string;
  id: string;
}

export default function FileTransfer() {
  // Initialize WebRTC connection
  const [receivedFiles, setReceivedFiles] = useState<any[]>([]);
  const [receivedTexts, setReceivedTexts] = useState<any[]>([]);
  
  // Process received data from peer
  function handleReceivedData(data: any) {
    if (data.type === 'file') {
      // Create blob URL for file and add to received files
      const blob = new Blob([data.data], { type: data.dataType });
      const url = URL.createObjectURL(blob);
      
      setReceivedFiles(prev => [...prev, {
        name: data.name,
        size: data.size,
        url,
        type: data.dataType,
        id: Date.now().toString()
      }]);
      
      showToast(`Received file: ${data.name}`);
    } else if (data.type === 'text') {
      // Add received text message
      setReceivedTexts(prev => [...prev, {
        content: data.content,
        timestamp: new Date(data.timestamp).toLocaleString(),
        id: Date.now().toString()
      }]);
      
      showToast('Received text message');
    }
  }

  // Handle WebRTC connection
  const { 
    myPeerId, 
    connectionStatus, 
    connection, 
    connected,
    connectToPeer, 
    sendData,
    disconnect
  } = usePeerConnection({
    onData: handleReceivedData
  });

  // Clear connection data when unmounting
  useEffect(() => {
    return () => {
      // Clean up received file URLs to prevent memory leaks
      receivedFiles.forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [receivedFiles]);

  return (
    <div className="transfer-wrapper">
      {!connected ? (
        <ConnectionPanel 
          myPeerId={myPeerId} 
          connectionStatus={connectionStatus}
          onConnect={connectToPeer}
        />
      ) : (
        <TransferPage 
          connectionStatus={connectionStatus}
          onReceivedData={handleReceivedData}
          sendData={sendData}
          receivedFiles={receivedFiles}
          receivedTexts={receivedTexts}
          onDisconnect={disconnect}
        />
      )}
    </div>
  );
} 