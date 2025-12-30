import { Document, Model } from 'mongoose';

export interface IDyscalculiaScreening extends Document {
  teacherId: string;
  caseId: string;
  readingYear?: string;
  sections: any[];
  elapsedSeconds?: number;
}

declare const DyscalculiaScreening: Model<IDyscalculiaScreening>;
export { DyscalculiaScreening };