"use client";

import Link from "next/link";

export default function Privacy() {
  return (
    <main className="app-content">
      <section className="page-content">
        <div className="page-container">
          <h1>Privacy Policy</h1>
          
          <div className="privacy-intro">
            <p>
              <strong>Last Updated: April 5, 2023</strong>
            </p>
            <p>
              At TransferFiles, we take your privacy very seriously. This Privacy Policy explains how we collect, 
              use, and protect your information when you use our service. By using TransferFiles, you agree to the 
              collection and use of information in accordance with this policy.
            </p>
          </div>
          
          <div className="privacy-section">
            <h2>Information Collection and Use</h2>
            <h3>Files and Messages</h3>
            <p>
              <strong>We do not store your files or messages on our servers.</strong> TransferFiles uses WebRTC technology 
              to establish a direct peer-to-peer connection between users. All content transfers directly from one device 
              to another without passing through our servers. Your files and messages are never stored, monitored, or 
              logged by TransferFiles.
            </p>
            
            <h3>Connection IDs</h3>
            <p>
              When you use TransferFiles, a temporary connection ID is generated. This ID is used solely to establish 
              the connection between devices and is discarded once the session ends. We do not store connection IDs 
              or use them to track users across sessions.
            </p>
            
            <h3>Usage Data</h3>
            <p>
              We collect anonymous usage data to help improve our service. This may include information such as:
            </p>
            <ul>
              <li>Your browser type and version</li>
              <li>The time and date of your visit</li>
              <li>The time spent on our website</li>
              <li>The pages visited</li>
              <li>Anonymous usage statistics (e.g., number of connections, but not the content of transfers)</li>
            </ul>
            <p>
              This information is collected in aggregate form and cannot be used to identify individual users.
            </p>
          </div>
          
          <div className="privacy-section">
            <h2>Use of Cookies</h2>
            <p>
              TransferFiles uses a minimal number of cookies that are necessary for the functionality of our service. 
              These cookies are used to remember your preferences and provide a better user experience. We do not use 
              cookies for advertising or tracking purposes.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, 
              if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
          </div>
          
          <div className="privacy-section">
            <h2>Security</h2>
            <p>
              The security of your data is important to us, which is why we've designed TransferFiles with privacy 
              and security as core principles:
            </p>
            <ul>
              <li>All data transfers between peers are encrypted using WebRTC's built-in encryption</li>
              <li>No data is stored on our servers</li>
              <li>Connection IDs are temporary and discarded after use</li>
              <li>Our website uses HTTPS to ensure secure communication with our servers</li>
            </ul>
            <p>
              However, please be aware that no method of transmission over the Internet or method of electronic 
              storage is 100% secure. While we strive to use commercially acceptable means to protect your data, 
              we cannot guarantee its absolute security.
            </p>
          </div>
          
          <div className="privacy-section">
            <h2>Third-Party Services</h2>
            <p>
              TransferFiles uses certain third-party services to operate our service:
            </p>
            <ul>
              <li>
                <strong>Analytics:</strong> We use analytics providers to collect anonymous usage data. These providers 
                may use cookies and process your IP address to provide us with insights about how our service is used.
              </li>
              <li>
                <strong>Hosting:</strong> Our website is hosted on servers provided by third-party hosting companies. 
                These companies have their own privacy policies regarding the data they collect.
              </li>
            </ul>
            <p>
              We only work with third parties that have strong privacy practices and comply with applicable data 
              protection regulations.
            </p>
          </div>
          
          <div className="privacy-section">
            <h2>Children's Privacy</h2>
            <p>
              TransferFiles is not intended for use by children under the age of 13. We do not knowingly collect 
              personal information from children under 13. If you are a parent or guardian and you learn that your 
              child has provided us with personal information, please contact us. If we become aware that we have 
              collected personal information from a child under age 13 without verification of parental consent, 
              we will take steps to remove that information.
            </p>
          </div>
          
          <div className="privacy-section">
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy 
              Policy are effective when they are posted on this page.
            </p>
          </div>
          
          <div className="privacy-section">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <p>
              By email: <a href="mailto:contact@transferfiles.pro">contact@transferfiles.pro</a>
            </p>
            <p>
              By visiting our contact page: <Link href="/contact">Contact Us</Link>
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