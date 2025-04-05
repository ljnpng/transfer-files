"use client";

import { useState } from "react";
import Link from "next/link";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [formStatus, setFormStatus] = useState<null | 'success' | 'error'>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    // For now, we'll just simulate a successful submission
    console.log("Form submitted:", formData);
    
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 800);
  };
  
  return (
    <main className="app-content">
      <section className="page-content">
        <div className="page-container">
          <h1>Contact Us</h1>
          
          <div className="contact-intro">
            <p>
              We're here to help with any questions, feedback, or support issues you might have. 
              Feel free to reach out to us using the form below or directly via email.
            </p>
          </div>
          
          <div className="contact-methods">
            <div className="contact-info">
              <h2>Contact Information</h2>
              <div className="contact-details">
                <p>
                  <strong>Email:</strong> <a href="mailto:contact@transferfiles.pro">contact@transferfiles.pro</a>
                </p>
                <p>
                  <strong>Website:</strong> <a href="https://transferfiles.pro" target="_blank" rel="noopener noreferrer">transferfiles.pro</a>
                </p>
                <p>
                  <strong>Response Time:</strong> We typically respond to inquiries within 24-48 hours during business days.
                </p>
              </div>
              
              <div className="contact-support">
                <h3>Common Support Topics</h3>
                <ul>
                  <li>
                    <Link href="/help">Troubleshooting connection issues</Link>
                  </li>
                  <li>
                    <Link href="/help">Browser compatibility questions</Link>
                  </li>
                  <li>
                    <Link href="/help">File transfer limitations</Link>
                  </li>
                  <li>
                    <Link href="/security">Security concerns</Link>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="contact-form-container">
              <h2>Send us a Message</h2>
              
              {formStatus === 'success' && (
                <div className="form-message success">
                  <p>Your message has been sent successfully! We'll get back to you soon.</p>
                </div>
              )}
              
              {formStatus === 'error' && (
                <div className="form-message error">
                  <p>There was an error sending your message. Please try again later.</p>
                </div>
              )}
              
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="business">Business Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={5} 
                    value={formData.message} 
                    onChange={handleChange} 
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn submit-btn">Send Message</button>
              </form>
            </div>
          </div>
          
          <div className="faq-preview">
            <h2>Frequently Asked Questions</h2>
            <p>
              Before contacting us, you might find an answer to your question in our FAQ section.
            </p>
            <Link href="/help" className="btn-secondary">View Help Center</Link>
          </div>
          
          <div className="page-links">
            <Link href="/" className="btn-back">Return to Home</Link>
          </div>
        </div>
      </section>
    </main>
  );
} 