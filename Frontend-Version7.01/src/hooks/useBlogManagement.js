// src/hooks/useBlogManagement.js
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import blogPostService from '../services/blogPostService';

export const useBlogManagement = () => {
  const [publishedPosts, setPublishedPosts] = useState({
    content: [],
    totalElements: 0,
  });
  const [pendingPosts, setPendingPosts] = useState({
    content: [],
    totalElements: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('published');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [publishedData, pendingData] = await Promise.all([
        blogPostService.getAllPublishedPosts(0, 20),
        blogPostService.getPendingPosts(0, 20),
      ]);

      // Handle response structure safely
      setPublishedPosts({
        content: publishedData?.content || publishedData || [],
        totalElements: publishedData?.totalElements || 0,
      });
      setPendingPosts({
        content: pendingData?.content || pendingData || [],
        totalElements: pendingData?.totalElements || 0,
      });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Không thể tải danh sách bài viết.');
      // Set empty data on error
      setPublishedPosts({ content: [], totalElements: 0 });
      setPendingPosts({ content: [], totalElements: 0 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
  };

  const getCurrentPosts = () => {
    return activeTab === 'published'
      ? publishedPosts.content || []
      : pendingPosts.content || [];
  };

  return {
    publishedPosts,
    pendingPosts,
    isLoading,
    activeTab,
    setActiveTab,
    handleRefresh,
    getCurrentPosts,
    publishedCount: publishedPosts.totalElements || 0,
    pendingCount: pendingPosts.totalElements || 0,
  };
};
