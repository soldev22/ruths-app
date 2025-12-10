import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate: Date;
  targetAudience: string;
  goals: string[];
  platforms: ('facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok')[];
  budget?: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed'],
    default: 'draft',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  targetAudience: {
    type: String,
    required: true,
  },
  goals: [{
    type: String,
  }],
  platforms: [{
    type: String,
    enum: ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok'],
  }],
  budget: {
    type: Number,
    min: 0,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);
