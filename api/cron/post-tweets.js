/**
 * Vercel Cron Job - Auto-posts tweets daily
 * This runs automatically on Vercel's schedule
 */

const { TwitterApi } = require('twitter-api-v2');
const OpenAI = require('openai');

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
  postsPerRun: 1,
  contentMix: {
    educational: 50,
    promotional: 20,
    engagement: 20,
    newsAndStats: 10,
  }
};

const CONTENT_TYPES = {
  educational: [
    "Share a helpful tip about identifying dyslexia in children aged 7-12",
    "Explain one common misconception about dyscalculia that parents should know",
    "Describe an early warning sign of learning difficulties in primary school",
    "Give practical advice for supporting a child with dyslexia at home",
    "Explain why early screening for learning difficulties matters",
  ],
  
  promotional: [
    "Highlight the benefits of SkillScan's £5 dyslexia screening for UK parents",
    "Explain how SkillScan helps teachers identify learning difficulties quickly",
    "Describe what makes SkillScan different from traditional educational assessments",
    "Share a feature of SkillScan that saves teachers time",
    "Promote SkillScan's professional reports for parents and schools",
  ],
  
  engagement: [
    "Ask teachers what challenges they face when identifying learning difficulties",
    "Ask parents how they first noticed their child might have dyslexia",
    "Create an engaging question about supporting children with learning differences",
    "Ask educators what resources they wish they had for screening",
    "Start a discussion about reducing stigma around learning difficulties",
  ],
  
  newsAndStats: [
    "Share a recent statistic about dyslexia prevalence in UK schools",
    "Discuss the impact of early intervention on learning outcomes",
    "Share information about government support for children with learning difficulties",
    "Explain current research on effective dyslexia interventions",
    "Discuss how technology is improving learning difficulty screening",
  ]
};

// ==========================================
// INITIALIZE APIs FROM ENVIRONMENT
// ==========================================

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function selectContentType() {
  const rand = Math.random() * 100;
  let cumulative = 0;
  
  for (const [type, percentage] of Object.entries(CONFIG.contentMix)) {
    cumulative += percentage;
    if (rand <= cumulative) {
      return type;
    }
  }
  
  return 'educational';
}

async function generateTweet(contentType) {
  const prompts = CONTENT_TYPES[contentType];
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a social media manager for SkillScan, a UK-based dyslexia and dyscalculia screening service. 
        
Your tweets should be:
- Professional yet warm and approachable
- Focused on UK audience (use British spelling)
- Under 280 characters
- Include relevant hashtags (2-3 max)
- Engaging and valuable
- If promotional, keep it subtle and value-focused
- Use emojis sparingly (1-2 max)

Brand voice: Helpful, expert, supportive, professional.
Website: skillscan.co.uk (mention only when relevant)
Price: £5 per assessment for individuals, bundled for schools.`
      },
      {
        role: 'user',
        content: randomPrompt
      }
    ],
    max_tokens: 100,
    temperature: 0.8,
  });
  
  return response.choices[0].message.content.trim();
}

async function postTweet(text) {
  const tweet = await twitterClient.v2.tweet(text);
  return tweet;
}

// ==========================================
// VERCEL SERVERLESS FUNCTION HANDLER
// ==========================================

export default async function handler(req, res) {
  // Verify cron secret to prevent unauthorized access
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Connect to MongoDB to check settings
  const mongoose = require('mongoose');
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Load settings model
  const marketingSettingsSchema = new mongoose.Schema({
    twitterBotEnabled: Boolean,
    lastRun: Date,
    totalTweetsPosted: Number,
    lastError: String,
  });
  const MarketingSettings = mongoose.models.MarketingSettings || mongoose.model('MarketingSettings', marketingSettingsSchema);
  
  // Check if bot is enabled
  let settings = await MarketingSettings.findOne();
  if (!settings) {
    settings = await MarketingSettings.create({
      twitterBotEnabled: false,
      totalTweetsPosted: 0,
    });
  }
  
  if (!settings.twitterBotEnabled) {
    console.log('⏸️  Twitter bot is disabled. Skipping...');
    return res.status(200).json({
      success: true,
      skipped: true,
      message: 'Twitter bot is disabled in settings',
    });
  }

  console.log('🤖 Starting Twitter Bot...');
  const results = [];

  try {
    for (let i = 0; i < CONFIG.postsPerRun; i++) {
      const contentType = selectContentType();
      console.log(`Generating ${contentType} tweet ${i + 1}/${CONFIG.postsPerRun}`);
      
      const tweetText = await generateTweet(contentType);
      console.log(`Generated: ${tweetText}`);
      
      const tweet = await postTweet(tweetText);
      console.log(`Posted tweet ID: ${tweet.data.id}`);
      
      results.push({
        id: tweet.data.id,
        type: contentType,
        text: tweetText,
      });
      
      // Wait 2 minutes between tweets
      if (i < CONFIG.postsPerRun - 1) {
        await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000));
      }
    }

    // Update settings with success
    settings.lastRun = new Date();
    settings.totalTweetsPosted = (settings.totalTweetsPosted || 0) + results.length;
    settings.lastError = null;
    await settings.save();

    return res.status(200).json({
      success: true,
      posted: results.length,
      tweets: results,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error:', error);
    
    // Update settings with error
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGODB_URI);
    const marketingSettingsSchema = new mongoose.Schema({
      twitterBotEnabled: Boolean,
      lastRun: Date,
      totalTweetsPosted: Number,
      lastError: String,
    });
    const MarketingSettings = mongoose.models.MarketingSettings || mongoose.model('MarketingSettings', marketingSettingsSchema);
    const settings = await MarketingSettings.findOne();
    if (settings) {
      settings.lastError = error.message;
      settings.lastRun = new Date();
      await settings.save();
    }
    
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
