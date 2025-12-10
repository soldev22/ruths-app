'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Campaign {
  _id: string;
  name: string;
}

function NewPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [formData, setFormData] = useState({
    campaign: searchParams.get('campaignId') || '',
    content: '',
    mediaUrls: '',
    platforms: [] as string[],
    scheduledDate: '',
    scheduledTime: '',
    hashtags: '',
    mentions: '',
    status: 'draft',
  });

  const platformOptions = [
    { value: 'facebook', label: 'Facebook', charLimit: 63206 },
    { value: 'twitter', label: 'Twitter/X', charLimit: 280 },
    { value: 'instagram', label: 'Instagram', charLimit: 2200 },
    { value: 'linkedin', label: 'LinkedIn', charLimit: 3000 },
    { value: 'tiktok', label: 'TikTok', charLimit: 2200 },
  ];

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns?status=active');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign: formData.campaign,
          content: formData.content,
          mediaUrls: formData.mediaUrls.split('\n').filter(url => url.trim()),
          platforms: formData.platforms,
          scheduledDate: scheduledDateTime.toISOString(),
          status: formData.status,
          hashtags: formData.hashtags.split(' ').filter(tag => tag.trim()),
          mentions: formData.mentions.split(' ').filter(mention => mention.trim()),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/social-media/posts/${data.post._id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const getCharacterCount = () => {
    if (formData.platforms.length === 0) return null;
    
    const limits = formData.platforms.map(p => {
      const platform = platformOptions.find(opt => opt.value === p);
      return platform ? platform.charLimit : Infinity;
    });
    
    const minLimit = Math.min(...limits);
    const count = formData.content.length;
    
    return { count, limit: minLimit, exceeded: count > minLimit };
  };

  const charInfo = getCharacterCount();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Campaign *</label>
          <select
            required
            value={formData.campaign}
            onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign._id} value={campaign._id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Platforms *</label>
          <div className="flex flex-wrap gap-2">
            {platformOptions.map((platform) => (
              <button
                key={platform.value}
                type="button"
                onClick={() => handlePlatformToggle(platform.value)}
                className={`px-4 py-2 rounded-lg border ${
                  formData.platforms.includes(platform.value)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {platform.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Post Content *</label>
            {charInfo && (
              <span className={`text-sm ${charInfo.exceeded ? 'text-red-600' : 'text-gray-500'}`}>
                {charInfo.count} / {charInfo.limit} characters
              </span>
            )}
          </div>
          <textarea
            required
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write your post content here..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Media URLs (one per line)</label>
          <textarea
            rows={3}
            value={formData.mediaUrls}
            onChange={(e) => setFormData({ ...formData, mediaUrls: e.target.value })}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Scheduled Date *</label>
            <input
              type="date"
              required
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Scheduled Time *</label>
            <input
              type="time"
              required
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hashtags (space-separated)</label>
          <input
            type="text"
            value={formData.hashtags}
            onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
            placeholder="#dyslexia #education #learning"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mentions (space-separated)</label>
          <input
            type="text"
            value={formData.mentions}
            onChange={(e) => setFormData({ ...formData, mentions: e.target.value })}
            placeholder="@username1 @username2"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || (charInfo?.exceeded ?? false)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <NewPostForm />
    </Suspense>
  );
}
