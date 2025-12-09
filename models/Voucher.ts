import mongoose, { Schema, models, model } from "mongoose";

const VoucherSchema = new Schema(
  {
    code: { 
      type: String, 
      required: true, 
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    credits: { 
      type: Number, 
      required: true,
      min: 1
    },
    maxRedemptions: { 
      type: Number, 
      default: 1,
      min: 1
    },
    currentRedemptions: { 
      type: Number, 
      default: 0,
      min: 0
    },
    expiryDate: { 
      type: Date,
      default: null
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    accountType: {
      type: String,
      enum: ['individual', 'school', 'both'],
      default: 'both'
    },
    redeemedBy: [{
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      userEmail: { type: String },
      redeemedAt: { type: Date, default: Date.now }
    }],
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    },
    description: { type: String }
  },
  { timestamps: true }
);

// Index for efficient lookups
VoucherSchema.index({ code: 1, isActive: 1 });
VoucherSchema.index({ expiryDate: 1 });

const Voucher = models.Voucher || model("Voucher", VoucherSchema);
export default Voucher;
