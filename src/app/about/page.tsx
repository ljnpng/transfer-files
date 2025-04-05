"use client";

import Link from "next/link";

export default function About() {
  return (
    <main className="app-content">
      <section className="page-content">
        <div className="page-container">
          <h1>About TransferFiles</h1>
          
          <div className="about-intro">
            <p>
              TransferFiles is a modern peer-to-peer file sharing platform designed for simplicity, privacy, and speed. 
              Our mission is to make secure file transfers accessible to everyone without the need for technical expertise.
            </p>
          </div>
          
          <h2>Our Story</h2>
          <div className="about-story">
            <p>
              TransferFiles was born out of frustration with existing file sharing solutions that were either too complex, 
              limited by file size, or required creating accounts and storing files on third-party servers.
            </p>
            <p>
              In 2022, our small team of developers set out to create a solution that would eliminate these pain points 
              while prioritizing user privacy and data security. We leveraged the power of WebRTC technology to enable 
              direct browser-to-browser file transfers without intermediary servers.
            </p>
            <p>
              After months of development and testing, TransferFiles was launched as a simple yet powerful tool that 
              allows anyone to instantly share files of any size with just a few clicks.
            </p>
          </div>
          
          <h2>Our Team</h2>
          <div className="about-team">
            <p>
              We are a small, dedicated team of developers, designers, and security specialists who are passionate about creating 
              tools that respect user privacy while providing exceptional functionality.
            </p>
            <p>
              Our diverse backgrounds in web development, cryptography, and UX design have allowed us to build a product that 
              is both technically robust and intuitively easy to use.
            </p>
          </div>
          
          <h2>Our Values</h2>
          <div className="about-values">
            <div className="value-item">
              <h3>Privacy First</h3>
              <p>
                We believe your data belongs to you. That's why TransferFiles never stores your files on our servers, 
                and all transfers are encrypted end-to-end.
              </p>
            </div>
            
            <div className="value-item">
              <h3>Simplicity</h3>
              <p>
                Complex technology should feel simple to use. We've stripped away all unnecessary steps so you can share 
                files with minimal friction.
              </p>
            </div>
            
            <div className="value-item">
              <h3>Accessibility</h3>
              <p>
                Powerful file sharing should be available to everyone. TransferFiles works across devices and platforms 
                without requiring installations or account creation.
              </p>
            </div>
            
            <div className="value-item">
              <h3>Transparency</h3>
              <p>
                We're open about how our technology works and are committed to clear communication with our users.
              </p>
            </div>
          </div>
          
          <h2>Future Vision</h2>
          <div className="about-vision">
            <p>
              While TransferFiles is already a powerful tool for quick, secure file transfers, we're constantly working 
              on improvements and new features. Our roadmap includes enhanced mobile support, additional encryption options, 
              and expanded language support.
            </p>
            <p>
              We're committed to maintaining TransferFiles as a free service for basic usage, with plans to introduce 
              premium features for businesses and power users in the future.
            </p>
          </div>
          
          <div className="about-contact">
            <h2>Get in Touch</h2>
            <p>
              We'd love to hear your feedback, suggestions, or answer any questions you might have about TransferFiles.
            </p>
            <p>
              Contact us at: <a href="mailto:contact@transferfiles.pro">contact@transferfiles.pro</a>
            </p>
            <p>
              Visit our website: <a href="https://transferfiles.pro" target="_blank" rel="noopener noreferrer">transferfiles.pro</a>
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