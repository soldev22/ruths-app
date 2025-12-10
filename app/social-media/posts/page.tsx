'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Post {
  _id: string;
  campaign: {
    _id: string;
    name: string;
  };
  content: string;
  platforms: string[];
  scheduledDate: string;
  status: string;
  publishedAt?: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
}

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      const url = filter === 'all' 
        ? '/api/posts' 
        : `/api/posts?status=${filter}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Social Media Posts</h1>
        <Link
          href="/social-media/posts/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Post
        </Link>
      </div>

      <div className="mb-6 flex gap-2">
        {['all', 'draft', 'scheduled', 'published', 'failed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/social-media/posts/${post._id}`)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-lg font-semibold mb-1">{post.campaign.name}</h2>
                <div className="flex gap-2">
                  {post.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-2 py-1 bg-gray-100 rounded text-xs capitalize"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                {post.status}
              </span>
            </div>
            
            <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
            
            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-500">
                {post.status === 'published' && post.publishedAt ? (
                  <span>Published: {new Date(post.publishedAt).toLocaleString()}</span>
                ) : (
                  <span>Scheduled: {new Date(post.scheduledDate).toLocaleString()}</span>
                )}
              </div>
              <div className="flex gap-4 text-gray-600">
                <span>❤️ {post.engagement.likes}</span>
                <span>🔄 {post.engagement.shares}</span>
                <span>💬 {post.engagement.comments}</span>
                <span>👁️ {post.engagement.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mb-4">No posts found</p>
          <Link
            href="/social-media/posts/new"
            className="text-blue-600 hover:underline"
          >
            Create your first post
          </Link>
        </div>
      )}
    </div>
  );
}
