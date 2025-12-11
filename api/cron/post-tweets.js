/**
 * Vercel Cron Job - Auto-posts tweets from scheduled social media posts
 * This runs automatically on Vercel's schedule and publishes posts from the social media system
 * 
 * Priority:
 * 1. Check for scheduled posts in social media system
 * 2. Post those if found
 * 3. Fall back to AI-generated content if no scheduled posts
 */

const { TwitterApi } = require('twitter-api-v2');
const OpenAI = require('openai');

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

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
- Professional but friendly
- Evidence-based
- Inclusive and supportive
- UK-focused (mention £, UK schools, etc.)
- 200-280 characters (leave room for hashtags)
- If promotional, keep it subtle and value-focused

Include 2-3 relevant hashtags from: #Dyslexia #Dyscalculia #SEND #Education #TeacherTwitter #ParentingUK #LearningDifficulties #InclusiveEducation #Neurodiversity`
      },
      {
        role: 'user',
        content: randomPrompt
      }
    ],
    max_tokens: 150,
    temperature: 0.8,
  });

  return response.choices[0].message.content.trim();
}

async function postTweet(text) {
  return await twitterClient.v2.tweet(text);
}

async function getScheduledPosts(mongoose) {
  const now = new Date();
  const socialPostSchema = new mongoose.Schema({
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    content: String,
    platforms: [String],
    scheduledDate: Date,
    status: String,
    publishedAt: Date,
  }, { timestamps: true });
  
  const SocialPost = mongoose.models.SocialPost || mongoose.model('SocialPost', socialPostSchema);
  
  // Find posts that are:
  // 1. Status = 'scheduled'
  // 2. Include 'twitter' platform
  // 3. Scheduled time has passed
  const posts = await SocialPost.find({
    status: 'scheduled',
    platforms: 'twitter',
    scheduledDate: { $lte: now }
  })
  .sort({ scheduledDate: 1 })
  .limit(CONFIG.postsPerRun)
  .populate('campaign');
  
  return { posts, SocialPost };
}

module.exports = async function handler(req, res) {
  // Security: Check for cron secret
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const mongoose = require('mongoose');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Get marketing settings
    const marketingSettingsSchema = new mongoose.Schema({
      twitterBotEnabled: Boolean,
      lastRun: Date,
      totalTweetsPosted: Number,
      lastError: String,
    });
    const MarketingSettings = mongoose.models.MarketingSettings || mongoose.model('MarketingSettings', marketingSettingsSchema);
    
    let settings = await MarketingSettings.findOne();
    if (!settings) {
      settings = await MarketingSettings.create({
        twitterBotEnabled: false,
        totalTweetsPosted: 0,
      });
    }

    // Check if bot is enabled
    if (!settings.twitterBotEnabled) {
      return res.status(200).json({
        success: true,
        skipped: true,
        message: 'Twitter bot is disabled',
      });
    }

    console.log('🔍 Checking for scheduled posts...');
    const { posts: scheduledPosts, SocialPost } = await getScheduledPosts(mongoose);
    
    const results = [];

    if (scheduledPosts.length > 0) {
      // POST SCHEDULED POSTS FROM SOCIAL MEDIA SYSTEM
      console.log(`📅 Found ${scheduledPosts.length} scheduled post(s)`);
      
      for (const post of scheduledPosts) {
        try {
          console.log(`📤 Posting: "${post.content.substring(0, 50)}..."`);
          
          const tweet = await postTweet(post.content);
          console.log(`✅ Posted tweet ID: ${tweet.data.id}`);
          
          // Update post status
          post.status = 'published';
          post.publishedAt = new Date();
          await post.save();
          
          results.push({
            id: tweet.data.id,
            type: 'scheduled',
            source: 'social-media-system',
            campaignName: post.campaign?.name || 'No Campaign',
            text: post.content,
          });
          
          // Wait 2 minutes between tweets
          const postIndex = scheduledPosts.indexOf(post);
          if (postIndex < scheduledPosts.length - 1) {
            console.log('⏳ Waiting 2 minutes...');
            await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000));
          }
        } catch (error) {
          console.error(`❌ Failed to post scheduled content:`, error);
          post.status = 'failed';
          await post.save();
        }
      }
    } else {
      // FALLBACK: Generate AI content if no scheduled posts
      console.log('🤖 No scheduled posts found. Generating AI content...');
      
      for (let i = 0; i < CONFIG.postsPerRun; i++) {
        const contentType = selectContentType();
        console.log(`📝 Generating ${contentType} tweet ${i + 1}/${CONFIG.postsPerRun}`);
        
        const tweetText = await generateTweet(contentType);
        console.log(`📄 Generated: ${tweetText}`);
        
        const tweet = await postTweet(tweetText);
        console.log(`✅ Posted tweet ID: ${tweet.data.id}`);
        
        results.push({
          id: tweet.data.id,
          type: contentType,
          source: 'ai-generated',
          text: tweetText,
        });
        
        // Wait 2 minutes between tweets
        if (i < CONFIG.postsPerRun - 1) {
          console.log('⏳ Waiting 2 minutes...');
          await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000));
        }
      }
    }

    // Update settings with success
    settings.lastRun = new Date();
    settings.totalTweetsPosted = (settings.totalTweetsPosted || 0) + results.length;
    settings.lastError = null;
    await settings.save();

    console.log(`✨ Successfully posted ${results.length} tweet(s)`);

    return res.status(200).json({
      success: true,
      posted: results.length,
      tweets: results,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Error:', error);
    
    // Update settings with error
    try {
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
    } catch (dbError) {
      console.error('Failed to update error in database:', dbError);
    }
    
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
