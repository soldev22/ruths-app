'use client';

import { useEffect, useState } from 'react';

interface Campaign {
  _id: string;
  name: string;
}

interface Analytics {
  date: string;
  platform: string;
  metrics: {
    impressions: number;
    reach: number;
    engagement: number;
    clicks: number;
    conversions: number;
    spend: number;
  };
}

export default function AnalyticsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [totals, setTotals] = useState<any>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      fetchAnalytics();
    }
  }, [selectedCampaign, dateRange]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      let url = `/api/analytics?campaignId=${selectedCampaign}`;
      if (dateRange.start) url += `&startDate=${dateRange.start}`;
      if (dateRange.end) url += `&endDate=${dateRange.end}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
        setTotals(data.totals);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedByPlatform = analytics.reduce((acc: any, item) => {
    if (!acc[item.platform]) {
      acc[item.platform] = [];
    }
    acc[item.platform].push(item);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Campaign Analytics</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Campaign</label>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a campaign</option>
              {campaigns.map((campaign) => (
                <option key={campaign._id} value={campaign._id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="text-xl">Loading analytics...</div>
        </div>
      )}

      {!loading && selectedCampaign && totals && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">Impressions</div>
              <div className="text-2xl font-bold">{totals.impressions.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">Reach</div>
              <div className="text-2xl font-bold">{totals.reach.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">Engagement</div>
              <div className="text-2xl font-bold">{totals.engagement.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">Clicks</div>
              <div className="text-2xl font-bold">{totals.clicks.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">Conversions</div>
              <div className="text-2xl font-bold">{totals.conversions.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">Spend</div>
              <div className="text-2xl font-bold">${totals.spend.toLocaleString()}</div>
            </div>
          </div>

          {Object.keys(groupedByPlatform).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedByPlatform).map(([platform, items]: [string, any]) => (
                <div key={platform} className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 capitalize">{platform}</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Date</th>
                          <th className="text-right p-2">Impressions</th>
                          <th className="text-right p-2">Reach</th>
                          <th className="text-right p-2">Engagement</th>
                          <th className="text-right p-2">Clicks</th>
                          <th className="text-right p-2">Conversions</th>
                          <th className="text-right p-2">Spend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item: Analytics, index: number) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
                            <td className="text-right p-2">{item.metrics.impressions.toLocaleString()}</td>
                            <td className="text-right p-2">{item.metrics.reach.toLocaleString()}</td>
                            <td className="text-right p-2">{item.metrics.engagement.toLocaleString()}</td>
                            <td className="text-right p-2">{item.metrics.clicks.toLocaleString()}</td>
                            <td className="text-right p-2">{item.metrics.conversions.toLocaleString()}</td>
                            <td className="text-right p-2">${item.metrics.spend.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-xl text-gray-500">No analytics data available for this campaign</p>
              <p className="text-sm text-gray-400 mt-2">Analytics data can be added via the API</p>
            </div>
          )}
        </>
      )}

      {!selectedCampaign && !loading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-xl text-gray-500">Select a campaign to view analytics</p>
        </div>
      )}
    </div>
  );
}
