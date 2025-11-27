// lib/dyslexiaQuestions.ts

export type Option = {
  value: string;
  label: string;
};

export type Question = {
  id: string;
  text: string;
  type: "mcq" | "likert";
  options?: Option[];
};

export type Section = {
  id: string;
  title: string;
  description?: string;
  timed?: boolean;
  durationSeconds?: number;
  questions: Question[];
};

export const dyslexiaSections: Section[] = [
  {
    id: "section-1-phonological",
    title: "Section 1 — Phonological Awareness",
    description: "Untimed — multiple choice.",
    questions: [
      {
        id: "q1",
        text: "Which word has the same beginning sound as clap?",
        type: "mcq",
        options: [
          { value: "A", label: "Clock" },
          { value: "B", label: "Snap" },
          { value: "C", label: "Plan" },
          { value: "D", label: "Flat" },
        ],
      },
      {
        id: "q2",
        text: "Which word rhymes with source?",
        type: "mcq",
        options: [
          { value: "A", label: "Horse" },
          { value: "B", label: "Sour" },
          { value: "C", label: "Sauce" },
          { value: "D", label: "Sort" },
        ],
      },
      {
        id: "q3",
        text: "Remove the first sound in track. What remains?",
        type: "mcq",
        options: [
          { value: "A", label: "Rack" },
          { value: "B", label: "Tack" },
          { value: "C", label: "Track" },
          { value: "D", label: "Ack" },
        ],
      },
      {
        id: "q4",
        text: "Which word has two syllables?",
        type: "mcq",
        options: [
          { value: "A", label: "Strength" },
          { value: "B", label: "Pencil" },
          { value: "C", label: "Toast" },
          { value: "D", label: "Craft" },
        ],
      },
    ],
  },

  {
    id: "section-2-ran",
    title: "Section 2 — Rapid Naming (Timed)",
    description:
      "Assessor times the pupil for 30 seconds and records how many items they read correctly.",
    timed: true,
    durationSeconds: 30,
    questions: [
      {
        id: "q-ran-band",
        text: "How many items did the pupil read correctly in 30 seconds?",
        type: "mcq",
        options: [
          { value: "0-9", label: "0–9 (Significant difficulty)" },
          { value: "10-17", label: "10–17 (Below average)" },
          { value: "18-24", label: "18–24 (Average)" },
          { value: "25+", label: "25+ (Very strong)" },
        ],
      },
    ],
  },

  {
    id: "section-3-working-memory",
    title: "Section 3 — Auditory Working Memory",
    description: "Untimed — multiple choice.",
    questions: [
      {
        id: "q5",
        text:
          "What were the last two numbers in this sequence: 4 – 9 – 2 – 8 – 7 – 1?",
        type: "mcq",
        options: [
          { value: "A", label: "8, 7" },
          { value: "B", label: "7, 1" },
          { value: "C", label: "2, 8" },
          { value: "D", label: "9, 2" },
        ],
      },
      {
        id: "q6",
        text:
          "You will hear three words: library – kitchen – forest. Which word was said second?",
        type: "mcq",
        options: [
          { value: "A", label: "Library" },
          { value: "B", label: "Kitchen" },
          { value: "C", label: "Forest" },
          { value: "D", label: "None of these" },
        ],
      },
      {
        id: "q7",
        text:
          "Repeat the letters in order: R – T – F – L – S. Which letter was third?",
        type: "mcq",
        options: [
          { value: "A", label: "R" },
          { value: "B", label: "F" },
          { value: "C", label: "T" },
          { value: "D", label: "L" },
        ],
      },
    ],
  },

  {
    id: "section-4-orthographic",
    title: "Section 4 — Orthographic Processing",
    description: "Spelling-pattern recognition.",
    questions: [
      {
        id: "q8",
        text: "Which spelling looks correct?",
        type: "mcq",
        options: [
          { value: "A", label: "Definate" },
          { value: "B", label: "Defenit" },
          { value: "C", label: "Definite" },
          { value: "D", label: "Defanit" },
        ],
      },
      {
        id: "q9",
        text: "Which word is spelled correctly?",
        type: "mcq",
        options: [
          { value: "A", label: "Realy" },
          { value: "B", label: "Really" },
          { value: "C", label: "Reely" },
          { value: "D", label: "Reallie" },
        ],
      },
      {
        id: "q10",
        text: "Which word is NOT spelled correctly?",
        type: "mcq",
        options: [
          { value: "A", label: "Visible" },
          { value: "B", label: "Attension" },
          { value: "C", label: "Possible" },
          { value: "D", label: "Capture" },
        ],
      },
      {
        id: "q11",
        text:
          'Choose the correctly spelled word meaning "necessary":',
        type: "mcq",
        options: [
          { value: "A", label: "Nescacery" },
          { value: "B", label: "Necessary" },
          { value: "C", label: "Nenecessary" },
          { value: "D", label: "Neccesery" },
        ],
      },
    ],
  },

  {
    id: "section-6-vocabulary",
    title: "Section 6 — Vocabulary & Word Meaning",
    questions: [
      {
        id: "q12",
        text: "What does reluctant mean?",
        type: "mcq",
        options: [
          { value: "A", label: "Very excited" },
          { value: "B", label: "Unwilling" },
          { value: "C", label: "Extremely tired" },
          { value: "D", label: "Confident" },
        ],
      },
      {
        id: "q13",
        text: "Choose the best synonym for vital.",
        type: "mcq",
        options: [
          { value: "A", label: "Optional" },
          { value: "B", label: "Important" },
          { value: "C", label: "Boring" },
          { value: "D", label: "Flexible" },
        ],
      },
      {
        id: "q14",
        text: "Which phrase matches maintain?",
        type: "mcq",
        options: [
          { value: "A", label: "To keep something going" },
          { value: "B", label: "To take something apart" },
          { value: "C", label: "To guess" },
          { value: "D", label: "To complain" },
        ],
      },
    ],
  },

  {
    id: "section-7-visual",
    title: "Section 7 — Visual Processing",
    questions: [
      {
        id: "q15",
        text: "Which of these shapes is identical to the target?",
        type: "mcq",
        options: [
          { value: "A", label: "♦ (same rotation)" },
          { value: "B", label: "◇ (not rotated)" },
          { value: "C", label: "▢" },
          { value: "D", label: "▲" },
        ],
      },
      {
        id: "q16",
        text: "Find the letter that is different: b d p b d b d p b d q",
        type: "mcq",
        options: [
          { value: "A", label: "p" },
          { value: "B", label: "q" },
          { value: "C", label: "b" },
          { value: "D", label: "d" },
        ],
      },
    ],
  },

  {
    id: "section-9-spelling",
    title: "Section 9 — Spelling Application",
    questions: [
      {
        id: "q17",
        text: "Choose the correctly spelled sentence:",
        type: "mcq",
        options: [
          { value: "A", label: "The scientist recorded the resaults." },
          { value: "B", label: "The scientist recordid the results." },
          { value: "C", label: "The scientist recorded the results." },
          { value: "D", label: "The scientist recordered the resaults." },
        ],
      },
      {
        id: "q18",
        text:
          'Which word correctly completes the sentence? "The athlete showed great ____ throughout the season."',
        type: "mcq",
        options: [
          { value: "A", label: "determinasion" },
          { value: "B", label: "determination" },
          { value: "C", label: "determenation" },
          { value: "D", label: "determinashion" },
        ],
      },
      {
        id: "q19",
        text: "Which is correct?",
        type: "mcq",
        options: [
          { value: "A", label: "He allmost missed the bus." },
          { value: "B", label: "He almost missed the bus." },
          { value: "C", label: "He almmost missed the bus." },
          { value: "D", label: "He almoust missed the bus." },
        ],
      },
    ],
  },

  {
    id: "section-10-metacognitive",
    title: "Section 10 — Metacognitive Survey (Self-report)",
    description:
      "These questions are about how you experience reading and learning. There are no right or wrong answers.",
    questions: [
      {
        id: "q20",
        text: "I often lose my place when reading:",
        type: "likert",
        options: [
          { value: "never", label: "Never" },
          { value: "sometimes", label: "Sometimes" },
          { value: "often", label: "Often" },
          { value: "always", label: "Always" },
        ],
      },
      {
        id: "q21",
        text:
          "I need to read the same text more than once to understand it:",
        type: "likert",
        options: [
          { value: "never", label: "Never" },
          { value: "sometimes", label: "Sometimes" },
          { value: "often", label: "Often" },
          { value: "always", label: "Always" },
        ],
      },
      {
        id: "q22",
        text: "I find it difficult to remember verbal instructions:",
        type: "likert",
        options: [
          { value: "never", label: "Never" },
          { value: "sometimes", label: "Sometimes" },
          { value: "often", label: "Often" },
          { value: "always", label: "Always" },
        ],
      },
    ],
  },
];
