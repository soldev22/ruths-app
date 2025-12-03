import mongoose from "mongoose";

const ScreeningSchema = new mongoose.Schema(
  {
    caseId: { type: String, required: true },

    screeningType: {
      type: String,
      required: true,
      enum: ["dyslexia", "dyscalculia", "adhd", "reading"],
    },

    readingYear: {
      type: Number,
      required: false,
    },

    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        answer: String,
      },
    ],

    aiReport: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Screening ||
  mongoose.model("Screening", ScreeningSchema);
