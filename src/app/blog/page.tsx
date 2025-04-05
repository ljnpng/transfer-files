"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllBlogs } from '@/lib/markdown';

export default function BlogPage() {
  const [allBlogsData, setAllBlogsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const blogs = await getAllBlogs();
        setAllBlogsData(blogs);
      } catch (error) {
        console.error("获取博客数据失败:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>TransferFiles Blog</h1>
        <p>Learn more about file transfers, secure sharing, and cross-device solutions</p>
      </div>
      
      {loading ? (
        <div className="loading-spinner">Loading blogs...</div>
      ) : (
        <div className="blog-list">
          {allBlogsData.map(({ slug, title, date, excerpt }) => (
            <div className="blog-card" key={slug}>
              <Link href={`/blog/${slug}`}>
                <div className="blog-card-content">
                  <h2>{title}</h2>
                  <p className="excerpt">{excerpt}</p>
                  <div className="blog-meta">
                    <span>{new Date(date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                    <span>Read more →</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 