"use client";

import Link from "next/link";

export default function Guide() {
  return (
    <main className="app-content">
      <section className="page-content">
        <div className="page-container">
          <h1>TransferFiles User Guide</h1>
          
          <div className="guide-intro">
            <p>
              This comprehensive guide will walk you through using TransferFiles to quickly and securely 
              transfer files and messages between devices. Whether you're new to TransferFiles or looking 
              to optimize your experience, you'll find all the information you need here.
            </p>
          </div>
          
          <div className="guide-toc">
            <h2>Table of Contents</h2>
            <ul>
              <li><a href="#getting-started">Getting Started</a></li>
              <li><a href="#connecting-devices">Connecting Devices</a></li>
              <li><a href="#transferring-files">Transferring Files</a></li>
              <li><a href="#sending-text">Sending Text Messages</a></li>
              <li><a href="#receiving-content">Receiving and Managing Content</a></li>
              <li><a href="#advanced-tips">Advanced Tips and Tricks</a></li>
              <li><a href="#troubleshooting">Troubleshooting</a></li>
            </ul>
          </div>
          
          <div id="getting-started" className="guide-section">
            <h2>Getting Started</h2>
            <h3>System Requirements</h3>
            <p>
              TransferFiles works on most modern devices with an up-to-date web browser. Here are the 
              minimum requirements:
            </p>
            <ul>
              <li>
                <strong>Supported browsers:</strong> Google Chrome (version 80+), Mozilla Firefox (version 75+), 
                Microsoft Edge (version 80+), Safari (version 13+), Opera (version 67+)
              </li>
              <li>
                <strong>Internet connection:</strong> Both devices must be connected to the internet
              </li>
              <li>
                <strong>JavaScript:</strong> Must be enabled in your browser
              </li>
            </ul>
            
            <h3>Accessing TransferFiles</h3>
            <p>
              To access TransferFiles, simply visit <a href="https://transferfiles.pro" target="_blank" rel="noopener noreferrer">https://transferfiles.pro</a> in 
              your web browser. There's no need to download or install any software, and no account creation is 
              required.
            </p>
          </div>
          
          <div id="connecting-devices" className="guide-section">
            <h2>Connecting Devices</h2>
            <p>
              Before you can transfer files, you need to establish a connection between two devices. There are 
              two ways to do this:
            </p>
            
            <div className="guide-subsection">
              <h3>Method 1: Using Connection IDs</h3>
              <ol className="numbered-steps">
                <li>
                  <strong>Generate an ID:</strong> When you open TransferFiles, a unique connection ID is 
                  automatically generated for your session.
                </li>
                <li>
                  <strong>Share this ID:</strong> Copy the connection ID by clicking the "Copy" button next to it.
                </li>
                <li>
                  <strong>Connect on second device:</strong> On the other device, open TransferFiles and paste 
                  the connection ID into the "Enter peer ID" field, then click "Connect".
                </li>
              </ol>
              <div className="guide-tip">
                <p><strong>Tip:</strong> The connection ID looks like a long string of letters and numbers. Make sure to copy and paste it exactly as shown.</p>
              </div>
            </div>
            
            <div className="guide-subsection">
              <h3>Method 2: Using QR Code</h3>
              <ol className="numbered-steps">
                <li>
                  <strong>Generate QR code:</strong> A QR code is automatically displayed on the TransferFiles 
                  homepage.
                </li>
                <li>
                  <strong>Scan with second device:</strong> On the other device, click "Scan QR Code to Connect" 
                  and allow camera access when prompted.
                </li>
                <li>
                  <strong>Point camera at QR code:</strong> Hold your device so that the camera can clearly see 
                  the QR code. The connection will be established automatically once the code is recognized.
                </li>
              </ol>
              <div className="guide-tip">
                <p><strong>Tip:</strong> Make sure there's enough light for the camera to clearly see the QR code. Keep the device steady for better scanning results.</p>
              </div>
            </div>
            
            <div className="guide-subsection">
              <h3>Connection Status</h3>
              <p>
                Once a connection is established, the status indicator will change to "Connected" on both devices. 
                You're now ready to transfer files and messages.
              </p>
              <p>
                If the connection fails, you'll see an error message. See the <a href="#troubleshooting">Troubleshooting</a> 
                section for common connection issues and their solutions.
              </p>
            </div>
          </div>
          
          <div id="transferring-files" className="guide-section">
            <h2>Transferring Files</h2>
            <p>
              Once connected, you can easily transfer files from one device to another:
            </p>
            
            <div className="guide-subsection">
              <h3>Selecting Files to Send</h3>
              <p>There are two ways to select files:</p>
              <ol className="numbered-steps">
                <li>
                  <strong>Drag and drop:</strong> Simply drag files from your computer and drop them into the 
                  designated drop area on the TransferFiles interface.
                </li>
                <li>
                  <strong>File browser:</strong> Click the "Choose Files" button to open your device's file browser 
                  and select one or more files.
                </li>
              </ol>
              <p>
                Once files are selected, they'll appear in the file list. You can add more files or remove files 
                from the list by clicking the "×" button next to each file.
              </p>
            </div>
            
            <div className="guide-subsection">
              <h3>Sending Files</h3>
              <p>
                After selecting your files, click the "Send Files" button to start the transfer. You'll see a 
                progress indicator showing the status of your transfer.
              </p>
              <div className="guide-tip">
                <p>
                  <strong>Tip:</strong> For large files, make sure both devices remain connected to the internet and keep 
                  the browser tab open until the transfer is complete.
                </p>
              </div>
            </div>
            
            <div className="guide-subsection">
              <h3>Supported File Types</h3>
              <p>
                TransferFiles supports all file types, including:
              </p>
              <ul>
                <li>Images (JPEG, PNG, GIF, etc.)</li>
                <li>Documents (PDF, DOCX, XLSX, etc.)</li>
                <li>Videos and audio files</li>
                <li>Archives (ZIP, RAR, etc.)</li>
                <li>Executables and application files</li>
              </ul>
              <div className="guide-tip">
                <p>
                  <strong>Note:</strong> While there's no artificial file size limit, very large files may be constrained 
                  by your browser's memory limitations. For very large files (multiple gigabytes), consider splitting them 
                  into smaller parts.
                </p>
              </div>
            </div>
          </div>
          
          <div id="sending-text" className="guide-section">
            <h2>Sending Text Messages</h2>
            <p>
              In addition to files, you can also send text messages between devices:
            </p>
            
            <div className="guide-subsection">
              <h3>Using the Text Tab</h3>
              <ol className="numbered-steps">
                <li>
                  <strong>Switch to text mode:</strong> Click the "Text" tab in the transfer interface.
                </li>
                <li>
                  <strong>Enter your message:</strong> Type or paste your text in the provided text area.
                </li>
                <li>
                  <strong>Send message:</strong> Click the "Send Text" button to transmit your message to the 
                  connected device.
                </li>
              </ol>
            </div>
            
            <div className="guide-subsection">
              <h3>Text Message Features</h3>
              <ul>
                <li>
                  <strong>Formatting preservation:</strong> Text messages preserve line breaks and basic formatting.
                </li>
                <li>
                  <strong>No size limits:</strong> Text messages can be of any length, though very large texts may 
                  take longer to transfer.
                </li>
                <li>
                  <strong>Instant delivery:</strong> Text messages are typically delivered immediately as they're 
                  smaller than most files.
                </li>
              </ul>
              <div className="guide-tip">
                <p>
                  <strong>Tip:</strong> Text message transfer is perfect for quickly sharing code snippets, URLs, 
                  passwords, or any text that would be tedious to retype.
                </p>
              </div>
            </div>
          </div>
          
          <div id="receiving-content" className="guide-section">
            <h2>Receiving and Managing Content</h2>
            <p>
              When someone sends you files or text messages through TransferFiles, they'll appear in the 
              "Received Content" section of the interface.
            </p>
            
            <div className="guide-subsection">
              <h3>Managing Received Files</h3>
              <p>For each received file, you'll see options to:</p>
              <ul>
                <li>
                  <strong>Download:</strong> Save the file to your device by clicking the "Download" button.
                </li>
                <li>
                  <strong>Preview:</strong> Images can be previewed directly in the browser by clicking on the 
                  thumbnail.
                </li>
                <li>
                  <strong>Copy images:</strong> For received images, you can copy them directly to your clipboard 
                  by clicking the "Copy Image" button.
                </li>
              </ul>
              <div className="guide-tip">
                <p>
                  <strong>Note:</strong> Received files remain available only while the browser tab is open. If you 
                  refresh the page or close the tab, you'll lose access to received files that haven't been downloaded.
                </p>
              </div>
            </div>
            
            <div className="guide-subsection">
              <h3>Managing Received Text</h3>
              <p>For received text messages:</p>
              <ul>
                <li>
                  <strong>Copy text:</strong> Click the "Copy" button to copy the entire text message to your clipboard.
                </li>
                <li>
                  <strong>Preserve access:</strong> Like files, received text messages are only available while the 
                  browser tab remains open.
                </li>
              </ul>
            </div>
          </div>
          
          <div id="advanced-tips" className="guide-section">
            <h2>Advanced Tips and Tricks</h2>
            
            <div className="guide-subsection">
              <h3>Using TransferFiles Across Networks</h3>
              <p>
                TransferFiles works across different networks and can connect devices anywhere in the world as 
                long as both have internet access. This means you can:
              </p>
              <ul>
                <li>
                  <strong>Transfer between office and home:</strong> Send work files from your office computer to 
                  your home device.
                </li>
                <li>
                  <strong>Share across geographical locations:</strong> Exchange files with someone in another city, 
                  country, or continent.
                </li>
              </ul>
              <div className="guide-tip">
                <p>
                  <strong>Note:</strong> Very restrictive network firewalls (like those in some corporate or educational 
                  settings) might block WebRTC connections. If you're having trouble connecting, try using a different 
                  network.
                </p>
              </div>
            </div>
            
            <div className="guide-subsection">
              <h3>Optimizing Transfer Speed</h3>
              <p>
                To get the fastest possible transfer speeds:
              </p>
              <ul>
                <li>
                  <strong>Use a stable internet connection:</strong> Wired connections or strong Wi-Fi signals provide 
                  the best results.
                </li>
                <li>
                  <strong>Close unnecessary tabs and applications:</strong> This frees up system resources for the 
                  transfer.
                </li>
                <li>
                  <strong>Compress large files:</strong> For multiple files or very large files, consider compressing 
                  them into a ZIP archive before transfer.
                </li>
                <li>
                  <strong>Transfer fewer files at once:</strong> Instead of transferring many files simultaneously, 
                  it's sometimes faster to transfer them in smaller batches.
                </li>
              </ul>
            </div>
            
            <div className="guide-subsection">
              <h3>Security Best Practices</h3>
              <p>
                To ensure the highest level of security:
              </p>
              <ul>
                <li>
                  <strong>Share connection IDs securely:</strong> When sharing a connection ID, use a secure 
                  communication method to prevent unauthorized access.
                </li>
                <li>
                  <strong>Verify with the recipient:</strong> Before transferring sensitive files, verify that 
                  you're connected to the intended recipient.
                </li>
                <li>
                  <strong>Disconnect when finished:</strong> Once your transfer is complete, disconnect the session 
                  by clicking "Disconnect" or closing the tab.
                </li>
              </ul>
            </div>
          </div>
          
          <div id="troubleshooting" className="guide-section">
            <h2>Troubleshooting</h2>
            
            <div className="guide-subsection">
              <h3>Common Connection Issues</h3>
              <div className="troubleshooting-table">
                <table>
                  <thead>
                    <tr>
                      <th>Problem</th>
                      <th>Possible Causes</th>
                      <th>Solutions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Connection fails to establish</td>
                      <td>
                        <ul>
                          <li>Incorrect connection ID</li>
                          <li>Network restrictions</li>
                          <li>Incompatible browser</li>
                        </ul>
                      </td>
                      <td>
                        <ul>
                          <li>Double-check the connection ID</li>
                          <li>Try a different network</li>
                          <li>Update your browser</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td>Connection drops during transfer</td>
                      <td>
                        <ul>
                          <li>Unstable internet connection</li>
                          <li>Browser tab closed or refreshed</li>
                          <li>Device went to sleep mode</li>
                        </ul>
                      </td>
                      <td>
                        <ul>
                          <li>Use a more stable connection</li>
                          <li>Keep the browser tab active</li>
                          <li>Adjust device sleep settings</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td>File transfer is too slow</td>
                      <td>
                        <ul>
                          <li>Slow internet connection</li>
                          <li>Large file size</li>
                          <li>Network congestion</li>
                        </ul>
                      </td>
                      <td>
                        <ul>
                          <li>Use a faster internet connection</li>
                          <li>Split large files into smaller parts</li>
                          <li>Try transferring during off-peak hours</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="guide-subsection">
              <h3>Browser-Specific Issues</h3>
              <ul>
                <li>
                  <strong>Chrome:</strong> If transfers are interrupted, check that Chrome hasn't put the tab to 
                  sleep. Pin important tabs or use extensions that prevent tab sleeping.
                </li>
                <li>
                  <strong>Firefox:</strong> If you experience connection issues, make sure Firefox's Enhanced 
                  Tracking Protection isn't blocking WebRTC connections.
                </li>
                <li>
                  <strong>Safari:</strong> Ensure that Safari's privacy settings allow for WebRTC connections. In some 
                  versions, you may need to explicitly enable WebRTC in the Advanced settings.
                </li>
              </ul>
            </div>
            
            <div className="guide-subsection">
              <h3>Still Having Problems?</h3>
              <p>
                If you're still experiencing issues after trying the troubleshooting steps above:
              </p>
              <ul>
                <li>
                  Check our <Link href="/help">Help Center</Link> for additional troubleshooting guides.
                </li>
                <li>
                  <Link href="/contact">Contact our support team</Link> with details about your issue.
                </li>
              </ul>
            </div>
          </div>
          
          <div className="page-links">
            <Link href="/" className="btn-back">Return to Home</Link>
          </div>
        </div>
      </section>
    </main>
  );
} 