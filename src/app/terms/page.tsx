"use client";

import Link from "next/link";

export default function Terms() {
  return (
    <main className="app-content">
      <section className="page-content">
        <div className="page-container">
          <h1>Terms of Service</h1>
          
          <div className="terms-intro">
            <p>
              <strong>Last Updated: April 5, 2023</strong>
            </p>
            <p>
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the 
              https://transferfiles.pro website (the "Service") operated by TransferFiles ("us", "we", "our").
            </p>
            <p>
              Your access to and use of the Service is conditioned on your acceptance of and compliance with 
              these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
            <p>
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with 
              any part of the terms, then you may not access the Service.
            </p>
          </div>
          
          <div className="terms-section">
            <h2>Use of Service</h2>
            <p>
              TransferFiles provides a peer-to-peer file sharing service that allows users to transfer files 
              and messages directly between devices. You understand and agree that:
            </p>
            <ul>
              <li>
                You will use the Service only for lawful purposes and in accordance with these Terms.
              </li>
              <li>
                You are responsible for all activity that occurs under your connection session.
              </li>
              <li>
                You will not use the Service to store, transfer, or share any content that is illegal, harmful, 
                threatening, abusive, harassing, defamatory, obscene, or otherwise objectionable.
              </li>
              <li>
                You will not use the Service to distribute malware, viruses, or any other malicious code.
              </li>
              <li>
                You will not attempt to circumvent any security features of the Service.
              </li>
              <li>
                You will not engage in any activity that interferes with or disrupts the Service.
              </li>
            </ul>
          </div>
          
          <div className="terms-section">
            <h2>Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive 
              property of TransferFiles and its licensors. The Service is protected by copyright, trademark, and 
              other laws of both the United States and foreign countries. Our trademarks and trade dress may not 
              be used in connection with any product or service without the prior written consent of TransferFiles.
            </p>
            <p>
              You retain all rights to any content you transfer using our Service. We do not claim any ownership 
              rights to the files or messages you transfer using TransferFiles.
            </p>
          </div>
          
          <div className="terms-section">
            <h2>Content Responsibility</h2>
            <p>
              TransferFiles does not store your files or messages on our servers. All content transfers directly 
              from one device to another without passing through our servers. However, you are solely responsible 
              for the content you transfer using our Service.
            </p>
            <p>
              By using the Service, you represent and warrant that:
            </p>
            <ul>
              <li>
                You own or have the necessary licenses, rights, consents, and permissions to use and transfer any 
                content that you transfer using the Service.
              </li>
              <li>
                Your use of the Service does not violate any third party's intellectual property rights, privacy 
                rights, publicity rights, or other personal or proprietary rights.
              </li>
              <li>
                Your use of the Service complies with all applicable laws and regulations.
              </li>
            </ul>
          </div>
          
          <div className="terms-section">
            <h2>Limitations of Liability</h2>
            <p>
              In no event shall TransferFiles, its directors, employees, partners, agents, suppliers, or affiliates 
              be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul>
              <li>
                Your access to or use of or inability to access or use the Service.
              </li>
              <li>
                Any conduct or content of any third party on the Service.
              </li>
              <li>
                Any content obtained from the Service.
              </li>
              <li>
                Unauthorized access, use, or alteration of your transmissions or content.
              </li>
            </ul>
            <p>
              We do not guarantee that the Service will be uninterrupted, timely, secure, or error-free.
            </p>
          </div>
          
          <div className="terms-section">
            <h2>Disclaimer</h2>
            <p>
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" 
              basis. The Service is provided without warranties of any kind, whether express or implied, including, 
              but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, 
              or course of performance.
            </p>
            <p>
              TransferFiles, its subsidiaries, affiliates, and its licensors do not warrant that:
            </p>
            <ul>
              <li>
                The Service will function uninterrupted, secure, or available at any particular time or location.
              </li>
              <li>
                Any errors or defects will be corrected.
              </li>
              <li>
                The Service is free of viruses or other harmful components.
              </li>
              <li>
                The results of using the Service will meet your requirements.
              </li>
            </ul>
          </div>
          
          <div className="terms-section">
            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the United States, 
              without regard to its conflict of law provisions.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of 
              those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, 
              the remaining provisions of these Terms will remain in effect.
            </p>
          </div>
          
          <div className="terms-section">
            <h2>Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a 
              revision is material we will try to provide at least 30 days' notice prior to any new terms taking 
              effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p>
              By continuing to access or use our Service after those revisions become effective, you agree to be 
              bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
          </div>
          
          <div className="terms-section">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us:
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