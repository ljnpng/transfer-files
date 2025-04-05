"use client";

import Link from "next/link";

export default function Security() {
  return (
    <main className="app-content">
      <section className="page-content">
        <div className="page-container">
          <h1>Security Information</h1>
          
          <div className="security-intro">
            <p>
              At TransferFiles, security and privacy are core principles of our service. This page explains 
              in detail how we protect your data during transfers and ensure your privacy.
            </p>
          </div>
          
          <div className="security-section">
            <h2>Our Security Approach</h2>
            <p>
              TransferFiles was designed with a "privacy by design" approach. We believe that the most secure 
              way to transfer files is to not store them on servers at all. That's why TransferFiles uses 
              direct peer-to-peer connections for all transfers, ensuring your files never pass through our 
              servers.
            </p>
            <p>
              Our technical implementation prioritizes the following security principles:
            </p>
            <ul>
              <li>End-to-end encryption for all transfers</li>
              <li>No server storage of user files or messages</li>
              <li>Minimal data collection</li>
              <li>Temporary connection IDs</li>
              <li>Transport Layer Security for all website communications</li>
            </ul>
          </div>
          
          <div className="security-section">
            <h2>WebRTC Technology</h2>
            <p>
              TransferFiles uses WebRTC (Web Real-Time Communication) technology for direct browser-to-browser 
              connections. WebRTC is an open-source project supported by major technology companies and browsers 
              that provides secure, real-time communication capabilities.
            </p>
            <h3>How WebRTC Secures Your Data</h3>
            <p>
              WebRTC includes several security features that protect your transfers:
            </p>
            <ul>
              <li>
                <strong>DTLS (Datagram Transport Layer Security):</strong> All WebRTC connections are encrypted 
                using DTLS, which is similar to the encryption used in HTTPS websites. This ensures that even if 
                someone intercepts the data packets, they cannot decode the contents.
              </li>
              <li>
                <strong>SRTP (Secure Real-time Transport Protocol):</strong> WebRTC uses SRTP to provide 
                encryption, message authentication, and replay protection for audio and video streams.
              </li>
              <li>
                <strong>Perfect Forward Secrecy:</strong> The encryption keys are generated for each session and 
                discarded after use, ensuring that past communications cannot be decrypted even if a key is 
                compromised in the future.
              </li>
            </ul>
          </div>
          
          <div className="security-section">
            <h2>Direct Peer-to-Peer Connections</h2>
            <p>
              When you use TransferFiles, your files and messages are transferred directly from one device to 
              another through an established peer-to-peer connection. Unlike traditional file-sharing services, 
              your files never pass through or get stored on our servers.
            </p>
            <p>
              The only role our servers play is in the initial "signaling" process, which helps two devices 
              find and connect to each other. Once the connection is established, our servers are no longer 
              involved in the data transfer.
            </p>
            <div className="security-diagram">
              <div className="diagram-title">How TransferFiles Works</div>
              <div className="diagram-content">
                <div className="diagram-step">
                  <div className="step-number">1</div>
                  <div className="step-desc">Devices exchange connection information through signaling server</div>
                </div>
                <div className="diagram-arrow">→</div>
                <div className="diagram-step">
                  <div className="step-number">2</div>
                  <div className="step-desc">Direct encrypted P2P connection established</div>
                </div>
                <div className="diagram-arrow">→</div>
                <div className="diagram-step">
                  <div className="step-number">3</div>
                  <div className="step-desc">Files and messages transfer directly between devices</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="security-section">
            <h2>No Server Storage</h2>
            <p>
              One of the most important security features of TransferFiles is that we don't store your files 
              or messages on our servers. This means:
            </p>
            <ul>
              <li>Your files cannot be accessed by our team</li>
              <li>Your files aren't vulnerable to server breaches</li>
              <li>There are no lasting copies of your data after the transfer is complete</li>
              <li>We don't analyze, scan, or process the content of your transfers</li>
            </ul>
            <p>
              This "zero storage" approach significantly reduces the security risks associated with traditional 
              file-sharing services.
            </p>
          </div>
          
          <div className="security-section">
            <h2>Connection Security</h2>
            <h3>Temporary Connection IDs</h3>
            <p>
              When you open TransferFiles, a random ID is generated for your session. This ID is temporary and is 
              used only for establishing the connection. Once your session ends, the ID is no longer valid and 
              cannot be used to connect to your device.
            </p>
            <h3>HTTPS Encryption</h3>
            <p>
              The TransferFiles website uses HTTPS encryption to protect all communications between your browser 
              and our servers. This ensures that your connection ID and other session information are transmitted 
              securely.
            </p>
          </div>
          
          <div className="security-section">
            <h2>Comparison with Other Transfer Methods</h2>
            <table className="security-comparison">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>TransferFiles</th>
                  <th>Email Attachments</th>
                  <th>Cloud Storage</th>
                  <th>USB Drives</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>File Size Limits</td>
                  <td>No artificial limits</td>
                  <td>Usually 10-25MB</td>
                  <td>Varies by plan</td>
                  <td>Limited by drive capacity</td>
                </tr>
                <tr>
                  <td>Server Storage</td>
                  <td>None</td>
                  <td>Yes, on email servers</td>
                  <td>Yes, on cloud servers</td>
                  <td>None</td>
                </tr>
                <tr>
                  <td>End-to-End Encryption</td>
                  <td>Yes</td>
                  <td>Varies</td>
                  <td>Varies by service</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td>Account Required</td>
                  <td>No</td>
                  <td>Yes</td>
                  <td>Yes</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td>Physical Access Required</td>
                  <td>No</td>
                  <td>No</td>
                  <td>No</td>
                  <td>Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="security-section">
            <h2>Best Practices for Secure Transfers</h2>
            <p>
              While TransferFiles is designed to be secure, here are some additional best practices to ensure the 
              highest level of security for your transfers:
            </p>
            <ul>
              <li>
                <strong>Use private networks:</strong> When possible, avoid transferring sensitive files over public 
                Wi-Fi networks.
              </li>
              <li>
                <strong>Verify the recipient:</strong> Always make sure you're connecting to the intended recipient 
                before sending sensitive files.
              </li>
              <li>
                <strong>Password-protect sensitive files:</strong> For highly sensitive data, consider encrypting or 
                password-protecting your files before transferring them.
              </li>
              <li>
                <strong>Keep your browser updated:</strong> Always use the latest version of your browser to ensure 
                you have the most up-to-date security features.
              </li>
              <li>
                <strong>Disconnect after transfers:</strong> Once your transfer is complete, disconnect the session 
                if you don't need to send additional files.
              </li>
            </ul>
          </div>
          
          <div className="security-section">
            <h2>Security Updates and Vulnerability Reporting</h2>
            <p>
              We continuously monitor and update TransferFiles to address security vulnerabilities and implement 
              the latest best practices. If you discover a security vulnerability in TransferFiles, please report 
              it to us at <a href="mailto:security@transferfiles.pro">security@transferfiles.pro</a>.
            </p>
          </div>
          
          <div className="security-footer">
            <p>
              For more information about how we handle your data, please see our 
              <Link href="/privacy"> Privacy Policy</Link> and <Link href="/terms">Terms of Service</Link>.
            </p>
            <p>
              If you have any questions about TransferFiles security, please <Link href="/contact">contact us</Link>.
            </p>
          </div>
          
          <div className="page-links">
            <Link href="/" className="btn-back">Return to Home</Link>
          </div>
        </div>
      </section>
    </main>
  );
} 