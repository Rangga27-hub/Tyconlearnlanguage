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
    audio: null;
  };
};

export const ieltsPilot: IeltsPilotLesson = {
  id: "ielts-reading-tfng-childhood-obesity-01",
  title: "Reading evidence: True / False / Not Given",
  skill: "reading",
  format: "true-false-not-given",
  level: "IELTS foundation",
  learningGoal: "Bedakan informasi yang bertentangan dari informasi yang tidak disebutkan dalam teks.",
  instructions:
    "Baca catatan bukti. Pilih TRUE jika pernyataan didukung, FALSE jika bertentangan, dan NOT GIVEN jika bukti tidak menjawabnya.",
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
      rationale: "Angka dalam sumber khusus membahas anak-anak dan remaja, bukan seluruh penduduk.",
      sourceParagraph: "A",
    },
    {
      id: "ielts-reading-tfng-childhood-obesity-01-q2",
      statement: "Asia and Europe have the same rate of childhood obesity.",
      answer: "FALSE",
      rationale: "Sumber menyatakan bahwa statistik obesitas Asia berada di bawah Eropa.",
      sourceParagraph: "A",
    },
    {
      id: "ielts-reading-tfng-childhood-obesity-01-q3",
      statement: "China's proportion of overweight or obese children is projected to reach up to 20% in ten years.",
      answer: "TRUE",
      rationale: "Sumber menyebut angka saat ini hingga 10% dan memperkirakannya menjadi dua kali lipat dalam satu dekade.",
      sourceParagraph: "A",
    },
    {
      id: "ielts-reading-tfng-childhood-obesity-01-q4",
      statement: "Childhood obesity is decreasing in some urban areas of Africa.",
      answer: "FALSE",
      rationale: "Sumber menggambarkan tren kenaikan yang lebih lambat di wilayah perkotaan Afrika sub-Sahara.",
      sourceParagraph: "A",
    },
    {
      id: "ielts-reading-tfng-childhood-obesity-01-q5",
      statement: "Foods high in starch, sugar, and fat can cause a sharp rise in insulin.",
      answer: "TRUE",
      rationale: "Hubungan ini dinyatakan secara langsung dalam bukti.",
      sourceParagraph: "B",
    },
    {
      id: "ielts-reading-tfng-childhood-obesity-01-q6",
      statement: "Parents have the leading role in improving eating habits.",
      answer: "NOT GIVEN",
      rationale: "Orang tua disebut sebagai salah satu pihak dalam upaya bersama, tetapi tidak ada pihak yang dinyatakan paling utama.",
      sourceParagraph: "C",
    },
  ],
  source: {
    work: "Focus on Academic Skills for IELTS",
    module: "A",
    sourcePages: [6, 74],
    // No file is listed: the supplied audio tracks are generically named and no track-to-exercise mapping was verified.
    audio: null,
  },
};
