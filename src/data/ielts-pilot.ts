/**
 * A compact, source-checked IELTS reading pilot. The prompts paraphrase the
 * printed exercise rather than reproducing its passage.
 */
export type TrueFalseNotGiven = "TRUE" | "FALSE" | "NOT GIVEN";

export type IeltsPilotQuestion = {
  id: string;
  statement: string;
  answer: TrueFalseNotGiven;
  rationale: string;
  sourceParagraph: "A" | "B" | "C";
};

export type IeltsPilotLesson = {
  id: string;
  title: string;
  skill: "reading";
  format: "true-false-not-given";
  level: "IELTS foundation";
  learningGoal: string;
  instructions: string;
  evidenceSummary: readonly { paragraph: "A" | "B" | "C"; summary: string }[];
  questions: readonly IeltsPilotQuestion[];
  source: {
    work: "Focus on Academic Skills for IELTS";
    module: "A";
    sourcePages: readonly number[];
    verification: string;
    audio: null;
  };
};

export const ieltsPilot: IeltsPilotLesson = {
  id: "ielts-reading-tfng-childhood-obesity-01",
  title: "Reading evidence: True / False / Not Given",
  skill: "reading",
  format: "true-false-not-given",
  level: "IELTS foundation",
  learningGoal: "Distinguish a contradiction from information the text does not state.",
  instructions:
    "Read the evidence notes. For each statement, choose TRUE when supported, FALSE when contradicted, and NOT GIVEN when the evidence does not answer it.",
  evidenceSummary: [
    {
      paragraph: "A",
      summary:
        "The material reports obesity figures for children and adolescents in several regions. It says China has up to 10% of its children affected and forecasts that proportion will double within a decade.",
    },
    {
      paragraph: "B",
      summary:
        "The text links insulin to fat storage and says exercise helps regulate it. Eating fat with starches and sugar can raise insulin sharply.",
    },
    {
      paragraph: "C",
      summary:
        "The recommended response involves schools, health professionals, parents, and children working together; the suggested changes include exercise, smaller portions, and different foods.",
    },
  ],
  questions: [
    {
      id: "ielts-reading-tfng-childhood-obesity-01-q1",
      statement: "More than one third of everyone in the United States is overweight.",
      answer: "NOT GIVEN",
      rationale: "The source figure is specifically about children and adolescents, not the whole population.",
      sourceParagraph: "A",
    },
    {
      id: "ielts-reading-tfng-childhood-obesity-01-q2",
      statement: "Asia and Europe have the same rate of childhood obesity.",
      answer: "FALSE",
      rationale: "The source says Asia is behind Europe in its obesity statistics.",
      sourceParagraph: "A",
    },
    {
      id: "ielts-reading-tfng-childhood-obesity-01-q3",
      statement: "China's proportion of overweight or obese children is projected to reach 20% in ten years.",
      answer: "TRUE",
      rationale: "The source gives a current figure of up to 10% and says it is expected to double in a decade.",
      sourceParagraph: "A",
    },
    {
      id: "ielts-reading-tfng-childhood-obesity-01-q4",
      statement: "Childhood obesity is decreasing in some urban areas of Africa.",
      answer: "FALSE",
      rationale: "The source describes a less marked upward trend in urbanised sub-Saharan Africa.",
      sourceParagraph: "A",
    },
    {
      id: "ielts-reading-tfng-childhood-obesity-01-q5",
      statement: "Foods high in starch, sugar, and fat can cause a sharp rise in insulin.",
      answer: "TRUE",
      rationale: "This relationship is stated directly in the evidence.",
      sourceParagraph: "B",
    },
    {
      id: "ielts-reading-tfng-childhood-obesity-01-q6",
      statement: "Parents have the leading role in improving eating habits.",
      answer: "NOT GIVEN",
      rationale: "Parents are named as one group in a joint effort, but no group is ranked as most important.",
      sourceParagraph: "C",
    },
  ],
  source: {
    work: "Focus on Academic Skills for IELTS",
    module: "A",
    sourcePages: [6, 74],
    verification:
      "Exercise statements and the printed answer key were checked against OCR of PDF pages 6 and 74. Page 74 confirms: NG, F, T, F, T, NG.",
    // No file is listed: the supplied audio tracks are generically named and no track-to-exercise mapping was verified.
    audio: null,
  },
};
