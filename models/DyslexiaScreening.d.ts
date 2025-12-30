import { Document, Model } from 'mongoose';

export interface IDyslexiaScreening extends Document {
  teacherId: string;
  caseId: string;
  readingYear?: string;
  sections: any[];
  elapsedSeconds?: number;
}

declare const DyslexiaScreening: Model<IDyslexiaScreening>;
export { DyslexiaScreening };