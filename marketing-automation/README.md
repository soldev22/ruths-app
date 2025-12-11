# SkillScan Twitter Auto-Posting Bot

Automatically generates and posts tweets using AI.

## Setup Instructions

### 1. Install Dependencies

Open PowerShell in this folder and run:

```powershell
npm install
```

### 2. Add Your API Keys

Open `twitter-bot.js` and replace these placeholders:

```javascript
twitter: {
  appKey: 'YOUR_API_KEY_HERE',           // From developer.twitter.com
  appSecret: 'YOUR_API_SECRET_HERE',
  accessToken: 'YOUR_ACCESS_TOKEN_HERE',
  accessSecret: 'YOUR_ACCESS_TOKEN_SECRET_HERE',
},
openaiKey: 'YOUR_OPENAI_API_KEY_HERE',    // Your existing OpenAI key
```

**Also update the same keys in `test-connection.js`**

### 3. Test Connections

Run the test script to verify everything works:

```powershell
npm run test
```

You should see:
- ✅ Twitter connected! Logged in as: @YourUsername
- ✅ OpenAI connected!

### 4. Post Your First Tweets

Run the bot manually:

```powershell
npm run post
```

This will generate and post 3 tweets (configurable).

### 5. Set Up Automation (Optional)

#### Windows Task Scheduler:

1. Open Task Scheduler (search in Start menu)
2. Click "Create Basic Task"
3. Name: "SkillScan Twitter Bot"
4. Trigger: Daily at 9:00 AM (or whenever you want)
5. Action: "Start a program"
6. Program: `node`
7. Arguments: `"C:\Users\mike\Desktop\RuthsApp\marketing-automation\twitter-bot.js"`
8. Start in: `C:\Users\mike\Desktop\RuthsApp\marketing-automation`

Now it runs automatically every day!

## Configuration

Edit `twitter-bot.js` to customize:

### Post Frequency
```javascript
postsPerDay: 3,  // Change to 1, 5, 10, etc.
```

### Content Mix
```javascript
contentMix: {
  educational: 50,    // 50% educational tips
  promotional: 20,    // 20% product promotion
  engagement: 20,     // 20% questions/engagement
  newsAndStats: 10,   // 10% research/stats
}
```

## Files

- `twitter-bot.js` - Main bot script
- `test-connection.js` - Test your API connections
- `tweet-history.json` - Log of all posted tweets (auto-created)
- `package.json` - Node.js dependencies

## Troubleshooting

### "Error: Could not authenticate you"
- Check your Twitter API keys are correct
- Make sure app permissions are set to "Read and Write"

### "Error: Insufficient quota"
- OpenAI API key needs billing enabled
- Add payment method at platform.openai.com

### "Tweet is a duplicate"
- Twitter doesn't allow identical tweets
- Bot automatically generates unique content each time
- Check `tweet-history.json` to see what was posted

## Cost Estimate

- **Twitter API:** Free (basic tier)
- **OpenAI API:** ~$0.02 per tweet (~$0.60/month for 3 tweets/day)
- **Total:** Less than £1/month

## Support

If you need to modify content types or add features, edit the `CONTENT_TYPES` object in `twitter-bot.js`.
