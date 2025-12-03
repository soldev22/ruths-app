import mongoose from "mongoose";

const ReadingAssessmentSchema = new mongoose.Schema(
  {
    caseId: { type: String, required: true },

    passage: { type: String, required: true },

    teacherScore: { type: Number, required: true },

    readingAge: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ReadingAssessment ||
  mongoose.model("ReadingAssessment", ReadingAssessmentSchema);
