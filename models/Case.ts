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
