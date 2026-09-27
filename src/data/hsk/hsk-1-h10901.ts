export type HskQuestion = {
  id: string;
  number: number;
  section: "listening" | "reading";
  part: string;
  prompt: string;
  answer: string;
  acceptedAnswers: readonly string[];
  kind: "true-false" | "choice" | "matching";
};

export type HskPractice = {
  id: string;
  level: 1;
  code: string;
  title: string;
  sourceFile: string;
  audio: { path: `/audio/hsk/${string}.mp3`; label: string; note: string };
  sections: { listening: readonly HskQuestion[]; reading: readonly HskQuestion[] };
};

const tf = (n: number, section: "listening" | "reading", part: string, prompt: string, answer: "√" | "×"): HskQuestion => ({
  id: `h10901-${section}-${n}`,
  number: n,
  section,
  part,
  prompt,
  answer,
  acceptedAnswers: answer === "√" ? ["√", "v", "V", "true", "TRUE", "benar"] : ["×", "x", "X", "false", "FALSE", "salah"],
  kind: "true-false",
});

const choice = (n: number, section: "listening" | "reading", part: string, prompt: string, answer: string): HskQuestion => ({
  id: `h10901-${section}-${n}`,
  number: n,
  section,
  part,
  prompt,
  answer,
  acceptedAnswers: [answer, answer.toLowerCase()],
  kind: "choice",
});

export const hsk1H10901: HskPractice = {
  id: "hsk-1-h10901",
  level: 1,
  code: "H10901",
  title: "HSK 1 Journey: H10901 Starter Quest",
  sourceFile: "mandarin/H10901.pdf",
  audio: {
    path: "/audio/hsk/hsk-1/h10901.mp3",
    label: "H10901 listening audio",
    note: "Original HSK 1 audio file. Use with the listening practice below.",
  },
  sections: {
    listening: [
      tf(1, "listening", "Part 1 · 判断对错", "Listen and decide whether picture 1 matches the statement.", "√"),
      tf(2, "listening", "Part 1 · 判断对错", "Listen and decide whether picture 2 matches the statement.", "×"),
      tf(3, "listening", "Part 1 · 判断对错", "Listen and decide whether picture 3 matches the statement.", "×"),
      tf(4, "listening", "Part 1 · 判断对错", "Listen and decide whether picture 4 matches the statement.", "×"),
      tf(5, "listening", "Part 1 · 判断对错", "Listen and decide whether picture 5 matches the statement.", "√"),
      choice(6, "listening", "Part 2 · Choose A/B/C", "Choose the matching picture for statement 6.", "A"),
      choice(7, "listening", "Part 2 · Choose A/B/C", "Choose the matching picture for statement 7.", "A"),
      choice(8, "listening", "Part 2 · Choose A/B/C", "Choose the matching picture for statement 8.", "C"),
      choice(9, "listening", "Part 2 · Choose A/B/C", "Choose the matching picture for statement 9.", "A"),
      choice(10, "listening", "Part 2 · Choose A/B/C", "Choose the matching picture for statement 10.", "C"),
      choice(11, "listening", "Part 3 · Matching", "Match dialogue 11 to picture A–F.", "D"),
      choice(12, "listening", "Part 3 · Matching", "Match dialogue 12 to picture A–F.", "B"),
      choice(13, "listening", "Part 3 · Matching", "Match dialogue 13 to picture A–F.", "A"),
      choice(14, "listening", "Part 3 · Matching", "Match dialogue 14 to picture A–F.", "E"),
      choice(15, "listening", "Part 3 · Matching", "Match dialogue 15 to picture A–F.", "F"),
      choice(16, "listening", "Part 4 · Question response", "Question 16: choose the correct answer A/B/C.", "B"),
      choice(17, "listening", "Part 4 · Question response", "Question 17: choose the correct answer A/B/C.", "B"),
      choice(18, "listening", "Part 4 · Question response", "Question 18: choose the correct answer A/B/C.", "C"),
      choice(19, "listening", "Part 4 · Question response", "Question 19: choose the correct answer A/B/C.", "C"),
      choice(20, "listening", "Part 4 · Question response", "Question 20: choose the correct answer A/B/C.", "B"),
    ],
    reading: [
      tf(21, "reading", "Part 1 · 判断对错", "Decide whether item 21 matches the picture/word pair.", "√"),
      tf(22, "reading", "Part 1 · 判断对错", "Decide whether item 22 matches the picture/word pair.", "√"),
      tf(23, "reading", "Part 1 · 判断对错", "Decide whether item 23 matches the picture/word pair.", "×"),
      tf(24, "reading", "Part 1 · 判断对错", "Decide whether item 24 matches the picture/word pair.", "×"),
      tf(25, "reading", "Part 1 · 判断对错", "Decide whether item 25 matches the picture/word pair.", "√"),
      choice(26, "reading", "Part 2 · Picture matching", "Sentence 26: match to picture A–F.", "D"),
      choice(27, "reading", "Part 2 · Picture matching", "Sentence 27: match to picture A–F.", "F"),
      choice(28, "reading", "Part 2 · Picture matching", "Sentence 28: match to picture A–F.", "C"),
      choice(29, "reading", "Part 2 · Picture matching", "Sentence 29: match to picture A–F.", "A"),
      choice(30, "reading", "Part 2 · Picture matching", "Sentence 30: match to picture A–F.", "B"),
      choice(31, "reading", "Part 3 · Q&A matching", "Question 31: choose the matching response A–F.", "C"),
      choice(32, "reading", "Part 3 · Q&A matching", "Question 32: choose the matching response A–F.", "D"),
      choice(33, "reading", "Part 3 · Q&A matching", "Question 33: choose the matching response A–F.", "A"),
      choice(34, "reading", "Part 3 · Q&A matching", "Question 34: choose the matching response A–F.", "B"),
      choice(35, "reading", "Part 3 · Q&A matching", "Question 35: choose the matching response A–F.", "E"),
      choice(36, "reading", "Part 4 · Fill in the blank", "Blank 36: choose the best word A–F.", "F"),
      choice(37, "reading", "Part 4 · Fill in the blank", "Blank 37: choose the best word A–F.", "B"),
      choice(38, "reading", "Part 4 · Fill in the blank", "Blank 38: choose the best word A–F.", "E"),
      choice(39, "reading", "Part 4 · Fill in the blank", "Blank 39: choose the best word A–F.", "A"),
      choice(40, "reading", "Part 4 · Fill in the blank", "Blank 40: choose the best word A–F.", "C"),
    ],
  },
};
