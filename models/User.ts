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
      enum: ['trial', 'starter', 'professional', 'school'],
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
    maxScreenings: { type: Number, default: 20 }, // 20 for trial, unlimited (-1) for paid
    
    // Payment tracking
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
