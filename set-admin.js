require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: Boolean,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function setAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find Mike Tester by email or name
    const user = await User.findOne({ 
      $or: [
        { email: /mike.*tester/i },
        { name: /mike.*tester/i }
      ]
    });

    if (!user) {
      console.log("❌ Mike Tester not found. Looking for all users with 'mike' or 'tester'...");
      const users = await User.find({
        $or: [
          { email: /mike/i },
          { email: /tester/i },
          { name: /mike/i },
          { name: /tester/i }
        ]
      });
      
      console.log(`\nFound ${users.length} matching users:`);
      users.forEach(u => {
        console.log(`  - ${u.name} (${u.email}) - isAdmin: ${u.isAdmin}`);
      });
      
      await mongoose.connection.close();
      return;
    }

    console.log(`\nFound user: ${user.name} (${user.email})`);
    console.log(`Current isAdmin status: ${user.isAdmin}`);

    // Set admin to true
    user.isAdmin = true;
    await user.save();

    console.log(`✅ Updated ${user.name} to admin status: ${user.isAdmin}`);

    await mongoose.connection.close();
    console.log("✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

setAdmin();
