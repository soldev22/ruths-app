import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaignAnalytics extends Document {
  campaign: mongoose.Types.ObjectId;
  date: Date;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok';
  metrics: {
    impressions: number;
    reach: number;
    engagement: number;
    clicks: number;
    conversions: number;
    spend?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CampaignAnalyticsSchema: Schema = new Schema({
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  platform: {
    type: String,
    enum: ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok'],
    required: true,
  },
  metrics: {
    impressions: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    spend: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

CampaignAnalyticsSchema.index({ campaign: 1, date: 1, platform: 1 });

export default mongoose.models.CampaignAnalytics || mongoose.model<ICampaignAnalytics>('CampaignAnalytics', CampaignAnalyticsSchema);
