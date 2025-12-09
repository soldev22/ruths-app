import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // Subscription fields
    accountType: { 
      type: String, 
      enum: ['individual', 'school'],
      default: 'individual'
    },
    subscriptionTier: { 
      type: String, 
      enum: ['trial', 'starter', 'professional', 'school', 'payperuse'],
      default: 'trial'
    },
    subscriptionStatus: { 
      type: String, 
      enum: ['trial', 'active', 'expired', 'cancelled'],
      default: 'trial'
    },
    trialStartDate: { type: Date },
    trialEndDate: { type: Date },
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },
    
    // Usage tracking
    screeningsUsed: { type: Number, default: 0 },
    maxScreenings: { type: Number, default: 0 }, // 0 for pay-per-use (no free trial)
    
    // Pay-per-use tracking (for individuals)
    prepaidCredits: { type: Number, default: 0 }, // Number of prepaid assessments
    
    // Payment tracking
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    
    // Admin access
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
