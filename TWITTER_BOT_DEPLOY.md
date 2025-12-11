# Twitter Bot Deployment to Vercel

## Setup Instructions

### 1. Add Environment Variables to Vercel

Go to your Vercel project settings → Environment Variables and add:

```
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_SECRET=your_twitter_access_secret_here
OPENAI_API_KEY=your_openai_api_key_here
CRON_SECRET=your-random-secret-here-change-this
```

**IMPORTANT:** Change `CRON_SECRET` to a random string (prevents unauthorized access)

### 2. Install Dependencies

```bash
npm install
```

### 3. Deploy to Vercel

```bash
vercel --prod
```

Or push to GitHub and let Vercel auto-deploy.

### 4. How It Works

- **Cron Schedule:** Runs daily at 9:00 AM UTC (configured in `vercel.json`)
- **Posts:** 3 tweets per run with 2-minute gaps
- **Endpoint:** `/api/cron/post-tweets` (protected by CRON_SECRET)

### 5. Change Schedule

Edit `vercel.json`:

```json
"schedule": "0 9 * * *"  // Daily at 9 AM UTC
"schedule": "0 9,13,17 * * *"  // 3 times daily: 9am, 1pm, 5pm UTC
"schedule": "0 */6 * * *"  // Every 6 hours
```

### 6. Manually Trigger (for testing)

```bash
curl -X GET https://your-app.vercel.app/api/cron/post-tweets \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### 7. Monitor Logs

Go to Vercel Dashboard → Your Project → Functions → View logs

## Files Created

- `/api/cron/post-tweets.js` - Serverless function that posts tweets
- `/vercel.json` - Cron job configuration
- `package.json` - Updated with twitter-api-v2 dependency

## Cost

- Vercel Hobby plan: Free (includes cron jobs)
- OpenAI API: ~£0.50/month
- Twitter API: Free
