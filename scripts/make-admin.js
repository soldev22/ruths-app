// Script to make a user an admin
// Usage: node scripts/make-admin.js <email>

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  isAdmin: Boolean,
}, { strict: false });

const User = mongoose.model('User', UserSchema);

async function makeAdmin() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('❌ Please provide an email address');
    console.log('Usage: node scripts/make-admin.js your@email.com');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.error(`❌ User with email "${email}" not found`);
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();

    console.log(`✅ Success! User "${email}" is now an admin`);
    console.log(`   Name: ${user.name || 'N/A'}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   isAdmin: ${user.isAdmin}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

makeAdmin();
