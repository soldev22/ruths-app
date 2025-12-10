'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalPosts: number;
  scheduledPosts: number;
  publishedPosts: number;
  totalEngagement: number;
}

interface Campaign {
  _id: string;
  name: string;
  status: string;
  platforms: string[];
}

interface Post {
  _id: string;
  campaign: { name: string };
  scheduledDate: string;
  status: string;
  platforms: string[];
}

export default function SocialMediaDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalPosts: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    totalEngagement: 0,
  });
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);
  const [upcomingPosts, setUpcomingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [campaignsRes, postsRes] = await Promise.all([
        fetch('/api/campaigns'),
        fetch('/api/posts'),
      ]);

      if (campaignsRes.ok && postsRes.ok) {
        const campaignsData = await campaignsRes.json();
        const postsData = await postsRes.json();

        const campaigns = campaignsData.campaigns;
        const posts = postsData.posts;

        const totalEngagement = posts.reduce((sum: number, post: any) => {
          return sum + post.engagement.likes + post.engagement.shares + 
                 post.engagement.comments + post.engagement.views;
        }, 0);

        setStats({
          totalCampaigns: campaigns.length,
          activeCampaigns: campaigns.filter((c: Campaign) => c.status === 'active').length,
          totalPosts: posts.length,
          scheduledPosts: posts.filter((p: Post) => p.status === 'scheduled').length,
          publishedPosts: posts.filter((p: Post) => p.status === 'published').length,
          totalEngagement,
        });

        setRecentCampaigns(campaigns.slice(0, 5));
        
        const upcoming = posts
          .filter((p: Post) => p.status === 'scheduled')
          .sort((a: Post, b: Post) => 
            new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
          )
          .slice(0, 5);
        setUpcomingPosts(upcoming);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Social Media Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Campaigns</p>
              <p className="text-3xl font-bold">{stats.totalCampaigns}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {stats.activeCampaigns} active
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Posts</p>
              <p className="text-3xl font-bold">{stats.totalPosts}</p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {stats.scheduledPosts} scheduled, {stats.publishedPosts} published
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Engagement</p>
              <p className="text-3xl font-bold">{stats.totalEngagement.toLocaleString()}</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            All interactions combined
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Campaigns</h2>
            <Link href="/social-media/campaigns" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          {recentCampaigns.length > 0 ? (
            <div className="space-y-3">
              {recentCampaigns.map((campaign) => (
                <Link
                  key={campaign._id}
                  href={`/social-media/campaigns/${campaign._id}`}
                  className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{campaign.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{campaign.status}</p>
                    </div>
                    <div className="flex gap-1">
                      {campaign.platforms.slice(0, 3).map((platform) => (
                        <span
                          key={platform}
                          className="text-xs px-2 py-1 bg-gray-100 rounded capitalize"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No campaigns yet</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Posts</h2>
            <Link href="/social-media/posts" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          {upcomingPosts.length > 0 ? (
            <div className="space-y-3">
              {upcomingPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/social-media/posts/${post._id}`}
                  className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">{post.campaign.name}</h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {post.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(post.scheduledDate).toLocaleString()}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {post.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="text-xs px-2 py-1 bg-gray-100 rounded capitalize"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No scheduled posts</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/social-media/campaigns/new"
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <div className="text-4xl mb-2">➕</div>
            <div className="font-medium">Create Campaign</div>
          </Link>
          <Link
            href="/social-media/posts/new"
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <div className="text-4xl mb-2">✍️</div>
            <div className="font-medium">Create Post</div>
          </Link>
          <Link
            href="/social-media/analytics"
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <div className="text-4xl mb-2">📊</div>
            <div className="font-medium">View Analytics</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
