import mongoose, { Schema, models, model } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User",
      required: true,
      index: true
    },
    userEmail: { type: String, required: true },
    activityType: { 
      type: String, 
      enum: ['login', 'logout', 'screening_started', 'screening_completed', 'screening_section_completed', 'registration'],
      required: true,
      index: true
    },
    screeningId: { 
      type: Schema.Types.ObjectId, 
      ref: "DyslexiaScreening"
    },
    caseId: { type: String },
    sectionId: { type: String },
    metadata: { type: Schema.Types.Mixed }, // Additional data like IP, user agent, etc.
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

// Index for efficient queries
ActivityLogSchema.index({ userId: 1, timestamp: -1 });
ActivityLogSchema.index({ activityType: 1, timestamp: -1 });

const ActivityLog = models.ActivityLog || model("ActivityLog", ActivityLogSchema);

export default ActivityLog;
