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
  // Use custom hook to handle WebRTC connection
  const {
    peer,
    connection,
    connectionStatus,
    connectToPeer,
    myPeerId
  } = usePeerConnection();
  
  // Local state
  const [connectStep, setConnectStep] = useState<'connect' | 'transfer'>('connect');
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([]);
  const [receivedTexts, setReceivedTexts] = useState<ReceivedText[]>([]);
  
  // Establish connection
  const handleConnect = (peerId: string) => {
    if (!peerId.trim()) {
      showToast('Please enter a valid connection ID', true);
      return;
    }
    
    connectToPeer(peerId);
  };
  
  // Handle received data
  const handleReceivedData = (data: any) => {
    if (!data) return;
    
    if (data.type === 'file') {
      // Process received file
      try {
        const { name, size, dataType, data: fileData } = data;
        
        // Create Blob object
        const blob = new Blob([fileData], { type: dataType });
        const url = URL.createObjectURL(blob);
        
        // Add to received files list
        setReceivedFiles(prev => [
          {
            name,
            size,
            url,
            type: dataType,
            id: Date.now() + '-' + Math.random().toString(36).substr(2, 9)
          },
          ...prev
        ]);
        
        showToast(`Received file: ${name}`);
      } catch (error) {
        console.error('Failed to process received file:', error);
        showToast('File reception failed', true);
      }
    } else if (data.type === 'text') {
      // Process received text
      try {
        const { content, timestamp } = data;
        
        // Add to received text list
        setReceivedTexts(prev => [
          {
            content,
            timestamp,
            id: Date.now() + '-' + Math.random().toString(36).substr(2, 9)
          },
          ...prev
        ]);
        
        showToast('New message received');
      } catch (error) {
        console.error('Failed to process received text:', error);
        showToast('Message reception failed', true);
      }
    }
  };
  
  // Send data
  const sendData = (data: any): boolean => {
    if (!connection || connection.open === false) {
      showToast('Not connected, unable to send data', true);
      return false;
    }
    
    try {
      connection.send(data);
      return true;
    } catch (error) {
      console.error('Failed to send data:', error);
      return false;
    }
  };
  
  // Disconnect
  const handleDisconnect = () => {
    // Close connection
    if (connection) {
      connection.close();
    }
    
    if (peer) {
      peer.disconnect();
      peer.destroy();
    }
    
    // Reset state
    setConnectStep('connect');
    setReceivedFiles([]);
    setReceivedTexts([]);
    
    // Show notification
    showToast('Connection closed');
  };
  
  // Update step when connection status changes
  useEffect(() => {
    if (connectionStatus.includes('Connected')) {
      setConnectStep('transfer');
    }
  }, [connectionStatus]);
  
  // Add data handler to connection object
  useEffect(() => {
    if (!connection) return;
    
    // Handle received data
    connection.on('data', handleReceivedData);
    
    return () => {
      connection.off('data', handleReceivedData);
    };
  }, [connection]);
  
  return (
    <div className="app-content">
      <h1>TransferFiles</h1>
      
      {connectStep === 'connect' ? (
        <ConnectionPanel 
          myPeerId={myPeerId} 
          connectionStatus={connectionStatus}
          onConnect={handleConnect}
        />
      ) : (
        <TransferPage 
          connectionStatus={connectionStatus}
          onReceivedData={handleReceivedData}
          sendData={sendData}
          receivedFiles={receivedFiles}
          receivedTexts={receivedTexts}
          onDisconnect={handleDisconnect}
        />
      )}
    </div>
  );
} 