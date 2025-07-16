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
  const [draftPosts, setDraftPosts] = useState({
    content: [],
    totalElements: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch published posts (always available)
      const publishedData = await blogPostService.getAllPublishedPosts(0, 100);
      setPublishedPosts({
        content: publishedData?.content || publishedData || [],
        totalElements: publishedData?.totalElements || 0,
      });

      // Try to fetch pending posts (might not be available for all users)
      try {
        const pendingData = await blogPostService.getPendingPosts(0, 100);
        setPendingPosts({
          content: pendingData?.content || pendingData || [],
          totalElements: pendingData?.totalElements || 0,
        });
      } catch (pendingError) {
        console.warn('Could not fetch pending posts:', pendingError);
        setPendingPosts({ content: [], totalElements: 0 });
      }

      // Try to fetch draft posts (might not be available endpoint)
      try {
        const draftData = await blogPostService.getDraftPosts(0, 100);
        setDraftPosts({
          content: draftData?.content || draftData || [],
          totalElements: draftData?.totalElements || 0,
        });
      } catch (draftError) {
        console.warn('Could not fetch draft posts (endpoint might not exist):', draftError);
        setDraftPosts({ content: [], totalElements: 0 });
      }

    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Không thể tải danh sách bài viết.');
      // Set empty data on error
      setPublishedPosts({ content: [], totalElements: 0 });
      setPendingPosts({ content: [], totalElements: 0 });
      setDraftPosts({ content: [], totalElements: 0 });
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

  return {
    publishedPosts,
    pendingPosts,
    draftPosts,
    isLoading,
    handleRefresh,
    publishedCount: publishedPosts.totalElements || 0,
    pendingCount: pendingPosts.totalElements || 0,
    draftCount: draftPosts.totalElements || 0,
  };
};
