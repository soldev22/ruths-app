// Quick script to set credits for a test user
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ruthsapp';

const UserSchema = new mongoose.Schema({
  email: String,
  prepaidCredits: Number,
  screeningsUsed: Number,
  accountType: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function setCredits() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find Mike Tester and give him 10 credits for testing
    const user = await User.findOne({ email: 'mt@mt.com' });
    
    if (user) {
      user.prepaidCredits = 10;
      user.screeningsUsed = user.screeningsUsed || 0;
      user.accountType = 'individual';
      await user.save();
      
      console.log(`✅ Updated ${user.email}:`);
      console.log(`   - Prepaid Credits: ${user.prepaidCredits}`);
      console.log(`   - Screenings Used: ${user.screeningsUsed}`);
      console.log(`   - Account Type: ${user.accountType}`);
    } else {
      console.log('User not found');
    }

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setCredits();
