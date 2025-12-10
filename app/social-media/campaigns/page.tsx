'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Campaign {
  _id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  platforms: string[];
  budget?: number;
}

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchCampaigns();
  }, [filter]);

  const fetchCampaigns = async () => {
    try {
      const url = filter === 'all' 
        ? '/api/campaigns' 
        : `/api/campaigns?status=${filter}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Social Media Campaigns</h1>
        <Link
          href="/social-media/campaigns/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Campaign
        </Link>
      </div>

      <div className="mb-6 flex gap-2">
        {['all', 'draft', 'active', 'paused', 'completed'].map((status) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/social-media/campaigns/${campaign._id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{campaign.name}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                {campaign.status}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
            
            <div className="space-y-2 text-sm text-gray-500">
              <div>
                <strong>Start:</strong> {new Date(campaign.startDate).toLocaleDateString()}
              </div>
              <div>
                <strong>End:</strong> {new Date(campaign.endDate).toLocaleDateString()}
              </div>
              {campaign.platforms && campaign.platforms.length > 0 && (
                <div>
                  <strong>Platforms:</strong> {campaign.platforms.join(', ')}
                </div>
              )}
              {campaign.budget && (
                <div>
                  <strong>Budget:</strong> ${campaign.budget.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mb-4">No campaigns found</p>
          <Link
            href="/social-media/campaigns/new"
            className="text-blue-600 hover:underline"
          >
            Create your first campaign
          </Link>
        </div>
      )}
    </div>
  );
}
