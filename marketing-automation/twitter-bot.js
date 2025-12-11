/**
 * SkillScan Twitter Auto-Posting Bot
 * 
 * This script automatically generates and posts tweets using OpenAI
 * Run it manually or set up a scheduled task to run daily
 */

const { TwitterApi } = require('twitter-api-v2');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

// ==========================================
// CONFIGURATION - ADD YOUR KEYS HERE
// ==========================================

const CONFIG = {
  // Twitter API Keys (from developer.twitter.com or .env file)
   twitter: {
    appKey: process.env.TWITTER_API_KEY || 'YOUR_TWITTER_API_KEY_HERE',
    appSecret: process.env.TWITTER_API_SECRET || 'YOUR_TWITTER_API_SECRET_HERE',
    accessToken: process.env.TWITTER_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN_HERE',
    accessSecret: process.env.TWITTER_ACCESS_SECRET || 'YOUR_ACCESS_SECRET_HERE',
  },
  
  // OpenAI API Key (from .env file)
  openaiKey: process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE',
  
  // Posting schedule
  postsPerDay: 3, // How many tweets per day
  
  // Content mix (must add up to 100)
  contentMix: {
    educational: 50,    // Educational tips about dyslexia/dyscalculia
    promotional: 20,    // Product features, pricing, CTAs
    engagement: 20,     // Questions, polls, community building
    newsAndStats: 10,   // Research, statistics, news
  }
};

// ==========================================
// CONTENT TEMPLATES
// ==========================================

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
// INITIALIZE APIs
// ==========================================

const twitterClient = new TwitterApi({
  appKey: CONFIG.twitter.appKey,
  appSecret: CONFIG.twitter.appSecret,
  accessToken: CONFIG.twitter.accessToken,
  accessSecret: CONFIG.twitter.accessSecret,
});

const openai = new OpenAI({
  apiKey: CONFIG.openaiKey,
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Select content type based on configured mix
 */
function selectContentType() {
  const rand = Math.random() * 100;
  let cumulative = 0;
  
  for (const [type, percentage] of Object.entries(CONFIG.contentMix)) {
    cumulative += percentage;
    if (rand <= cumulative) {
      return type;
    }
  }
  
  return 'educational'; // fallback
}

/**
 * Generate a tweet using OpenAI
 */
async function generateTweet(contentType) {
  const prompts = CONTENT_TYPES[contentType];
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  
  console.log(`\n📝 Generating ${contentType} tweet...`);
  console.log(`Prompt: ${randomPrompt}`);
  
  try {
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
    
    const tweet = response.choices[0].message.content.trim();
    console.log(`✅ Generated tweet: "${tweet}"`);
    return tweet;
    
  } catch (error) {
    console.error('❌ Error generating tweet:', error.message);
    throw error;
  }
}

/**
 * Post tweet to Twitter
 */
async function postTweet(text) {
  try {
    console.log(`\n🐦 Posting to Twitter...`);
    const tweet = await twitterClient.v2.tweet(text);
    console.log(`✅ Tweet posted successfully!`);
    console.log(`Tweet ID: ${tweet.data.id}`);
    return tweet;
  } catch (error) {
    console.error('❌ Error posting tweet:', error.message);
    throw error;
  }
}

/**
 * Save posted tweet to log
 */
function logTweet(contentType, text, tweetId) {
  const logFile = path.join(__dirname, 'tweet-history.json');
  let history = [];
  
  if (fs.existsSync(logFile)) {
    history = JSON.parse(fs.readFileSync(logFile, 'utf8'));
  }
  
  history.push({
    timestamp: new Date().toISOString(),
    contentType,
    text,
    tweetId,
  });
  
  fs.writeFileSync(logFile, JSON.stringify(history, null, 2));
}

/**
 * Main execution
 */
async function runBot() {
  console.log('🤖 SkillScan Twitter Bot Starting...\n');
  console.log(`📅 ${new Date().toLocaleString()}`);
  console.log(`📊 Configured to post ${CONFIG.postsPerDay} times per day\n`);
  
  try {
    // Generate and post the configured number of tweets
    for (let i = 0; i < CONFIG.postsPerDay; i++) {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`📮 Generating tweet ${i + 1}/${CONFIG.postsPerDay}`);
      console.log('='.repeat(50));
      
      // Select content type
      const contentType = selectContentType();
      console.log(`📂 Content type: ${contentType}`);
      
      // Generate tweet
      const tweetText = await generateTweet(contentType);
      
      // Post to Twitter
      const tweet = await postTweet(tweetText);
      
      // Log the tweet
      logTweet(contentType, tweetText, tweet.data.id);
      
      // Wait between tweets (if posting multiple)
      if (i < CONFIG.postsPerDay - 1) {
        const waitMinutes = 5;
        console.log(`\n⏳ Waiting ${waitMinutes} minutes before next tweet...`);
        await new Promise(resolve => setTimeout(resolve, waitMinutes * 60 * 1000));
      }
    }
    
    console.log('\n\n✅ All tweets posted successfully!');
    console.log(`📊 Check tweet-history.json for full log\n`);
    
  } catch (error) {
    console.error('\n❌ Bot encountered an error:', error);
    process.exit(1);
  }
}

// ==========================================
// RUN THE BOT
// ==========================================

runBot();
