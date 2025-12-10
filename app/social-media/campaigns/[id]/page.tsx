'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Campaign {
  _id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  targetAudience: string;
  goals: string[];
  platforms: string[];
  budget?: number;
}

interface Post {
  _id: string;
  content: string;
  platforms: string[];
  scheduledDate: string;
  status: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'analytics'>('overview');

  useEffect(() => {
    if (params.id) {
      fetchCampaign();
      fetchPosts();
    }
  }, [params.id]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data.campaign);
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts?campaignId=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const updateCampaignStatus = async (status: string) => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchCampaign();
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!campaign) {
    return <div className="flex justify-center items-center min-h-screen">Campaign not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline mb-4"
        >
          ← Back to Campaigns
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{campaign.name}</h1>
            <p className="text-gray-600">{campaign.description}</p>
          </div>
          <div className="flex gap-2">
            {campaign.status === 'draft' && (
              <button
                onClick={() => updateCampaignStatus('active')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Launch Campaign
              </button>
            )}
            {campaign.status === 'active' && (
              <button
                onClick={() => updateCampaignStatus('paused')}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
              >
                Pause Campaign
              </button>
            )}
            {campaign.status === 'paused' && (
              <button
                onClick={() => updateCampaignStatus('active')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Resume Campaign
              </button>
            )}
            <Link
              href={`/social-media/posts/new?campaignId=${campaign._id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Post
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b">
        <div className="flex gap-4">
          {['overview', 'posts', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Details</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Status:</span>{' '}
                <span className="capitalize">{campaign.status}</span>
              </div>
              <div>
                <span className="font-medium">Start Date:</span>{' '}
                {new Date(campaign.startDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">End Date:</span>{' '}
                {new Date(campaign.endDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Target Audience:</span>{' '}
                {campaign.targetAudience}
              </div>
              {campaign.budget && (
                <div>
                  <span className="font-medium">Budget:</span> ${campaign.budget.toLocaleString()}
                </div>
              )}
              <div>
                <span className="font-medium">Platforms:</span>{' '}
                {campaign.platforms.join(', ') || 'None selected'}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Goals</h2>
            {campaign.goals && campaign.goals.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {campaign.goals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No goals defined</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div>
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/social-media/posts/${post._id}`)}
              >
                <div className="flex justify-between items-start mb-3">
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
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    post.status === 'published' ? 'bg-green-100 text-green-800' :
                    post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {post.status}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    Scheduled: {new Date(post.scheduledDate).toLocaleString()}
                  </div>
                  <div className="flex gap-4">
                    <span>❤️ {post.engagement.likes}</span>
                    <span>🔄 {post.engagement.shares}</span>
                    <span>💬 {post.engagement.comments}</span>
                    <span>👁️ {post.engagement.views}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {posts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-xl text-gray-500 mb-4">No posts yet</p>
                <Link
                  href={`/social-media/posts/new?campaignId=${campaign._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Create your first post
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Analytics Coming Soon</h2>
          <p className="text-gray-600">
            Analytics integration will show performance metrics, engagement rates, and ROI tracking.
          </p>
        </div>
      )}
    </div>
  );
}
