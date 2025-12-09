// Script to remove free trial screenings from all existing users
// Sets maxScreenings to 0 for all users

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  maxScreenings: Number,
}, { strict: false });

const User = mongoose.model('User', UserSchema);

async function removeTrialScreenings() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update all users to have maxScreenings = 0
    const result = await User.updateMany(
      {}, // All users
      { $set: { maxScreenings: 0 } }
    );

    console.log(`✅ Success! Updated ${result.modifiedCount} users`);
    console.log(`   All users now have maxScreenings set to 0`);
    console.log(`   Users must now purchase credits or redeem vouchers`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

removeTrialScreenings();
