import { connectToDatabase  } from "./db";
import Question from "../models/Question";

export async function fetchDyslexiaQuestions() {
  await connectToDatabase ();

  const questions = await Question.find({
    screeningType: "dyslexia",
    active: true,
  }).sort({ section: 1, order: 1 });

  // Group by section for the wizard
  const sectionsMap: Record<string, { id: string; title: string; questions: any[] }> = {};

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
