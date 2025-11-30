// /models/ScreeningSession.ts
import mongoose, { Schema, model, models } from "mongoose";

const AnswerSchema = new Schema(
  {
    questionIndex: { type: Number, required: true },
    questionId: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const ScreeningSessionSchema = new Schema(
  {
    teacherId: { type: String, required: true },
    studentCode: { type: String, required: true },
    screeningType: {
      type: String,
      enum: ["dyslexia", "dyscalculia", "adhd"],
      required: true,
    },
    currentStep: { type: Number, default: 0 },
    answers: [AnswerSchema],
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

ScreeningSessionSchema.index(
  { teacherId: 1, studentCode: 1, screeningType: 1 },
  { unique: true }
);

export const ScreeningSession =
  models.ScreeningSession ||
  model("ScreeningSession", ScreeningSessionSchema);
