/**
 * Source-checked IELTS listening lesson data for Module A, page 14.
 *
 * This module keeps only an authored question set, short checked answers, and
 * verified track metadata. It intentionally does not include or paraphrase the
 * copyrighted audio script/transcript.
 */
export type IeltsListeningTrack = {
  id: `cd${number}-t${string}`;
  path: `/audio/ielts/module-a/page-14/${string}.mp3`;
  role: "example-setup" | "questions-1-10";
  durationSeconds: number;
};

export type IeltsListeningShortAnswer = {
  id: string;
  number: number;
  prompt: string;
  answer: string;
  acceptedAnswers: readonly string[];
  tip: string;
};

export type IeltsListeningLesson = {
  id: string;
  title: string;
  skill: "listening";
  format: "short-answer";
  level: "IELTS foundation";
  learningGoal: string;
  instructions: string;
  tracks: readonly IeltsListeningTrack[];
  questions: readonly IeltsListeningShortAnswer[];
  source: {
    work: "Focus on Academic Skills for IELTS";
    module: "A";
    bookPage: 14;
    answerKeyPage: 74;
    trackMapping: readonly ["cd1-t01", "cd1-t02"];
    mappingConfidence: "high";
    transcriptIncluded: false;
  };
};

export const ieltsListeningModuleAPage14: IeltsListeningLesson = {
  id: "ielts-listening-module-a-page-14-job-enquiry-01",
  title: "Listening Studio: job enquiry details",
  skill: "listening",
  format: "short-answer",
  level: "IELTS foundation",
  learningGoal: "Tangkap detail praktis seperti peran kerja, jadwal, angka, alamat, dan dokumen.",
  instructions:
    "Dengarkan track pemanasan lalu track utama. Jawab dengan kata atau angka singkat; ejaan penting untuk alamat dan dokumen.",
  tracks: [
    {
      id: "cd1-t01",
      path: "/audio/ielts/module-a/page-14/cd1-track-01.mp3",
      role: "example-setup",
      durationSeconds: 38.6,
    },
    {
      id: "cd1-t02",
      path: "/audio/ielts/module-a/page-14/cd1-track-02.mp3",
      role: "questions-1-10",
      durationSeconds: 350.9,
    },
  ],
  questions: [
    {
      id: "ielts-listening-module-a-page-14-q01",
      number: 1,
      prompt: "What job is being discussed?",
      answer: "pool attendant",
      acceptedAnswers: ["pool attendant"],
      tip: "Dengarkan nama posisi, bukan nama tempat.",
    },
    {
      id: "ielts-listening-module-a-page-14-q02",
      number: 2,
      prompt: "What would the worker help look after besides swimmers?",
      answer: "equipment",
      acceptedAnswers: ["equipment", "the equipment"],
      tip: "Artikel seperti “the” boleh tidak ditulis jika maknanya sama.",
    },
    {
      id: "ielts-listening-module-a-page-14-q03",
      number: 3,
      prompt: "What kind of tests are part of the duties?",
      answer: "water quality tests",
      acceptedAnswers: ["water quality tests"],
      tip: "Tulis frasa lengkap agar jenis tesnya jelas.",
    },
    {
      id: "ielts-listening-module-a-page-14-q04",
      number: 4,
      prompt: "Which two weekdays are needed?",
      answer: "Mondays, Wednesdays",
      acceptedAnswers: ["Mondays, Wednesdays", "Monday, Wednesday", "Monday Wednesday", "Mondays Wednesdays"],
      tip: "Urutan hari tidak mengubah jawaban selama dua harinya tepat.",
    },
    {
      id: "ielts-listening-module-a-page-14-q05",
      number: 5,
      prompt: "What are the shift start and finish times?",
      answer: "6 p.m., 10 p.m.",
      acceptedAnswers: ["6 p.m., 10 p.m.", "6 pm, 10 pm", "6 p.m. 10 p.m.", "6 pm 10 pm"],
      tip: "Untuk waktu, angka dan a.m./p.m. harus cocok.",
    },
    {
      id: "ielts-listening-module-a-page-14-q06",
      number: 6,
      prompt: "What higher hourly rate is possible?",
      answer: "$19",
      acceptedAnswers: ["$19", "19 dollars", "19"],
      tip: "Simbol mata uang membantu, tetapi angka adalah detail utama.",
    },
    {
      id: "ielts-listening-module-a-page-14-q07",
      number: 7,
      prompt: "Which avenue is in the address?",
      answer: "Farndon Avenue",
      acceptedAnswers: ["Farndon Avenue"],
      tip: "Nama jalan sering dieja; cek setiap huruf sebelum lanjut.",
    },
    {
      id: "ielts-listening-module-a-page-14-q08",
      number: 8,
      prompt: "What phone extension or direct number is given?",
      answer: "053210",
      acceptedAnswers: ["053210", "053 210"],
      tip: "Jangan hilangkan nol awal pada nomor telepon.",
    },
    {
      id: "ielts-listening-module-a-page-14-q09",
      number: 9,
      prompt: "What document should the applicant bring?",
      answer: "application form",
      acceptedAnswers: ["application form"],
      tip: "Dengarkan benda yang perlu dibawa, bukan tindakan yang harus dilakukan.",
    },
    {
      id: "ielts-listening-module-a-page-14-q10",
      number: 10,
      prompt: "What proof of qualifications should also be brought?",
      answer: "certificates",
      acceptedAnswers: ["certificates", "certificate"],
      tip: "Bentuk tunggal/jamak dapat diterima jika konteksnya tetap sama.",
    },
  ],
  source: {
    work: "Focus on Academic Skills for IELTS",
    module: "A",
    bookPage: 14,
    answerKeyPage: 74,
    trackMapping: ["cd1-t01", "cd1-t02"],
    mappingConfidence: "high",
    transcriptIncluded: false,
  },
};
