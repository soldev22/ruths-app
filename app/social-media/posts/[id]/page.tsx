'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Post {
  _id: string;
  campaign: {
    _id: string;
    name: string;
  };
  content: string;
  mediaUrls: string[];
  platforms: string[];
  scheduledDate: string;
  status: string;
  publishedAt?: string;
  hashtags: string[];
  mentions: string[];
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
}

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePostStatus = async (status: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchPost();
      }
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setUpdating(false);
    }
  };

  const deletePost = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        window.location.href = '/social-media/posts';
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!post) {
    return <div className="flex justify-center items-center min-h-screen">Post not found</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{post.campaign.name}</h1>
            <div className="flex gap-2">
              {post.platforms.map((platform) => (
                <span
                  key={platform}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            post.status === 'published' ? 'bg-green-100 text-green-800' :
            post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
            post.status === 'failed' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {post.status}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Post Content</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        </div>

        {post.mediaUrls.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Media</h2>
            <div className="grid grid-cols-2 gap-4">
              {post.mediaUrls.map((url, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <img 
                    src={url} 
                    alt={`Media ${index + 1}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {(post.hashtags.length > 0 || post.mentions.length > 0) && (
          <div className="mb-6">
            {post.hashtags.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-semibold mb-2">Hashtags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map((tag, index) => (
                    <span key={index} className="text-blue-600">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {post.mentions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Mentions</h3>
                <div className="flex flex-wrap gap-2">
                  {post.mentions.map((mention, index) => (
                    <span key={index} className="text-blue-600">
                      {mention.startsWith('@') ? mention : `@${mention}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Engagement</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">❤️</div>
              <div className="text-xl font-bold">{post.engagement.likes}</div>
              <div className="text-sm text-gray-600">Likes</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">🔄</div>
              <div className="text-xl font-bold">{post.engagement.shares}</div>
              <div className="text-sm text-gray-600">Shares</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">💬</div>
              <div className="text-xl font-bold">{post.engagement.comments}</div>
              <div className="text-sm text-gray-600">Comments</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">👁️</div>
              <div className="text-xl font-bold">{post.engagement.views}</div>
              <div className="text-sm text-gray-600">Views</div>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Scheduled:</span>{' '}
              {new Date(post.scheduledDate).toLocaleString()}
            </div>
            {post.publishedAt && (
              <div>
                <span className="font-semibold">Published:</span>{' '}
                {new Date(post.publishedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          {post.status === 'draft' && (
            <button
              onClick={() => updatePostStatus('scheduled')}
              disabled={updating}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Schedule Post
            </button>
          )}
          {post.status === 'scheduled' && (
            <>
              <button
                onClick={() => updatePostStatus('published')}
                disabled={updating}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Publish Now
              </button>
              <button
                onClick={() => updatePostStatus('draft')}
                disabled={updating}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                Move to Draft
              </button>
            </>
          )}
          <button
            onClick={deletePost}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Delete Post
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
