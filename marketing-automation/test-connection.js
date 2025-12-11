/**
 * Test script to verify your API connections work
 */

const { TwitterApi } = require('twitter-api-v2');
const OpenAI = require('openai');

// Load config from environment variables
require('dotenv').config({ path: '../.env.local' });

const CONFIG = {
  twitter: {
    appKey: process.env.TWITTER_API_KEY || 'YOUR_TWITTER_API_KEY_HERE',
    appSecret: process.env.TWITTER_API_SECRET || 'YOUR_TWITTER_API_SECRET_HERE',
    accessToken: process.env.TWITTER_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN_HERE',
    accessSecret: process.env.TWITTER_ACCESS_SECRET || 'YOUR_ACCESS_SECRET_HERE',
  },
    openaiKey: process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE',

};

console.log('🧪 Testing API Connections...\n');

// Test Twitter
async function testTwitter() {
  console.log('1️⃣ Testing Twitter API...');
  try {
    const client = new TwitterApi({
      appKey: CONFIG.twitter.appKey,
      appSecret: CONFIG.twitter.appSecret,
      accessToken: CONFIG.twitter.accessToken,
      accessSecret: CONFIG.twitter.accessSecret,
    });
    
    const me = await client.v2.me();
    console.log(`✅ Twitter connected! Logged in as: @${me.data.username}`);
    return true;
  } catch (error) {
    console.error('❌ Twitter connection failed:', error.message);
    return false;
  }
}

// Test OpenAI
async function testOpenAI() {
  console.log('\n2️⃣ Testing OpenAI API...');
  try {
    const openai = new OpenAI({ apiKey: CONFIG.openaiKey });
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Say "Hello SkillScan!"' }],
      max_tokens: 10,
    });
    console.log(`✅ OpenAI connected! Response: ${response.choices[0].message.content}`);
    return true;
  } catch (error) {
    console.error('❌ OpenAI connection failed:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  const twitterOk = await testTwitter();
  const openaiOk = await testOpenAI();
  
  console.log('\n' + '='.repeat(50));
  if (twitterOk && openaiOk) {
    console.log('✅ All tests passed! Ready to start posting.');
  } else {
    console.log('❌ Some tests failed. Check your API keys.');
  }
  console.log('='.repeat(50) + '\n');
}

runTests();
