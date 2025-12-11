import mongoose from 'mongoose';

const marketingSettingsSchema = new mongoose.Schema({
  twitterBotEnabled: {
    type: Boolean,
    default: false,
  },
  lastRun: {
    type: Date,
    default: null,
  },
  totalTweetsPosted: {
    type: Number,
    default: 0,
  },
  lastError: {
    type: String,
    default: null,
  },
  // Social Media Links
  socialLinks: {
    twitter: {
      type: String,
      default: 'https://twitter.com/catignani2025',
    },
    facebook: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    instagram: {
      type: String,
      default: '',
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.MarketingSettings || mongoose.model('MarketingSettings', marketingSettingsSchema);
