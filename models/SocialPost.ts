import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialPost extends Document {
  campaign: mongoose.Types.ObjectId;
  content: string;
  mediaUrls: string[];
  platforms: ('facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok')[];
  scheduledDate: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  publishedAt?: Date;
  hashtags: string[];
  mentions: string[];
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SocialPostSchema: Schema = new Schema({
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000,
  },
  mediaUrls: [{
    type: String,
  }],
  platforms: [{
    type: String,
    enum: ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok'],
    required: true,
  }],
  scheduledDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft',
  },
  publishedAt: {
    type: Date,
  },
  hashtags: [{
    type: String,
  }],
  mentions: [{
    type: String,
  }],
  engagement: {
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

SocialPostSchema.index({ campaign: 1, scheduledDate: 1 });
SocialPostSchema.index({ status: 1, scheduledDate: 1 });

export default mongoose.models.SocialPost || mongoose.model<ISocialPost>('SocialPost', SocialPostSchema);
