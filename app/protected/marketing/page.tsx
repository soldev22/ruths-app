'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketingPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to consolidated social media dashboard
    router.push('/social-media');
  }, [router]);
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="text-xl mb-2">Redirecting to Social Media Hub...</div>
        <div className="text-sm text-gray-600">Marketing controls have moved to /social-media</div>
      </div>
    </div>
  );
}

function OldMarketingPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await fetch('/api/marketing/settings', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      } else {
        console.error('Failed to load settings:', res.status);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleTwitterBot() {
    setSaving(true);
    try {
      const res = await fetch('/api/marketing/settings', {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          twitterBotEnabled: !settings.twitterBotEnabled,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        alert(`Twitter bot ${data.settings.twitterBotEnabled ? 'enabled' : 'disabled'} successfully!`);
      } else {
        alert('Failed to update settings');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto py-12 px-4">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Marketing Automation</h1>

        {/* Twitter Bot Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Twitter Auto-Posting</h2>
                <p className="text-sm text-gray-600">@catignani2025</p>
              </div>
            </div>
            
            <button
              onClick={toggleTwitterBot}
              disabled={saving}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                settings?.twitterBotEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  settings?.twitterBotEnabled ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {settings?.totalTweetsPosted || 0}
                </div>
                <div className="text-sm text-gray-600">Total Tweets</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">3/day</div>
                <div className="text-sm text-gray-600">Posting Frequency</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">Mon-Fri</div>
                <div className="text-sm text-gray-600">Active Days</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <div className="text-sm font-semibold text-gray-700 mb-2">Posting Times (UTC):</div>
              <div className="flex gap-2 justify-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">9:00 AM</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">12:00 PM</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">4:00 PM</span>
              </div>
            </div>

            {settings?.lastRun && (
              <div className="mt-4 text-sm text-gray-600">
                <strong>Last Run:</strong> {new Date(settings.lastRun).toLocaleString()}
              </div>
            )}

            {settings?.lastError && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                <strong>Last Error:</strong> {settings.lastError}
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ Posts 3 AI-generated tweets Monday-Friday at 9am, 12pm, 4pm UTC</li>
              <li>✅ Mix: 50% educational, 20% promotional, 20% engagement, 10% news</li>
              <li>✅ Uses GPT-4 to create contextually relevant content</li>
              <li>✅ Automatically handles hashtags and mentions skillscan.co.uk</li>
              <li>✅ Toggle on/off anytime - takes effect immediately</li>
            </ul>
          </div>
        </div>

        {/* Status Indicator */}
        <div className={`p-4 rounded-lg ${settings?.twitterBotEnabled ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${settings?.twitterBotEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="font-medium">
              {settings?.twitterBotEnabled 
                ? '✓ Twitter bot is active - posts Monday-Friday at 9am, 12pm, 4pm UTC' 
                : '○ Twitter bot is paused - no tweets will be posted'}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
