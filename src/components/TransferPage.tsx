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
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [textInput, setTextInput] = useState('');
  const [transferProgress, setTransferProgress] = useState<number>(0);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);
  
  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const newFiles = Array.from(files).map(file => ({
      file,
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    }));
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };
  
  // Remove selected file
  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id));
  };
  
  // Send files
  const sendFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsTransferring(true);
    const totalFiles = selectedFiles.length;
    let completedFiles = 0;
    
    for (const fileItem of selectedFiles) {
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
      // Clear input
      setTextInput('');
      showToast('Text sent successfully');
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

  // Set up drag area events
  useEffect(() => {
    if (!dragAreaRef.current) return;
    
    const dragArea = dragAreaRef.current;
    
    // Prevent default drag behavior
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    // Highlight drag area
    const highlight = () => {
      dragArea.classList.add('highlight');
    };
    
    // Remove highlight
    const unhighlight = () => {
      dragArea.classList.remove('highlight');
    };
    
    // Handle file drop
    const handleDrop = (e: DragEvent) => {
      const dt = e.dataTransfer;
      if (dt && dt.files.length > 0) {
        handleFileSelect(dt.files);
      }
    };
    
    // Add event listeners
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dragArea.addEventListener(eventName, preventDefaults as EventListener);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dragArea.addEventListener(eventName, highlight);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dragArea.addEventListener(eventName, unhighlight);
    });
    
    dragArea.addEventListener('drop', handleDrop as EventListener);
    
    // Clean up event listeners
    return () => {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dragArea.removeEventListener(eventName, preventDefaults as EventListener);
      });
      
      ['dragenter', 'dragover'].forEach(eventName => {
        dragArea.removeEventListener(eventName, highlight);
      });
      
      ['dragleave', 'drop'].forEach(eventName => {
        dragArea.removeEventListener(eventName, unhighlight);
      });
      
      dragArea.removeEventListener('drop', handleDrop as EventListener);
    };
  }, []);
  
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
      
      <div className="transfer-container">
        <h2>Step 2: Transfer Content</h2>
        
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'file' ? 'active' : ''}`} 
            onClick={() => setActiveTab('file')}
          >
            Files
          </button>
          <button 
            className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
            onClick={() => setActiveTab('text')}
          >
            Text
          </button>
        </div>
        
        <div className="tab-content">
          <div id="file" className={`tab-pane ${activeTab === 'file' ? 'active' : ''}`}>
            <div className="drag-area" 
              ref={dragAreaRef}
            >
              <span className="upload-icon">📤</span>
              <p>Drop files here or</p>
              <label htmlFor="file-input" className="file-label">Choose Files</label>
              <input 
                type="file" 
                id="file-input" 
                multiple 
                hidden 
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>
            
            <div id="file-list" className="file-list">
              {selectedFiles.map((fileItem) => (
                <div key={fileItem.id} className="file-item">
                  <div className="file-info">
                    <span className="file-icon">
                      {fileItem.file.type.startsWith('image/') ? '🖼️' : 
                       fileItem.file.type.includes('pdf') ? '📑' :
                       fileItem.file.type.includes('word') ? '📝' :
                       fileItem.file.type.includes('excel') || fileItem.file.type.includes('sheet') ? '📊' :
                       fileItem.file.type.includes('video') ? '🎬' :
                       fileItem.file.type.includes('audio') ? '🎵' : '📄'}
                    </span>
                    <span className="file-name">{fileItem.file.name}</span>
                    <span className="file-size">{formatFileSize(fileItem.file.size)}</span>
                  </div>
                  <span 
                    className="file-remove" 
                    onClick={() => removeFile(fileItem.id)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
            
            {isTransferring && (
              <div className="transfer-progress">
                <div className="progress-bar" style={{ width: `${transferProgress}%` }}></div>
              </div>
            )}
            
            <button 
              id="send-files-btn" 
              className="btn" 
              disabled={selectedFiles.length === 0 || isTransferring}
              onClick={sendFiles}
            >
              {isTransferring ? 'Sending...' : 'Send Files'}
            </button>
          </div>
          
          <div id="text" className={`tab-pane ${activeTab === 'text' ? 'active' : ''}`}>
            <textarea 
              id="text-input" 
              placeholder="Enter text to send..." 
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.ctrlKey && e.key === 'Enter' && sendText()}
            ></textarea>
            <div className="send-hint">Tip: Press Ctrl+Enter to send quickly</div>
            <button 
              id="send-text-btn" 
              className="btn" 
              disabled={!textInput.trim()}
              onClick={sendText}
            >
              Send Text
            </button>
          </div>
        </div>
      </div>
      
      <div className="received-panel">
        <h2>Received Content</h2>
        <div id="received-files" className="received-items">
          {receivedFiles.length > 0 ? (
            receivedFiles.map((file) => {
              const isImage = file.type.startsWith('image/');
              
              return (
                <div key={file.id} className="received-item">
                  <div className="file-info">
                    <span className="file-icon">
                      {file.type.startsWith('image/') ? '🖼️' : 
                       file.type.includes('pdf') ? '📑' :
                       file.type.includes('word') ? '📝' :
                       file.type.includes('excel') || file.type.includes('sheet') ? '📊' :
                       file.type.includes('video') ? '🎬' :
                       file.type.includes('audio') ? '🎵' : '📄'}
                    </span>
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                  </div>
                  
                  {isImage && (
                    <div className="image-preview" onClick={() => handleImageClick(file.url)}>
                      <img 
                        src={file.url} 
                        alt={file.name} 
                        style={{ maxWidth: '200px', maxHeight: '200px', margin: '10px 0' }}
                      />
                    </div>
                  )}
                  
                  <div className="file-actions">
                    <a href={file.url} download={file.name} className="btn-small download">Download</a>
                    {isImage && (
                      <button 
                        className="btn-small copy-image" 
                        onClick={() => copyImageToClipboard(file.url, file.name)}
                      >
                        Copy Image
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <div className="icon">📥</div>
              <p>No files received yet</p>
            </div>
          )}
        </div>
        
        <div id="received-text" className="received-items">
          {receivedTexts.length > 0 ? (
            receivedTexts.map((text) => (
              <div key={text.id} className="received-item received-text">
                <div className="text-content">{text.content}</div>
                <div className="text-footer">
                  <small>{new Date(text.timestamp).toLocaleString()}</small>
                  <button 
                    className="btn-small copy-text"
                    onClick={() => copyTextToClipboard(text.content)}
                    title="Copy text"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="icon">💬</div>
              <p>No text messages received yet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 