import { connectToDatabase } from "./db";
import Question from "../models/Question";
export type Section = {
  sectionId: string;
  questions: {
    _id: string;
    text: string;
    options?: string[];
  }[];
};

export async function fetchDyslexiaQuestions(readingYear?: string) {
  await connectToDatabase();
 console.log(">>> Reading Year received:", readingYear);
  // Base query
  const query: any = {
    screeningType: "dyslexia",
    active: true,
  };

  // If reading year was supplied, filter by it
  if (readingYear) {
    query.readingYear = readingYear;
  }

  const questions = await Question.find(query).sort({
    section: 1,
    order: 1,
  });

  // Group by section for the wizard
  const sectionsMap: Record<
    string,
    { id: string; title: string; questions: any[] }
  > = {};

  questions.forEach((q) => {
    if (!sectionsMap[q.section]) {
      sectionsMap[q.section] = {
        id: q.section,
        title: q.section,
        questions: [],
      };
    }

    sectionsMap[q.section].questions.push({
      id: q._id.toString(),
      text: q.text,
      options: q.options || [],
      order: q.order ?? 0,
      readingYear: q.readingYear ?? null,
    });
  });

  return Object.values(sectionsMap);
}
