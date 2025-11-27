// models/DyslexiaScreening.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface SectionAnswer {
  sectionId: string;
  answers: { [questionId: string]: string };
  completedAt: Date;
}

export interface DyslexiaScreeningDocument extends Document {
  screeningId: string;
  caseId?: string;
  pupilId?: string;
  assessorId?: string;
  sections: SectionAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

const SectionAnswerSchema = new Schema<SectionAnswer>({
  sectionId: { type: String, required: true },
  answers: { type: Schema.Types.Mixed, required: false, default: {} },
  completedAt: { type: Date, required: true },
});

const DyslexiaScreeningSchema = new Schema<DyslexiaScreeningDocument>(
  {
    screeningId: { type: String, required: true, unique: true },
    caseId: { type: String },              // 👈 THIS is the missing field
    pupilId: { type: String },
    assessorId: { type: String },
    sections: { type: [SectionAnswerSchema], default: [] },
  },
  { timestamps: true }
);

const DyslexiaScreeningModel =
  models.DyslexiaScreening ||
  model<DyslexiaScreeningDocument>(
    "DyslexiaScreening",
    DyslexiaScreeningSchema,
    "dyslexia_screenings"
  );

export const DyslexiaScreening = DyslexiaScreeningModel;
