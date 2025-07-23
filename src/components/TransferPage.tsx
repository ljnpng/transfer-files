"use client";

import { useState, useRef, useEffect } from 'react';
import { formatFileSize } from '@/utils/helpers';

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

interface TransferPageProps {
  connectionStatus: string;
  onReceivedData: (data: any) => void;
  sendData: (data: any) => boolean;
  receivedFiles: ReceivedFile[];
  receivedTexts: ReceivedText[];
  onDisconnect?: () => void;
}

export default function TransferPage({
  connectionStatus,
  onReceivedData,
  sendData,
  receivedFiles,
  receivedTexts,
  onDisconnect
}: TransferPageProps) {
  // State management
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [textInput, setTextInput] = useState('');
  const [transferProgress, setTransferProgress] = useState<number>(0);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [sentMessages, setSentMessages] = useState<{id: string; content: string; timestamp: string; type: 'sent' | 'received'; isFile?: boolean; fileData?: any}[]>([]);
  const [messages, setMessages] = useState<{id: string; content: string; timestamp: string; type: 'sent' | 'received'; isFile?: boolean; fileData?: any}[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Update message list, merging sent and received messages
  useEffect(() => {
    // Convert received text messages to unified format
    const textMessages = receivedTexts.map(text => ({
      id: text.id,
      content: text.content,
      timestamp: text.timestamp,
      timestampMs: parseInt(text.id), // Use ID as timestamp for sorting
      type: 'received' as const,
      isFile: false
    }));
    
    // Convert received files to unified format
    const fileMessages = receivedFiles.map(file => ({
      id: file.id,
      content: file.name,
      timestamp: new Date(parseInt(file.id)).toLocaleString(),
      timestampMs: parseInt(file.id), // Use ID as timestamp for sorting
      type: 'received' as const,
      isFile: true,
      fileData: file
    }));
    
    // Add timestampMs to sent messages for consistent sorting
    const sentMessagesWithMs = sentMessages.map(msg => ({
      ...msg,
      timestampMs: parseInt(msg.id) // Use ID as timestamp for sorting
    }));
    
    // Merge all messages and sort by time
    const allMessages = [...sentMessagesWithMs, ...textMessages, ...fileMessages].sort((a, b) => {
      return a.timestampMs - b.timestampMs;
    });
    
    setMessages(allMessages);
  }, [receivedTexts, receivedFiles, sentMessages]);
  
  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle file selection
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const newFiles = Array.from(files).map(file => ({
      file,
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    }));
    
    setSelectedFiles(newFiles);
    
    // Automatically send files when selected
    await sendFiles(newFiles);
  };
  
  // Send files
  const sendFiles = async (filesToSend: FileItem[] = selectedFiles) => {
    if (filesToSend.length === 0) return;
    
    setIsTransferring(true);
    const totalFiles = filesToSend.length;
    let completedFiles = 0;
    
    for (const fileItem of filesToSend) {
      try {
        const file = fileItem.file;
        const arrayBuffer = await file.arrayBuffer();
        
        // Prepare file metadata
        const fileData = {
          type: 'file',
          name: file.name,
          size: file.size,
          dataType: file.type || 'application/octet-stream',
          data: arrayBuffer
        };
        
        // Send file data
        if (sendData(fileData)) {
          // Add to local message list
          const newMessage = {
            id: Date.now().toString(),
            content: file.name,
            timestamp: new Date().toLocaleString(),
            type: 'sent' as const,
            isFile: true,
            fileData: {
              name: file.name,
              size: file.size,
              type: file.type,
              url: URL.createObjectURL(file)
            }
          };
          setSentMessages(prev => [...prev, newMessage]);
          
          completedFiles++;
          setTransferProgress((completedFiles / totalFiles) * 100);
        } else {
          setIsTransferring(false);
          return;
        }
      } catch (error) {
        console.error('Failed to read file:', error);
        setIsTransferring(false);
        return;
      }
    }
    
    // Clear file list
    setSelectedFiles([]);
    setTransferProgress(0);
    setIsTransferring(false);
  };
  
  // Send text
  const sendText = () => {
    if (!textInput.trim()) return;
    
    // Prepare text data
    const textData = {
      type: 'text',
      content: textInput.trim(),
      timestamp: new Date().toISOString()
    };
    
    // Send text data
    if (sendData(textData)) {
      // Add to local message list
      const newMessage = {
        id: Date.now().toString(),
        content: textInput.trim(),
        timestamp: new Date().toLocaleString(),
        type: 'sent' as const,
        isFile: false
      };
      setSentMessages(prev => [...prev, newMessage]);
      
      // Clear input
      setTextInput('');
    }
  };
  
  // Copy image to clipboard
  const copyImageToClipboard = async (url: string, fileName: string) => {
    try {
      // Check if Clipboard API is available
      if (!navigator.clipboard) {
        console.error('Browser does not support Clipboard API');
        return;
      }

      const response = await fetch(url);
      const blob = await response.blob();
      
      try {
        // Check if ClipboardItem is supported
        if (typeof ClipboardItem === 'undefined') {
          throw new Error('ClipboardItem not supported');
        }

        // Try using the new Clipboard API
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
      } catch (err) {
        console.error('Copy to clipboard failed:', err);
        
        // Fallback: create a temporary link and open the image
        const tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.target = '_blank';
        tempLink.click();
      }
    } catch (e) {
      console.error('Could not get image data:', e);
    }
  };

  // Copy text to clipboard
  const copyTextToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Text copied successfully
        setCopiedMessageId(messageId);
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopiedMessageId(null);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
      });
  };
  
  // Image preview click enlarge
  const handleImageClick = (url: string) => {
    window.open(url, '_blank');
  };
  
  // Handle pressing Enter key to send message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default line break behavior
      sendText();
    }
  };
  
  return (
    <>
      <div className="status-bar">
        <p>Status: <span className={connectionStatus.includes('Connected') ? 'connected-text' : ''}>{connectionStatus}</span></p>
        {onDisconnect && (
          <div className="status-actions">
            <button className="disconnect-btn" onClick={onDisconnect}>
              <span>Disconnect</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="chat-container">
        <div className="messages-container" ref={chatContainerRef}>
          {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message.id} className={`message ${message.type === 'sent' ? 'message-sent' : 'message-received'}`}>
                <div className="message-content-wrapper">
                  <div className="message-content">
                  {message.isFile ? (
                    <div className="file-message">
                      <div className="file-info">
                        <span className="file-icon">
                          {message.fileData.type.startsWith('image/') ? '🖼️' : 
                           message.fileData.type.includes('pdf') ? '📑' :
                           message.fileData.type.includes('word') ? '📝' :
                           message.fileData.type.includes('excel') || message.fileData.type.includes('sheet') ? '📊' :
                           message.fileData.type.includes('video') ? '🎬' :
                           message.fileData.type.includes('audio') ? '🎵' : '📄'}
                        </span>
                        <span className="file-name">{message.content}</span>
                        <span className="file-size">{formatFileSize(message.fileData.size)}</span>
                      </div>
                      
                      {message.fileData.type.startsWith('image/') && (
                        <div className="image-preview" onClick={() => handleImageClick(message.fileData.url)}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={message.fileData.url} 
                            alt={message.content} 
                            style={{ maxWidth: '200px', maxHeight: '200px', margin: '10px 0' }}
                          />
                        </div>
                      )}
                      
                      <div className="file-actions">
                        <a href={message.fileData.url} download={message.content} className="btn-small download">Download</a>
                        {message.fileData.type.startsWith('image/') && (
                          <button 
                            className="btn-small copy-image" 
                            onClick={() => copyImageToClipboard(message.fileData.url, message.content)}
                          >
                            Copy Image
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-message">
                      {message.content}
                      <button 
                        className={`btn-small copy-text ${copiedMessageId === message.id ? 'copied' : ''}`}
                        onClick={() => copyTextToClipboard(message.content, message.id)}
                        title="Copy text"
                      >
                        {copiedMessageId === message.id ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  )}
                                  </div>
                  <div className="message-time">
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="icon">💬</div>
              <p>No messages yet</p>
            </div>
          )}
        </div>
        
        <div className="message-input-container">
          <div className="message-tools">
            <label htmlFor="file-input-chat" className="file-btn">📎</label>
            <input 
              type="file" 
              id="file-input-chat" 
              multiple 
              hidden 
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
          
          <textarea 
            className="message-input"
            placeholder="Type a message..." 
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={handleKeyPress}
          ></textarea>
          
          <button 
            className="send-btn" 
            disabled={!textInput.trim()}
            onClick={sendText}
          >
            Send
          </button>
        </div>
        
        {isTransferring && (
          <div className="transfer-progress-container">
            <div className="transfer-progress">
              <div className="progress-bar" style={{ width: `${transferProgress}%` }}></div>
            </div>
            <div className="transfer-status">Sending files: {Math.round(transferProgress)}%</div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 180px);
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          transition: all var(--transition-medium);
        }
        
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-lg);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
        }
        
        .message {
          margin-bottom: var(--spacing-lg);
          max-width: 80%;
          clear: both;
          display: flex;
          flex-direction: column;
        }
        
        .message-sent {
          align-self: flex-end;
          align-items: flex-end;
        }
        
        .message-received {
          align-self: flex-start;
          align-items: flex-start;
        }
        
        .message-content {
          padding: 12px 16px;
          border-radius: 18px;
          word-wrap: break-word;
          word-break: break-word;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
          transition: all var(--transition-medium);
          font-size: 15px;
          line-height: 1.4;
          display: inline-block;
          max-width: 100%;
          min-width: 60px;
          width: fit-content;
          white-space: pre-wrap;
        }
        
        .message-sent .message-content {
          background: #F9D71C;
          color: #1f2937;
          border-top-right-radius: 6px;
          box-shadow: 0 2px 8px rgba(249, 215, 28, 0.25);
        }
        
        .message-received .message-content {
          background: rgba(255, 255, 255, 0.95);
          color: #1d1d1f;
          border-top-left-radius: 6px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .message-time {
          font-size: 12px;
          color: rgba(60, 60, 67, 0.6);
          margin: 4px 8px 0;
          opacity: 0.8;
          align-self: flex-end;
        }
        
        .message-received .message-time {
          align-self: flex-start;
        }
        
        .message-content-wrapper {
          display: flex;
          flex-direction: column;
          width: fit-content;
          max-width: 100%;
        }
        
        .message-input-container {
          display: flex;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          align-items: center;
          gap: 12px;
        }
        
        .message-tools {
          display: flex;
          align-items: center;
        }
        
        .file-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          font-size: 18px;
          cursor: pointer;
          background: rgba(249, 215, 28, 0.1);
          border: none;
          border-radius: 20px;
          transition: all var(--transition-medium);
          color: #F9D71C;
          box-sizing: border-box;
          flex-shrink: 0;
        }
        
        .file-btn:hover {
          background: rgba(249, 215, 28, 0.2);
          transform: scale(1.05);
        }
        
        .message-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 20px;
          padding: 8px 16px;
          resize: none;
          height: 40px;
          max-height: 120px;
          font-family: var(--font-family);
          font-size: 15px;
          color: #1d1d1f;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all var(--transition-medium);
          line-height: 1.4;
          box-sizing: border-box;
          vertical-align: middle;
          display: flex;
          align-items: center;
          margin: 0;
        }
        
        .message-input:focus {
          outline: none;
          border-color: #F9D71C;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 0 2px rgba(249, 215, 28, 0.2);
        }
        
        .message-input::placeholder {
          color: rgba(60, 60, 67, 0.6);
          font-size: 15px;
        }
        
        .send-btn {
          padding: 0 20px;
          background: #F9D71C;
          color: #1f2937;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          font-size: 15px;
          transition: all var(--transition-medium);
          height: 40px;
          min-width: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(249, 215, 28, 0.3);
        }
        
        .send-btn:hover:not(:disabled) {
          background: #E6C200;
          transform: scale(1.02);
        }
        
        .send-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        
        .send-btn:disabled {
          background: rgba(0, 0, 0, 0.15);
          color: rgba(0, 0, 0, 0.3);
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
        
        .text-message {
          position: relative;
          white-space: pre-wrap;
          line-height: 1.4;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        
        .text-message .btn-small {
          display: none;
          position: absolute;
          right: var(--spacing-xs);
          bottom: var(--spacing-xs);
          font-size: 11px;
          padding: var(--spacing-xs) var(--spacing-sm);
          background: rgba(249, 215, 28, 0.1);
          border: 1px solid rgba(249, 215, 28, 0.3);
          border-radius: var(--radius-sm);
          backdrop-filter: blur(10px);
          transition: all var(--transition-medium);
          color: #F9D71C;
        }
        
        .text-message:hover .btn-small {
          display: block;
        }
        
        .btn-small:hover {
          background: rgba(249, 215, 28, 0.2);
          transform: scale(1.05);
          color: #E6C200;
        }
        
        /* Sent message text copy button - white style */
        .message-sent .text-message .btn-small {
          background: rgba(255, 255, 255, 0.3);
          color: #1f2937;
          border: 1px solid rgba(255, 255, 255, 0.4);
        }
        
        .message-sent .text-message .btn-small:hover {
          background: rgba(255, 255, 255, 0.5);
          color: #1f2937;
          border-color: rgba(255, 255, 255, 0.6);
        }
        
        .message-sent .text-message .btn-small.copied {
          background: rgba(52, 199, 89, 0.8);
          color: #FFFFFF;
          border-color: rgba(52, 199, 89, 0.9);
        }
        
        .message-sent .text-message .btn-small.copied:hover {
          background: rgba(52, 199, 89, 0.9);
          color: #FFFFFF;
        }
        
        .file-message {
          background: rgba(255, 255, 255, 0.3);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: fit-content;
          min-width: 200px;
          max-width: 100%;
        }
        
        .file-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }
        
        .file-icon {
          font-size: 1.2rem;
        }
        
        .file-name {
          font-weight: var(--font-weight-medium);
          flex: 1;
        }
        
        .file-size {
          font-size: 12px;
          opacity: 0.8;
        }
        
        .file-actions {
          display: flex;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-sm);
        }
        
        .file-actions .btn-small {
          display: block;
          background: rgba(249, 215, 28, 0.1);
          color: #F9D71C;
          border: 1px solid rgba(249, 215, 28, 0.3);
          text-decoration: none;
          font-size: 12px;
        }
        
        .message-sent .file-actions .btn-small {
          background: rgba(255, 255, 255, 0.3);
          color: #1f2937;
          border: 1px solid rgba(255, 255, 255, 0.4);
        }
        
        .image-preview {
          margin: var(--spacing-sm) 0;
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: all var(--transition-medium);
        }
        
        .image-preview:hover {
          transform: scale(1.02);
          box-shadow: var(--glass-shadow);
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: rgba(60, 60, 67, 0.6);
          padding: 60px 24px;
          text-align: center;
        }
        
        .empty-state .icon {
          font-size: 3rem;
          margin-bottom: 16px;
          opacity: 0.3;
          color: rgba(60, 60, 67, 0.3);
        }
        
        .empty-state p {
          font-size: 17px;
          font-weight: 400;
          color: rgba(60, 60, 67, 0.6);
        }
        
        .transfer-progress-container {
          padding: var(--spacing-lg);
          background: var(--bg-glass-strong);
          border-top: 1px solid var(--glass-border);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
        }
        
        .transfer-progress {
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-sm);
          overflow: hidden;
          margin-bottom: var(--spacing-sm);
          border: 1px solid var(--glass-border);
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-color) 0%, var(--primary-hover) 100%);
          transition: width var(--transition-medium);
          box-shadow: 0 0 10px rgba(249, 215, 28, 0.3);
        }
        
        .transfer-status {
          font-size: 12px;
          color: var(--text-secondary);
          text-align: center;
          font-weight: var(--font-weight-medium);
        }
        
        /* Custom scrollbar for messages */
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .messages-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: var(--radius-sm);
        }
        
        .messages-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        
                 /* Responsive adjustments */
         @media (max-width: 768px) {
           .message {
             max-width: 90%;
           }
           
           .message-content {
             min-width: 40px;
           }
           
           .message-input-container {
             padding: 16px;
             gap: 10px;
           }
           
           .file-btn {
             width: 36px;
             height: 36px;
             font-size: 16px;
           }
           
           .message-input {
             height: 36px;
             padding: 6px 14px;
             font-size: 16px;
           }
           
           .message-input::placeholder {
             font-size: 16px;
           }
           
           .send-btn {
             padding: 0 16px;
             height: 36px;
             font-size: 15px;
             min-width: 60px;
           }
         }
      `}</style>
    </>
  );
} 