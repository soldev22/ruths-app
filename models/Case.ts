import mongoose from "mongoose";

const CaseSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: true,
      unique: true,
    },

    studentName: {
      type: String,
    },

    // For teachers: student identifier (first name or code)
    studentIdentifier: {
      type: String,
    },

    // For individuals: who is being assessed
    assessing: {
      type: String,
      enum: ['child', 'self', 'other'],
    },

    teacherName: {
      type: String,
    },

    screenings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screening",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Case ||
  mongoose.model("Case", CaseSchema);
