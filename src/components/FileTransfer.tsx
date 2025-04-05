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
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([]);
  const [receivedTexts, setReceivedTexts] = useState<ReceivedText[]>([]);
  
  // Handle data received from peer
  function handleReceivedData(data: any) {
    if (data.type === 'file') {
      // Create blob URL for file and add to received files list
      const blob = new Blob([data.data], { type: data.dataType });
      const url = URL.createObjectURL(blob);
      
      const newFile = {
        name: data.name,
        size: data.size,
        url,
        type: data.dataType,
        id: Date.now().toString()
      };
      
      setReceivedFiles(prev => [...prev, newFile]);
      showToast(`Received file: ${data.name}`);
    } else if (data.type === 'text') {
      // Add received text message
      const newText = {
        content: data.content,
        timestamp: new Date(data.timestamp).toLocaleString(),
        id: Date.now().toString()
      };
      
      setReceivedTexts(prev => [...prev, newText]);
      showToast('Received new message');
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

  // Clean up connections when component unmounts
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

  // Replace connection status with English descriptions
  const getEnglishConnectionStatus = (status: string) => {
    // The connectionStatus is already in English from the usePeerConnection hook
    return status;
  };

  const translatedStatus = getEnglishConnectionStatus(connectionStatus);

  return (
    <div className="transfer-wrapper">
      {!connected ? (
        <ConnectionPanel 
          myPeerId={myPeerId} 
          connectionStatus={translatedStatus}
          onConnect={connectToPeer}
        />
      ) : (
        <TransferPage 
          connectionStatus={translatedStatus}
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