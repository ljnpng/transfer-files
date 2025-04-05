"use client";

import { useState, useRef, useEffect } from 'react';
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
  const [messages, setMessages] = useState<{id: string; content: string; timestamp: string; type: 'sent' | 'received'; isFile?: boolean; fileData?: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Update message list, merging sent and received messages
  useEffect(() => {
    // Convert received text messages to unified format
    const textMessages = receivedTexts.map(text => ({
      id: text.id,
      content: text.content,
      timestamp: text.timestamp,
      type: 'received' as const,
      isFile: false
    }));
    
    // Convert received files to unified format
    const fileMessages = receivedFiles.map(file => ({
      id: file.id,
      content: file.name,
      timestamp: new Date(parseInt(file.id)).toLocaleString(),
      type: 'received' as const,
      isFile: true,
      fileData: file
    }));
    
    // Merge all messages and sort by time
    const allMessages = [...textMessages, ...fileMessages].sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
    
    setMessages(allMessages);
  }, [receivedTexts, receivedFiles]);
  
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
          setMessages(prev => [...prev, newMessage]);
          
          completedFiles++;
          setTransferProgress((completedFiles / totalFiles) * 100);
          showToast(`Sending: ${file.name}`);
        } else {
          showToast('Send failed, please check connection', true);
          setIsTransferring(false);
          return;
        }
      } catch (error) {
        console.error('Failed to read file:', error);
        showToast('File transfer failed', true);
        setIsTransferring(false);
        return;
      }
    }
    
    // Clear file list
    setSelectedFiles([]);
    setTransferProgress(0);
    setIsTransferring(false);
    showToast('File transfer completed');
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
      setMessages(prev => [...prev, newMessage]);
      
      // Clear input
      setTextInput('');
      showToast('Message sent');
    } else {
      showToast('Send failed, please check connection', true);
    }
  };
  
  // Copy image to clipboard
  const copyImageToClipboard = async (url: string, fileName: string) => {
    try {
      // Check if Clipboard API is available
      if (!navigator.clipboard) {
        console.error('Browser does not support Clipboard API');
        showToast('Your browser does not support copying, please download the image manually', true);
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
        showToast(`Copied image ${fileName}`);
      } catch (err) {
        console.error('Copy to clipboard failed:', err);
        
        // Fallback: create a temporary link and open the image
        const tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.target = '_blank';
        tempLink.click();
        
        showToast('Cannot copy directly, opened in new window for manual copy', true);
      }
    } catch (e) {
      console.error('Could not get image data:', e);
      showToast('Copy failed, please download the image manually', true);
    }
  };

  // Copy text to clipboard
  const copyTextToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
        showToast('Copy failed, please select and copy manually', true);
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
                        className="btn-small copy-text"
                        onClick={() => copyTextToClipboard(message.content)}
                        title="Copy text"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>
                <div className="message-time">
                  {message.timestamp}
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
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
          overflow: hidden;
        }
        
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          background-color: #f5f7f9;
        }
        
        .message {
          margin-bottom: 15px;
          max-width: 70%;
          clear: both;
        }
        
        .message-sent {
          float: right;
        }
        
        .message-received {
          float: left;
        }
        
        .message-content {
          padding: 10px 15px;
          border-radius: 18px;
          word-wrap: break-word;
        }
        
        .message-sent .message-content {
          background-color: #dcf8c6;
          border-top-right-radius: 5px;
        }
        
        .message-received .message-content {
          background-color: #fff;
          border-top-left-radius: 5px;
          box-shadow: 0 1px 1px rgba(0,0,0,0.1);
        }
        
        .message-time {
          font-size: 12px;
          color: #999;
          margin: 5px 10px;
          text-align: right;
        }
        
        .message-input-container {
          display: flex;
          padding: 10px;
          background-color: #f0f0f0;
          border-top: 1px solid #ddd;
          align-items: center;
        }
        
        .message-tools {
          margin-right: 10px;
        }
        
        .file-btn {
          display: inline-block;
          font-size: 20px;
          cursor: pointer;
          padding: 5px;
        }
        
        .message-input {
          flex: 1;
          border: 1px solid #ddd;
          border-radius: 20px;
          padding: 10px 15px;
          resize: none;
          min-height: 40px;
          max-height: 120px;
          font-family: inherit;
          font-size: 14px;
        }
        
        .send-btn {
          margin-left: 10px;
          padding: 8px 15px;
          background-color: #0066cc;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .send-btn:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .text-message {
          position: relative;
          white-space: pre-wrap;
        }
        
        .text-message .btn-small {
          display: none;
          position: absolute;
          right: 5px;
          bottom: 5px;
          font-size: 12px;
          padding: 2px 5px;
        }
        
        .text-message:hover .btn-small {
          display: block;
        }
        
        .file-message {
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
          padding: 8px;
        }
        
        .file-direction {
          font-size: 12px;
          color: #888;
          margin-left: 10px;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #999;
          padding: 50px 20px;
        }
        
        .empty-state .icon {
          font-size: 40px;
          margin-bottom: 10px;
        }
        
        .transfer-progress-container {
          padding: 10px;
          background-color: #f9f9f9;
          border-top: 1px solid #eee;
        }
        
        .transfer-progress {
          height: 6px;
          background-color: #eee;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 5px;
        }
        
        .progress-bar {
          height: 100%;
          background-color: #0066cc;
          transition: width 0.3s ease;
        }
        
        .transfer-status {
          font-size: 12px;
          color: #666;
          text-align: center;
        }
      `}</style>
    </>
  );
} 