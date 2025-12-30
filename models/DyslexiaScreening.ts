// models/DyslexiaScreening.ts
import mongoose, { Schema, model, models } from "mongoose";

const SectionAnswersSchema = new Schema(
  {
    sectionId: { type: String, required: true },
    // answers is a simple key/value object: { [questionId]: string }
    answers: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { _id: false }
);

const DyslexiaScreeningSchema = new Schema(
  {
    // we now track which teacher did the screening
    teacherId: {
      type: String,
      default: "anonymous",
    },
    caseId: { type: String, required: true },
    readingYear: { type: String, default: null }, // e.g. "819446"
    sections: [SectionAnswersSchema],
    elapsedSeconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One screening per teacher + caseId
DyslexiaScreeningSchema.index(
  { teacherId: 1, caseId: 1 },
  { unique: true }
);

export const DyslexiaScreening =
  models.DyslexiaScreening ||
  model("DyslexiaScreening", DyslexiaScreeningSchema);
