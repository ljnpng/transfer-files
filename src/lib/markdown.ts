"use server";

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// 博客文章目录路径
const blogsDirectory = path.join(process.cwd(), 'src/data/blogs');

// 获取所有博客文章的数据
export async function getAllBlogs() {
  // 获取blogs目录下的所有文件名
  const fileNames = fs.readdirSync(blogsDirectory);
  
  // 获取所有博客数据
  const allBlogsData = fileNames
    .filter(fileName => fileName.endsWith('.md')) // 只处理markdown文件
    .map(fileName => {
      // 读取markdown文件
      const fullPath = path.join(blogsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // 使用gray-matter解析文件的前言数据
      const matterResult = matter(fileContents);
      
      // 结合数据与文件名
      return {
        slug: matterResult.data.slug || fileName.replace(/\.md$/, ''),
        title: matterResult.data.title,
        date: matterResult.data.date,
        excerpt: matterResult.data.excerpt,
        author: matterResult.data.author,
      };
    })
    // 按日期排序
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  
  return allBlogsData;
}

// 获取所有博客的slug列表
export async function getAllBlogSlugs() {
  const fileNames = fs.readdirSync(blogsDirectory);
  
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      // 读取markdown文件
      const fullPath = path.join(blogsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // 使用gray-matter解析文件的前言数据
      const matterResult = matter(fileContents);
      
      return {
        params: {
          slug: matterResult.data.slug || fileName.replace(/\.md$/, '')
        }
      };
    });
}

// 根据slug获取博客内容
export async function getBlogData(slug: string) {
  const fileNames = fs.readdirSync(blogsDirectory);
  let fullPath = '';
  
  // 查找匹配的文件
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;
    
    const filePath = path.join(blogsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matterResult = matter(fileContents);
    
    if (matterResult.data.slug === slug || fileName.replace(/\.md$/, '') === slug) {
      fullPath = filePath;
      break;
    }
  }
  
  if (!fullPath) {
    throw new Error(`Blog with slug ${slug} not found`);
  }
  
  // 读取markdown文件
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // 使用gray-matter解析文件的前言数据
  const matterResult = matter(fileContents);
  
  // 将markdown内容转换为HTML
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  
  // 结合数据
  return {
    slug,
    contentHtml,
    title: matterResult.data.title,
    date: matterResult.data.date,
    excerpt: matterResult.data.excerpt,
    author: matterResult.data.author,
  };
} 