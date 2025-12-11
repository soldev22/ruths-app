/**
 * Test script to manually trigger the Twitter bot
 * Run: node test-twitter-bot.js
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/cron/post-tweets',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ruthsapp-cron-secret-2025',
    'Content-Type': 'application/json'
  }
};

console.log('🧪 Testing Twitter Bot Integration...\n');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('\nResponse:');
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
      
      if (json.success) {
        console.log('\n✅ SUCCESS!');
        if (json.skipped) {
          console.log('⏸️  Bot is disabled - enable it in the marketing dashboard');
        } else {
          console.log(`📤 Posted ${json.posted} tweet(s)`);
          json.tweets?.forEach((tweet, i) => {
            console.log(`\n${i + 1}. Tweet ID: ${tweet.id}`);
            console.log(`   Source: ${tweet.source}`);
            console.log(`   Type: ${tweet.type}`);
            if (tweet.campaignName) {
              console.log(`   Campaign: ${tweet.campaignName}`);
            }
            console.log(`   Text: ${tweet.text}`);
          });
        }
      } else {
        console.log('\n❌ FAILED:', json.error);
      }
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('\n💡 Make sure the dev server is running (npm run dev)');
});

req.end();
