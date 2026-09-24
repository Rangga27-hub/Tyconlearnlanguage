export type IeltsShortAnswerQuestion = {
  id: string;
  number: number;
  prompt: string;
  answer: string;
  acceptedAnswers: readonly string[];
  tip?: string;
};

export type IeltsAudioTrack = {
  id: string;
  path: `/audio/ielts/${string}.mp3`;
  label: string;
  role: string;
  durationSeconds: number | null;
};

export type IeltsListeningPractice = {
  id: string;
  module: "A" | "B" | "C" | "D";
  title: string;
  bookPage: number;
  answerKeyPage: number;
  sourceNote: string;
  instructions: string;
  tracks: readonly IeltsAudioTrack[];
  questions: readonly IeltsShortAnswerQuestion[];
};

export type IeltsGrammarPractice = {
  id: string;
  module: "A" | "B" | "C" | "D";
  title: string;
  bookPage: number;
  answerKeyPage: number;
  instructions: string;
  questions: readonly IeltsShortAnswerQuestion[];
};

export type IeltsReadingPractice = {
  id: string;
  module: "B" | "C" | "D";
  title: string;
  bookPage: number;
  answerKeyPage: number;
  instructions: string;
  evidenceSummary: readonly string[];
  questions: readonly IeltsShortAnswerQuestion[];
};

export const moduleBReadingPage20: IeltsReadingPractice = {
  id: "ielts-reading-module-b-page-20-solar-power",
  module: "B",
  title: "Reading Lab: Light years ahead",
  bookPage: 20,
  answerKeyPage: 75,
  instructions: "Gunakan ringkasan bukti, lalu jawab singkat. Ini versi latihan ringkas, bukan salinan penuh teks sumber.",
  evidenceSummary: [
    "The reading text discusses a power shortage in Uganda and the challenge of selling small solar-power solutions.",
    "Sunshine Solutions is linked with Mr Kajubi, while BioDesign is described as a British company set up by Graham Knight.",
    "The text contrasts large-scale development projects with smaller local schemes and asks readers to match information to paragraphs.",
  ],
  questions: [
    { id: "module-b-reading-q1", number: 1, prompt: "What problem is the text mainly concerned with?", answer: "power shortage", acceptedAnswers: ["power shortage", "a power shortage"] },
    { id: "module-b-reading-q2", number: 2, prompt: "In which country is the situation discussed?", answer: "Uganda", acceptedAnswers: ["Uganda"] },
    { id: "module-b-reading-q3", number: 3, prompt: "What product is described as difficult to sell?", answer: "cheap solar panels", acceptedAnswers: ["cheap solar panels", "solar panels"] },
    { id: "module-b-reading-q4", number: 4, prompt: "How are the panels described commercially?", answer: "a hard sell", acceptedAnswers: ["a hard sell", "hard sell"] },
    { id: "module-b-reading-q5", number: 5, prompt: "Who is connected with Sunshine Solutions?", answer: "Mr Kajubi", acceptedAnswers: ["Mr Kajubi", "Kajubi"] },
    { id: "module-b-reading-q6", number: 6, prompt: "Who set up BioDesign?", answer: "Graham Knight", acceptedAnswers: ["Graham Knight", "Knight"] },
  ],
};

export const moduleBListeningPage23: IeltsListeningPractice = {
  id: "ielts-listening-module-b-page-23-school-tour",
  module: "B",
  title: "Listening Studio: school introduction and tour",
  bookPage: 23,
  answerKeyPage: 75,
  sourceNote: "Focus on Academic Skills for IELTS, Module B, Focus on listening page 23. Audio mapping: CD1 Track 6 for questions 1–5 and CD1 Track 7 for questions 6–10.",
  instructions: "Dengarkan track pertama untuk Questions 1–5, lalu track kedua untuk Questions 6–10. Jawab singkat sesuai catatan yang diminta.",
  tracks: [
    { id: "cd1-t06", path: "/audio/ielts/module-b/page-23/cd1-track-06.mp3", label: "CD1 Track 6", role: "Questions 1–5", durationSeconds: null },
    { id: "cd1-t07", path: "/audio/ielts/module-b/page-23/cd1-track-07.mp3", label: "CD1 Track 7", role: "Questions 6–10", durationSeconds: 159.7 },
  ],
  questions: [
    { id: "module-b-listening-q1", number: 1, prompt: "Which option matches the first answer?", answer: "B", acceptedAnswers: ["B", "b"], tip: "Gunakan huruf pilihan dari soal sumber." },
    { id: "module-b-listening-q2", number: 2, prompt: "Which option matches the second answer?", answer: "C", acceptedAnswers: ["C", "c"], tip: "Gunakan huruf pilihan dari soal sumber." },
    { id: "module-b-listening-q3", number: 3, prompt: "Which option matches the third answer?", answer: "A", acceptedAnswers: ["A", "a"], tip: "Gunakan huruf pilihan dari soal sumber." },
    { id: "module-b-listening-q4", number: 4, prompt: "What is north of the starting point?", answer: "Number 6", acceptedAnswers: ["Number 6", "6", "number six"], tip: "Jawaban berupa nomor lokasi pada peta." },
    { id: "module-b-listening-q5", number: 5, prompt: "Which map label is the vegetable patch?", answer: "Number 10", acceptedAnswers: ["Number 10", "10", "number ten"], tip: "Jawaban berupa nomor lokasi pada peta." },
    { id: "module-b-listening-q6", number: 6, prompt: "Which answer is given for question 6?", answer: "F", acceptedAnswers: ["F", "f"] },
    { id: "module-b-listening-q7", number: 7, prompt: "Which answer is given for question 7?", answer: "E", acceptedAnswers: ["E", "e"] },
    { id: "module-b-listening-q8", number: 8, prompt: "Which answer is given for question 8?", answer: "H", acceptedAnswers: ["H", "h"] },
    { id: "module-b-listening-q9", number: 9, prompt: "Which answer is given for question 9?", answer: "D", acceptedAnswers: ["D", "d"] },
    { id: "module-b-listening-q10", number: 10, prompt: "Which answer is given for question 10?", answer: "G", acceptedAnswers: ["G", "g"] },
  ],
};

export const grammarPractices: readonly IeltsGrammarPractice[] = [
  {
    id: "ielts-grammar-module-a-language-review",
    module: "A",
    title: "Language Review A: health, exercise, and trends",
    bookPage: 18,
    answerKeyPage: 75,
    instructions: "Isi kata/frasa kunci. Latihan ini diadaptasi sebagai vocabulary-and-grammar recall, bukan salinan penuh halaman sumber.",
    questions: [
      { id: "grammar-a-q1", number: 1, prompt: "A place where people do organised sport or fitness activities", answer: "sports centre", acceptedAnswers: ["sports centre", "sport centre"] },
      { id: "grammar-a-q2", number: 2, prompt: "The amount of energy a person uses", answer: "energy expenditure", acceptedAnswers: ["energy expenditure"] },
      { id: "grammar-a-q3", number: 3, prompt: "Activity that keeps the body fit", answer: "physical exercise", acceptedAnswers: ["physical exercise", "exercise"] },
      { id: "grammar-a-q4", number: 4, prompt: "A programme designed for practice and improvement", answer: "training programme", acceptedAnswers: ["training programme", "training program"] },
      { id: "grammar-a-q5", number: 5, prompt: "Eating habits that are reasonable and healthy", answer: "sensible eating habits", acceptedAnswers: ["sensible eating habits", "sensible eating"] },
      { id: "grammar-a-q6", number: 6, prompt: "A diet with the right mix of food types", answer: "balanced diet", acceptedAnswers: ["balanced diet", "a balanced diet"] },
      { id: "grammar-a-q7", number: 7, prompt: "A worldwide epidemic", answer: "global epidemic", acceptedAnswers: ["global epidemic", "a global epidemic"] },
    ],
  },
  {
    id: "ielts-grammar-module-b-language-review",
    module: "B",
    title: "Language Review B: cities, resources, and development",
    bookPage: 30,
    answerKeyPage: 76,
    instructions: "Isi kata akademik yang cocok. Fokus pada collocation dan topic vocabulary Module B.",
    questions: [
      { id: "grammar-b-q1", number: 1, prompt: "Related to towns and cities", answer: "urban", acceptedAnswers: ["urban"] },
      { id: "grammar-b-q2", number: 2, prompt: "With many people living close together", answer: "densely populated", acceptedAnswers: ["densely populated", "densely"] },
      { id: "grammar-b-q3", number: 3, prompt: "Money-related", answer: "financial", acceptedAnswers: ["financial"] },
      { id: "grammar-b-q4", number: 4, prompt: "Too much traffic in one place", answer: "congestion", acceptedAnswers: ["congestion", "traffic congestion"] },
      { id: "grammar-b-q5", number: 5, prompt: "Related to the countryside", answer: "rural", acceptedAnswers: ["rural"] },
      { id: "grammar-b-q6", number: 6, prompt: "Farming as an economic activity", answer: "agriculture", acceptedAnswers: ["agriculture"] },
      { id: "grammar-b-q7", number: 7, prompt: "Ability to read and write", answer: "literacy", acceptedAnswers: ["literacy"] },
    ],
  },
  {
    id: "ielts-grammar-module-c-language-review",
    module: "C",
    title: "Language Review C: work, pressure, and attitudes",
    bookPage: 44,
    answerKeyPage: 78,
    instructions: "Isi vocabulary akademik yang muncul di Language Review C.",
    questions: [
      { id: "grammar-c-q1", number: 1, prompt: "A better way of life or social condition", answer: "higher standard of living", acceptedAnswers: ["higher standard of living"] },
      { id: "grammar-c-q2", number: 2, prompt: "Growth of an economy", answer: "economic development", acceptedAnswers: ["economic development"] },
      { id: "grammar-c-q3", number: 3, prompt: "Improved treatment and medical services", answer: "improved healthcare", acceptedAnswers: ["improved healthcare", "healthcare"] },
      { id: "grammar-c-q4", number: 4, prompt: "Modern machines and systems", answer: "modern technology", acceptedAnswers: ["modern technology"] },
      { id: "grammar-c-q5", number: 5, prompt: "Stress from work and daily pressure", answer: "higher stress levels", acceptedAnswers: ["higher stress levels", "stress levels"] },
      { id: "grammar-c-q6", number: 6, prompt: "When family relationships fail", answer: "family breakdown", acceptedAnswers: ["family breakdown"] },
      { id: "grammar-c-q7", number: 7, prompt: "Too much work to do", answer: "overworked", acceptedAnswers: ["overworked"] },
    ],
  },
  {
    id: "ielts-grammar-module-d-language-review",
    module: "D",
    title: "Language Review D: arts and performance",
    bookPage: 56,
    answerKeyPage: 79,
    instructions: "Isi kata/frasa bidang visual arts dan performing arts.",
    questions: [
      { id: "grammar-d-q1", number: 1, prompt: "A place that displays art", answer: "art gallery", acceptedAnswers: ["art gallery", "gallery"] },
      { id: "grammar-d-q2", number: 2, prompt: "A list of exhibits", answer: "catalogue", acceptedAnswers: ["catalogue", "catalog"] },
      { id: "grammar-d-q3", number: 3, prompt: "An object on display", answer: "exhibit", acceptedAnswers: ["exhibit"] },
      { id: "grammar-d-q4", number: 4, prompt: "Images made with paint", answer: "paintings", acceptedAnswers: ["paintings", "painting"] },
      { id: "grammar-d-q5", number: 5, prompt: "Three-dimensional figures", answer: "statues", acceptedAnswers: ["statues", "statue"] },
      { id: "grammar-d-q6", number: 6, prompt: "A musical group with many instruments", answer: "orchestra", acceptedAnswers: ["orchestra", "an orchestra"] },
      { id: "grammar-d-q7", number: 7, prompt: "Practice before a performance", answer: "dress rehearsal", acceptedAnswers: ["dress rehearsal", "rehearsal"] },
    ],
  },
];

export const moduleCListeningPage38: IeltsListeningPractice = {
  id: "ielts-listening-module-c-page-38-flatshare",
  module: "C",
  title: "Listening Studio: details and flatshare candidates",
  bookPage: 38,
  answerKeyPage: 77,
  sourceNote: "Focus on Academic Skills for IELTS, Module C, Focus on listening page 38. Audio mapping: CD1 Track 11 for details practice and CD1 Track 12 for questions 1–10.",
  instructions: "Dengarkan track detail practice lalu percakapan utama. Jawab dengan ejaan/angka yang tepat.",
  tracks: [
    { id: "cd1-t11", path: "/audio/ielts/module-c/page-38/cd1-track-11.mp3", label: "CD1 Track 11", role: "Details practice", durationSeconds: 156.1 },
    { id: "cd1-t12", path: "/audio/ielts/module-c/page-38/cd1-track-12.mp3", label: "CD1 Track 12", role: "Questions 1–10", durationSeconds: 364.1 },
  ],
  questions: [
    { id: "module-c-listening-q1", number: 1, prompt: "Street name", answer: "Spurrock", acceptedAnswers: ["Spurrock"] },
    { id: "module-c-listening-q2", number: 2, prompt: "Drive name", answer: "North", acceptedAnswers: ["North", "North Drive"] },
    { id: "module-c-listening-q3", number: 3, prompt: "Email address", answer: "freshfood@adders.co.uk", acceptedAnswers: ["freshfood@adders.co.uk"] },
    { id: "module-c-listening-q4", number: 4, prompt: "Address", answer: "45 Castle Hill", acceptedAnswers: ["45 Castle Hill"] },
    { id: "module-c-listening-q5", number: 5, prompt: "First name", answer: "Serena", acceptedAnswers: ["Serena"] },
    { id: "module-c-listening-q6", number: 6, prompt: "Company name", answer: "Cliffe House", acceptedAnswers: ["Cliffe House"] },
    { id: "module-c-listening-q7", number: 7, prompt: "Name", answer: "Glenn Ledbetter", acceptedAnswers: ["Glenn Ledbetter", "Glen Ledbetter"] },
    { id: "module-c-listening-q8", number: 8, prompt: "Total cost", answer: "33", acceptedAnswers: ["33", "$33", "£33"] },
    { id: "module-c-listening-q9", number: 9, prompt: "Phone number", answer: "0234 735 733", acceptedAnswers: ["0234 735 733", "0234735733"] },
    { id: "module-c-listening-q10", number: 10, prompt: "Date", answer: "14th May", acceptedAnswers: ["14th May", "14 May", "May 14", "May 14th"] },
  ],
};

export const moduleDListeningPage46: IeltsListeningPractice = {
  id: "ielts-listening-module-d-page-46-music-course",
  module: "D",
  title: "Listening Studio: music course requirements",
  bookPage: 46,
  answerKeyPage: 78,
  sourceNote: "Focus on Academic Skills for IELTS, Module D, Focus on listening 1 page 46. Audio mapping: CD1 Track 14.",
  instructions: "Dengarkan diskusi course requirements. Beberapa jawaban berupa huruf kategori dari soal sumber.",
  tracks: [{ id: "cd1-t14", path: "/audio/ielts/module-d/page-46/cd1-track-14.mp3", label: "CD1 Track 14", role: "Questions 1–10", durationSeconds: 358.3 }],
  questions: [
    { id: "module-d1-listening-q1", number: 1, prompt: "Question 1 category", answer: "C/E/F", acceptedAnswers: ["C", "E", "F", "c", "e", "f"] },
    { id: "module-d1-listening-q2", number: 2, prompt: "Question 2 category", answer: "C/E/F", acceptedAnswers: ["C", "E", "F", "c", "e", "f"] },
    { id: "module-d1-listening-q3", number: 3, prompt: "Question 3 category", answer: "C/E/F", acceptedAnswers: ["C", "E", "F", "c", "e", "f"] },
    { id: "module-d1-listening-q4", number: 4, prompt: "Question 4 category", answer: "B/E/G", acceptedAnswers: ["B", "E", "G", "b", "e", "g"] },
    { id: "module-d1-listening-q5", number: 5, prompt: "Question 5 category", answer: "B/E/G", acceptedAnswers: ["B", "E", "G", "b", "e", "g"] },
    { id: "module-d1-listening-q6", number: 6, prompt: "Question 6 category", answer: "B/E/G", acceptedAnswers: ["B", "E", "G", "b", "e", "g"] },
    { id: "module-d1-listening-q7", number: 7, prompt: "Number of something needed", answer: "64", acceptedAnswers: ["64", "sixty-four", "sixty four"] },
    { id: "module-d1-listening-q8", number: 8, prompt: "Part of a computer", answer: "sound card", acceptedAnswers: ["sound card", "a sound card"] },
    { id: "module-d1-listening-q9", number: 9, prompt: "Date", answer: "January", acceptedAnswers: ["January", "in January"] },
    { id: "module-d1-listening-q10", number: 10, prompt: "Number", answer: "6", acceptedAnswers: ["6", "six"] },
  ],
};

export const moduleDListeningPage52: IeltsListeningPractice = {
  id: "ielts-listening-module-d-page-52-bali-art",
  module: "D",
  title: "Listening Studio: art and culture in Bali",
  bookPage: 52,
  answerKeyPage: 79,
  sourceNote: "Focus on Academic Skills for IELTS, Module D, Focus on listening 2 page 52. Audio mapping: CD1 Track 16.",
  instructions: "Dengarkan lecture singkat. Jawab no more than three words sesuai detail dari audio.",
  tracks: [{ id: "cd1-t16", path: "/audio/ielts/module-d/page-52/cd1-track-16.mp3", label: "CD1 Track 16", role: "Questions 1–10", durationSeconds: 432.6 }],
  questions: [
    { id: "module-d2-listening-q1", number: 1, prompt: "Country/people originally linked with Bali's early inhabitants", answer: "China", acceptedAnswers: ["China"] },
    { id: "module-d2-listening-q2", number: 2, prompt: "Powerful group in the historical overview", answer: "the ruling families", acceptedAnswers: ["the ruling families", "ruling families"] },
    { id: "module-d2-listening-q3", number: 3, prompt: "Historical process involving foreign power", answer: "colonisation", acceptedAnswers: ["colonisation", "colonization"] },
    { id: "module-d2-listening-q4", number: 4, prompt: "Modern industry affecting the island", answer: "tourism", acceptedAnswers: ["tourism"] },
    { id: "module-d2-listening-q5", number: 5, prompt: "Type of life/art scenes", answer: "everyday life", acceptedAnswers: ["everyday life"] },
    { id: "module-d2-listening-q6", number: 6, prompt: "Training not usually needed", answer: "formal training", acceptedAnswers: ["formal training"] },
    { id: "module-d2-listening-q7", number: 7, prompt: "Reason linked with productivity", answer: "fertility", acceptedAnswers: ["fertility", "rich soil", "fertility rich soil"] },
    { id: "module-d2-listening-q8", number: 8, prompt: "Cultural/religious factor", answer: "religion", acceptedAnswers: ["religion"] },
    { id: "module-d2-listening-q9", number: 9, prompt: "How art is often produced", answer: "group", acceptedAnswers: ["group", "in a group"] },
    { id: "module-d2-listening-q10", number: 10, prompt: "Opposite of ephemeral", answer: "permanent", acceptedAnswers: ["permanent"] },
  ],
};

export const moduleCReadingPage34: IeltsReadingPractice = {
  id: "ielts-reading-module-c-page-34-time-culture",
  module: "C",
  title: "Reading Lab: time and culture",
  bookPage: 34,
  answerKeyPage: 76,
  instructions: "Gunakan ringkasan bukti untuk menjawab. Ini latihan ringkas dari Module C Reading, bukan salinan teks penuh.",
  evidenceSummary: [
    "The text compares how different cultures understand time, punctuality, and waiting.",
    "Researchers mentioned include Edward Hall, Robert Levine, and Kevin Birth.",
    "Kevin Birth's Trinidad research links attitudes to time with language, relationships, work, and social power.",
  ],
  questions: [
    { id: "module-c-reading-q1", number: 1, prompt: "Which researcher is linked with Trinidad?", answer: "Kevin Birth", acceptedAnswers: ["Kevin Birth", "Birth"] },
    { id: "module-c-reading-q2", number: 2, prompt: "Which researcher is linked with measuring speed at postal counters?", answer: "Robert Levine", acceptedAnswers: ["Robert Levine", "Levine"] },
    { id: "module-c-reading-q3", number: 3, prompt: "Which researcher is named first in the question set?", answer: "Edward Hall", acceptedAnswers: ["Edward Hall", "Hall"] },
    { id: "module-c-reading-q4", number: 4, prompt: "In Birth's research, whose days were dictated by natural events?", answer: "rural residents", acceptedAnswers: ["rural residents", "farmers"] },
    { id: "module-c-reading-q5", number: 5, prompt: "What phrase describes Australian Aboriginal time in the summary?", answer: "Dreamtime", acceptedAnswers: ["Dreamtime"] },
    { id: "module-c-reading-q6", number: 6, prompt: "What object can time be compared to in some cultures?", answer: "wheel", acceptedAnswers: ["wheel", "a wheel"] },
  ],
};

export const moduleDReadingPage49: IeltsReadingPractice = {
  id: "ielts-reading-module-d-page-49-exhibits",
  module: "D",
  title: "Reading Lab: museums and exhibits",
  bookPage: 49,
  answerKeyPage: 78,
  instructions: "Gunakan ringkasan bukti untuk latihan awal. Jawaban diadaptasi dari kunci Module D Reading.",
  evidenceSummary: [
    "The reading discusses historical exhibits and research connected with museums and conservation.",
    "Several questions ask which paragraphs contain information such as cleaning exhibits, broken fragments, and research findings.",
    "Key details include dust levels, visitors, microscopic slides, and analysed material.",
  ],
  questions: [
    { id: "module-d-reading-q1", number: 1, prompt: "What issue is connected with keeping exhibits clean?", answer: "time and expense", acceptedAnswers: ["time and expense", "time expense", "time and money"] },
    { id: "module-d-reading-q2", number: 2, prompt: "What are broken small pieces called?", answer: "fragments", acceptedAnswers: ["fragments"] },
    { id: "module-d-reading-q3", number: 3, prompt: "What cleaner is mentioned in the answer notes?", answer: "vacuum cleaner", acceptedAnswers: ["vacuum cleaner", "a vacuum cleaner"] },
    { id: "module-d-reading-q4", number: 4, prompt: "What levels were indicated in the research findings?", answer: "dust levels", acceptedAnswers: ["dust levels"] },
    { id: "module-d-reading-q5", number: 5, prompt: "Who or what did the research involve besides objects?", answer: "visitors", acceptedAnswers: ["visitors"] },
    { id: "module-d-reading-q6", number: 6, prompt: "What kind of slides are mentioned?", answer: "microscopic slides", acceptedAnswers: ["microscopic slides", "microscope slides"] },
  ],
};
