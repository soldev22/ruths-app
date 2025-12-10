import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    screeningType: {
      type: String,
      required: true,
      enum: ["dyslexia", "dyscalculia", "adhd", "reading"],
    },

    readingYear: {
      type: String,
      required: false, // only required for age-dependent sets
    },

    section: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      default: [],
    },

    correctAnswer: {
      type: String,
      required: false,
    },

    order: {
      type: Number,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Question ||
  mongoose.model("Question", QuestionSchema);
