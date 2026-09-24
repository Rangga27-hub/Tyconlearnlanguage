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
  module: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "I" | "J";
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
  module: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "I" | "J";
  title: string;
  bookPage: number;
  answerKeyPage: number;
  instructions: string;
  questions: readonly IeltsShortAnswerQuestion[];
};

export type IeltsReadingPractice = {
  id: string;
  module: "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";
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
  {
    id: "ielts-grammar-module-e-language-review",
    module: "E",
    title: "Language Review E: water, waste, and environment",
    bookPage: 71,
    answerKeyPage: 81,
    instructions: "Isi vocabulary lingkungan dari Language Review E.",
    questions: [
      { id: "grammar-e-q1", number: 1, prompt: "A high standard or characteristic", answer: "quality", acceptedAnswers: ["quality"] },
      { id: "grammar-e-q2", number: 2, prompt: "A shortage of something needed", answer: "shortage", acceptedAnswers: ["shortage"] },
      { id: "grammar-e-q3", number: 3, prompt: "Water used for consumption", answer: "drinking", acceptedAnswers: ["drinking", "drinking water"] },
      { id: "grammar-e-q4", number: 4, prompt: "Material no longer wanted", answer: "waste", acceptedAnswers: ["waste"] },
      { id: "grammar-e-q5", number: 5, prompt: "Rain from the sky", answer: "rain", acceptedAnswers: ["rain"] },
      { id: "grammar-e-q6", number: 6, prompt: "System that removes water", answer: "drainage system", acceptedAnswers: ["drainage system"] },
      { id: "grammar-e-q7", number: 7, prompt: "Facility for reusing materials", answer: "recycling plant", acceptedAnswers: ["recycling plant"] },
    ],
  },
  {
    id: "ielts-grammar-module-f-language-review",
    module: "F",
    title: "Language Review F: university and systems",
    bookPage: 82,
    answerKeyPage: 82,
    instructions: "Isi vocabulary akademik seputar university, study modes, dan systems.",
    questions: [
      { id: "grammar-f-q1", number: 1, prompt: "Part of a university organisation", answer: "department", acceptedAnswers: ["department"] },
      { id: "grammar-f-q2", number: 2, prompt: "Formal university talks", answer: "lectures", acceptedAnswers: ["lectures", "lecture"] },
      { id: "grammar-f-q3", number: 3, prompt: "Small-group academic meetings", answer: "seminars", acceptedAnswers: ["seminars", "seminar"] },
      { id: "grammar-f-q4", number: 4, prompt: "Small teaching sessions", answer: "tutorials", acceptedAnswers: ["tutorials", "tutorial"] },
      { id: "grammar-f-q5", number: 5, prompt: "A unit of learning", answer: "class", acceptedAnswers: ["class"] },
      { id: "grammar-f-q6", number: 6, prompt: "Learning done by accessing resources yourself", answer: "self-access centre", acceptedAnswers: ["self-access centre", "self-access center"] },
      { id: "grammar-f-q7", number: 7, prompt: "Academic topics studied", answer: "subjects", acceptedAnswers: ["subjects", "subject"] },
    ],
  },
  {
    id: "ielts-grammar-module-g-language-review",
    module: "G",
    title: "Language Review G: ICT and media",
    bookPage: 98,
    answerKeyPage: 84,
    instructions: "Isi vocabulary seputar communication technology dan media.",
    questions: [
      { id: "grammar-g-q1", number: 1, prompt: "Information and communication technologies", answer: "ICTs", acceptedAnswers: ["ICTs", "ICT"] },
      { id: "grammar-g-q2", number: 2, prompt: "Electronic mail", answer: "e-mail", acceptedAnswers: ["e-mail", "email"] },
      { id: "grammar-g-q3", number: 3, prompt: "Global web system", answer: "World Wide Web", acceptedAnswers: ["World Wide Web", "web"] },
      { id: "grammar-g-q4", number: 4, prompt: "Gap between people with and without digital access", answer: "Digital Divide", acceptedAnswers: ["Digital Divide", "digital divide"] },
      { id: "grammar-g-q5", number: 5, prompt: "Phone support workplaces", answer: "call centres", acceptedAnswers: ["call centres", "call centers"] },
      { id: "grammar-g-q6", number: 6, prompt: "A named low-cost computer", answer: "Simputer", acceptedAnswers: ["Simputer"] },
    ],
  },
  {
    id: "ielts-grammar-module-h-language-review",
    module: "H",
    title: "Language Review H: GM crops and ecology",
    bookPage: 104,
    answerKeyPage: 85,
    instructions: "Isi vocabulary Module H tentang GM crops, ecology, dan conservation.",
    questions: [
      { id: "grammar-h-q1", number: 1, prompt: "Genetically modified crops", answer: "GM crops", acceptedAnswers: ["GM crops", "genetically modified crops"] },
      { id: "grammar-h-q2", number: 2, prompt: "Plant dust used in reproduction", answer: "pollen", acceptedAnswers: ["pollen"] },
      { id: "grammar-h-q3", number: 3, prompt: "Chemical used to kill weeds", answer: "herbicide", acceptedAnswers: ["herbicide"] },
      { id: "grammar-h-q4", number: 4, prompt: "No longer existing", answer: "extinct", acceptedAnswers: ["extinct"] },
      { id: "grammar-h-q5", number: 5, prompt: "Breeding animals away from the wild", answer: "captive breeding", acceptedAnswers: ["captive breeding"] },
      { id: "grammar-h-q6", number: 6, prompt: "A tropical crop named in the key", answer: "cassava", acceptedAnswers: ["cassava"] },
    ],
  },
  {
    id: "ielts-grammar-module-i-language-review",
    module: "I",
    title: "Language Review I: tourism and transport",
    bookPage: 122,
    answerKeyPage: 87,
    instructions: "Isi vocabulary Module I tentang tourism, transport, dan social impact.",
    questions: [
      { id: "grammar-i-q1", number: 1, prompt: "Two-wheeled transport", answer: "bicycle", acceptedAnswers: ["bicycle", "bike"] },
      { id: "grammar-i-q2", number: 2, prompt: "Air vehicle", answer: "helicopter", acceptedAnswers: ["helicopter"] },
      { id: "grammar-i-q3", number: 3, prompt: "Pollution from vehicles", answer: "exhaust fumes", acceptedAnswers: ["exhaust fumes"] },
      { id: "grammar-i-q4", number: 4, prompt: "Crowded roads", answer: "traffic jams", acceptedAnswers: ["traffic jams", "jams"] },
      { id: "grammar-i-q5", number: 5, prompt: "Dedicated routes for buses", answer: "bus lanes", acceptedAnswers: ["bus lanes"] },
      { id: "grammar-i-q6", number: 6, prompt: "Travel over a large distance", answer: "long-distance travel", acceptedAnswers: ["long-distance travel", "long distance travel"] },
    ],
  },
  {
    id: "ielts-grammar-module-j-language-review",
    module: "J",
    title: "Language Review J: images and forensic science",
    bookPage: 134,
    answerKeyPage: 88,
    instructions: "Isi vocabulary Module J tentang portraits, photography, dan DNA.",
    questions: [
      { id: "grammar-j-q1", number: 1, prompt: "Part of the face below the eye", answer: "cheek", acceptedAnswers: ["cheek"] },
      { id: "grammar-j-q2", number: 2, prompt: "Front part of the head", answer: "forehead", acceptedAnswers: ["forehead"] },
      { id: "grammar-j-q3", number: 3, prompt: "Muscles used to build a face", answer: "facial muscles", acceptedAnswers: ["facial muscles"] },
      { id: "grammar-j-q4", number: 4, prompt: "Genetic material sample", answer: "DNA sample", acceptedAnswers: ["DNA sample", "dna sample"] },
      { id: "grammar-j-q5", number: 5, prompt: "Make an image larger", answer: "to enlarge", acceptedAnswers: ["to enlarge", "enlarge"] },
      { id: "grammar-j-q6", number: 6, prompt: "Digital image device", answer: "digital camera", acceptedAnswers: ["digital camera"] },
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

export const moduleEReadingPage65: IeltsReadingPractice = {
  id: "ielts-reading-module-e-page-65-titanic",
  module: "E",
  title: "Reading Lab: Titanic and deep-sea research",
  bookPage: 65,
  answerKeyPage: 80,
  instructions: "Latihan ringkas dari Module E Reading. Jawab berdasarkan detail kunci yang sudah diverifikasi.",
  evidenceSummary: [
    "The text discusses the Titanic, its size, sinking, casualties, and later underwater filming/research.",
    "Some claims are True/False, including whether it was the biggest of its time and whether it sank after hitting an iceberg.",
    "Later questions focus on rusticles, microbes, iron compounds, and paragraph matching.",
  ],
  questions: [
    { id: "module-e-reading-q1", number: 1, prompt: "Was the Titanic the biggest of its time?", answer: "False", acceptedAnswers: ["False", "F"] },
    { id: "module-e-reading-q2", number: 2, prompt: "Did it sink when it hit an iceberg?", answer: "True", acceptedAnswers: ["True", "T"] },
    { id: "module-e-reading-q3", number: 3, prompt: "How many people died according to the key?", answer: "1,523", acceptedAnswers: ["1,523", "1523"] },
    { id: "module-e-reading-q4", number: 4, prompt: "Who went down to the wreck and filmed it?", answer: "James Cameron", acceptedAnswers: ["James Cameron", "Cameron"] },
    { id: "module-e-reading-q5", number: 5, prompt: "What do rusticles look like?", answer: "underwater icicles", acceptedAnswers: ["underwater icicles", "icicles"] },
    { id: "module-e-reading-q6", number: 6, prompt: "What are microbes removing from the wreck?", answer: "iron", acceptedAnswers: ["iron"] },
  ],
};

export const moduleFReadingPage72: IeltsReadingPractice = {
  id: "ielts-reading-module-f-page-72-knowledge-workers",
  module: "F",
  title: "Reading Lab: knowledge workers",
  bookPage: 72,
  answerKeyPage: 81,
  instructions: "Latihan ringkas dari Module F Reading tentang education, knowledge workers, dan knowledge technologists.",
  evidenceSummary: [
    "The reading introduces knowledge workers and knowledge technologists in a changing economy.",
    "Questions include headings, paragraph matching, and True/False/Not Given style statements.",
    "Key vocabulary includes continuing education, role of women, and psychological pressures.",
  ],
  questions: [
    { id: "module-f-reading-q1", number: 1, prompt: "What type of worker is central to the text?", answer: "knowledge workers", acceptedAnswers: ["knowledge workers", "knowledge worker"] },
    { id: "module-f-reading-q2", number: 2, prompt: "What related worker type is mentioned?", answer: "knowledge technologists", acceptedAnswers: ["knowledge technologists", "knowledge technologist"] },
    { id: "module-f-reading-q3", number: 3, prompt: "What kind of education is highlighted?", answer: "continuing education", acceptedAnswers: ["continuing education"] },
    { id: "module-f-reading-q4", number: 4, prompt: "Which social topic is listed in the key?", answer: "role of women", acceptedAnswers: ["role of women", "the role of women"] },
    { id: "module-f-reading-q5", number: 5, prompt: "What kind of pressures are mentioned?", answer: "psychological pressures", acceptedAnswers: ["psychological pressures", "psychological pressure"] },
    { id: "module-f-reading-q6", number: 6, prompt: "Which answer is No Information in the key for statement 6?", answer: "NG", acceptedAnswers: ["NG", "Not Given", "not given"] },
  ],
};

export const moduleEListeningPage60: IeltsListeningPractice = {
  id: "ielts-listening-module-e-page-60-rotorua-tour",
  module: "E",
  title: "Listening Studio: Rotorua tour guide",
  bookPage: 60,
  answerKeyPage: 80,
  sourceNote: "Focus on Academic Skills for IELTS, Module E, Focus on listening page 60. Audio mapping: CD1 Track 17.",
  instructions: "Dengarkan tour guide tentang Rotorua. Beberapa jawaban berupa huruf pilihan dan beberapa berupa detail singkat.",
  tracks: [{ id: "cd1-t17", path: "/audio/ielts/module-e/page-60/cd1-track-17.mp3", label: "CD1 Track 17", role: "Questions 1–10", durationSeconds: 341.2 }],
  questions: [
    { id: "module-e-listening-q1", number: 1, prompt: "Question 1 option", answer: "B", acceptedAnswers: ["B", "b"] },
    { id: "module-e-listening-q2", number: 2, prompt: "Question 2 option", answer: "B", acceptedAnswers: ["B", "b"] },
    { id: "module-e-listening-q3", number: 3, prompt: "Question 3 option", answer: "A", acceptedAnswers: ["A", "a"] },
    { id: "module-e-listening-q4", number: 4, prompt: "Question 4 option", answer: "A", acceptedAnswers: ["A", "a"] },
    { id: "module-e-listening-q5", number: 5, prompt: "Question 5 option", answer: "B", acceptedAnswers: ["B", "b"] },
    { id: "module-e-listening-q6", number: 6, prompt: "Question 6 option", answer: "B", acceptedAnswers: ["B", "b"] },
    { id: "module-e-listening-q7", number: 7, prompt: "Question 7 option", answer: "A", acceptedAnswers: ["A", "a"] },
    { id: "module-e-listening-q8", number: 8, prompt: "Year mentioned", answer: "1886", acceptedAnswers: ["1886"] },
    { id: "module-e-listening-q9", number: 9, prompt: "Adult price", answer: "$25", acceptedAnswers: ["$25", "25"] },
    { id: "module-e-listening-q10", number: 10, prompt: "Traditional cooking uses hot ...", answer: "stones", acceptedAnswers: ["stones", "stone"] },
  ],
};

export const moduleFListeningPage76: IeltsListeningPractice = {
  id: "ielts-listening-module-f-page-76-computer-facilities",
  module: "F",
  title: "Listening Studio: computer facilities survey",
  bookPage: 76,
  answerKeyPage: 81,
  sourceNote: "Focus on Academic Skills for IELTS, Module F, Focus on listening page 76. Audio mapping: CD1 Track 21.",
  instructions: "Dengarkan tutorial tentang research project dan fasilitas komputer. Jawab detail singkat atau huruf pilihan.",
  tracks: [{ id: "cd1-t21", path: "/audio/ielts/module-f/page-76/cd1-track-21.mp3", label: "CD1 Track 21", role: "Questions 1–10", durationSeconds: 263.8 }],
  questions: [
    { id: "module-f-listening-q1", number: 1, prompt: "Who are the speakers/students involved?", answer: "Sami, Irene and tutor", acceptedAnswers: ["Sami Irene tutor", "Sami Irene and tutor", "Sami, Irene and tutor"] },
    { id: "module-f-listening-q2", number: 2, prompt: "What is the project about?", answer: "access to computer facilities", acceptedAnswers: ["access to computer facilities", "computer facilities"] },
    { id: "module-f-listening-q3", number: 3, prompt: "Question 3 option", answer: "A", acceptedAnswers: ["A", "a"] },
    { id: "module-f-listening-q4", number: 4, prompt: "Question 4 option", answer: "A", acceptedAnswers: ["A", "a"] },
    { id: "module-f-listening-q5", number: 5, prompt: "Question 5 option", answer: "C", acceptedAnswers: ["C", "c"] },
    { id: "module-f-listening-q6", number: 6, prompt: "Matching answer 6", answer: "B", acceptedAnswers: ["B", "b"] },
    { id: "module-f-listening-q7", number: 7, prompt: "Matching answer 7", answer: "D", acceptedAnswers: ["D", "d"] },
    { id: "module-f-listening-q8", number: 8, prompt: "Matching answer 8", answer: "F", acceptedAnswers: ["F", "f"] },
    { id: "module-f-listening-q9", number: 9, prompt: "Matching answer 9", answer: "E", acceptedAnswers: ["E", "e"] },
    { id: "module-f-listening-q10", number: 10, prompt: "Matching answer 10", answer: "G", acceptedAnswers: ["G", "g"] },
  ],
};

export const moduleGReadingPage88: IeltsReadingPractice = {
  id: "ielts-reading-module-g-page-88-ict",
  module: "G",
  title: "Reading Lab: communication technology",
  bookPage: 88,
  answerKeyPage: 83,
  instructions: "Latihan ringkas dari Module G Reading tentang information and communication technologies.",
  evidenceSummary: [
    "The text discusses information and communication technologies, e-mail, the World Wide Web, and access to digital resources.",
    "It contrasts benefits for economics, health, education, and government with concerns such as the digital divide.",
    "The answer key references the Information Village Project and Simputer as examples.",
  ],
  questions: [
    { id: "module-g-reading-q1", number: 1, prompt: "Which divide is mentioned as a key issue?", answer: "Digital Divide", acceptedAnswers: ["Digital Divide", "digital divide"] },
    { id: "module-g-reading-q2", number: 2, prompt: "Which project is named in the answer key?", answer: "Information Village Project", acceptedAnswers: ["Information Village Project"] },
    { id: "module-g-reading-q3", number: 3, prompt: "Which low-cost computer initiative is named?", answer: "Simputer", acceptedAnswers: ["Simputer"] },
    { id: "module-g-reading-q4", number: 4, prompt: "Which economic area is referenced?", answer: "Indian economy", acceptedAnswers: ["Indian economy"] },
    { id: "module-g-reading-q5", number: 5, prompt: "Which service industry appears in the key?", answer: "call centres", acceptedAnswers: ["call centres", "call centers"] },
    { id: "module-g-reading-q6", number: 6, prompt: "What web technology is explicitly mentioned?", answer: "World Wide Web", acceptedAnswers: ["World Wide Web", "the World Wide Web"] },
  ],
};

export const moduleHReadingPage103: IeltsReadingPractice = {
  id: "ielts-reading-module-h-page-103-gm-crops",
  module: "H",
  title: "Reading Lab: GM crops debate",
  bookPage: 103,
  answerKeyPage: 85,
  instructions: "Latihan ringkas dari Module H Reading tentang arguments for and against GM technology.",
  evidenceSummary: [
    "The text concerns GM technology and includes arguments for and against GM crops.",
    "The answer key notes that the writer is against GM crops and recommends more research before more crops are planted.",
    "Key terms include pollen, chemical pollution, herbicide, disease, and cassava.",
  ],
  questions: [
    { id: "module-h-reading-q1", number: 1, prompt: "What technology is debated in the text?", answer: "GM technology", acceptedAnswers: ["GM technology", "genetic modification", "GM crops"] },
    { id: "module-h-reading-q2", number: 2, prompt: "Is the writer for or against GM crops?", answer: "against", acceptedAnswers: ["against", "against GM crops"] },
    { id: "module-h-reading-q3", number: 3, prompt: "What does the writer recommend before more crops are planted?", answer: "more research", acceptedAnswers: ["more research", "research"] },
    { id: "module-h-reading-q4", number: 4, prompt: "What plant material is listed in the key?", answer: "pollen", acceptedAnswers: ["pollen"] },
    { id: "module-h-reading-q5", number: 5, prompt: "What kind of pollution is mentioned?", answer: "chemical pollution", acceptedAnswers: ["chemical pollution"] },
    { id: "module-h-reading-q6", number: 6, prompt: "Which crop is named in the vocabulary key?", answer: "cassava", acceptedAnswers: ["cassava"] },
  ],
};

export const moduleGListeningPage87: IeltsListeningPractice = {
  id: "ielts-listening-module-g-page-87-tv-repair",
  module: "G",
  title: "Listening Studio: electrical repair call",
  bookPage: 87,
  answerKeyPage: 83,
  sourceNote: "Focus on Academic Skills for IELTS, Module G, Focus on listening 1 page 87. Audio mapping: CD2 Track 2 for setup and CD2 Track 3 for questions 1–10.",
  instructions: "Dengarkan percakapan tentang TV repair. Jawab detail alamat, nomor, masalah, dan pilihan huruf.",
  tracks: [
    { id: "cd2-t02", path: "/audio/ielts/module-g/page-87/cd2-track-02.mp3", label: "CD2 Track 2", role: "Example / setup", durationSeconds: 38.7 },
    { id: "cd2-t03", path: "/audio/ielts/module-g/page-87/cd2-track-03.mp3", label: "CD2 Track 3", role: "Questions 1–10", durationSeconds: 319.3 },
  ],
  questions: [
    { id: "module-g1-listening-q1", number: 1, prompt: "Customer surname", answer: "Douglass", acceptedAnswers: ["Douglass", "Douglas"] },
    { id: "module-g1-listening-q2", number: 2, prompt: "Address", answer: "135 Park Hill Avenue", acceptedAnswers: ["135 Park Hill Avenue"] },
    { id: "module-g1-listening-q3", number: 3, prompt: "Phone number", answer: "765482", acceptedAnswers: ["765482", "765 482"] },
    { id: "module-g1-listening-q4", number: 4, prompt: "Problem with the TV", answer: "low volume", acceptedAnswers: ["low volume", "volume is low"] },
    { id: "module-g1-listening-q5", number: 5, prompt: "Cause/problem mentioned", answer: "power cut", acceptedAnswers: ["power cut", "a power cut"] },
    { id: "module-g1-listening-q6", number: 6, prompt: "Make/model detail", answer: "Schneider SVV5002", acceptedAnswers: ["Schneider SVV5002", "SVV5002", "Schneider"] },
    { id: "module-g1-listening-q7", number: 7, prompt: "Age", answer: "7 years old", acceptedAnswers: ["7 years old", "7 years"] },
    { id: "module-g1-listening-q8", number: 8, prompt: "Question 8 option", answer: "B", acceptedAnswers: ["B", "b"] },
    { id: "module-g1-listening-q9", number: 9, prompt: "Question 9 option", answer: "C", acceptedAnswers: ["C", "c"] },
    { id: "module-g1-listening-q10", number: 10, prompt: "Question 10 option", answer: "A", acceptedAnswers: ["A", "a"] },
  ],
};

export const moduleGListeningPage94: IeltsListeningPractice = {
  id: "ielts-listening-module-g-page-94-radio-programmes",
  module: "G",
  title: "Listening Studio: radio programmes",
  bookPage: 94,
  answerKeyPage: 84,
  sourceNote: "Focus on Academic Skills for IELTS, Module G, Focus on listening 2 page 94. Audio mapping: CD2 Track 4 and CD2 Track 5.",
  instructions: "Dengarkan radio announcer dan programme extract. Jawab times, programme names, dan details.",
  tracks: [
    { id: "cd2-t04", path: "/audio/ielts/module-g/page-94/cd2-track-04.mp3", label: "CD2 Track 4", role: "Questions 1–5", durationSeconds: 156.0 },
    { id: "cd2-t05", path: "/audio/ielts/module-g/page-94/cd2-track-05.mp3", label: "CD2 Track 5", role: "Questions 6–10", durationSeconds: 172.3 },
  ],
  questions: [
    { id: "module-g2-listening-q1", number: 1, prompt: "Time", answer: "7.50", acceptedAnswers: ["7.50", "7:50"] },
    { id: "module-g2-listening-q2", number: 2, prompt: "Programme name", answer: "Park Square", acceptedAnswers: ["Park Square"] },
    { id: "module-g2-listening-q3", number: 3, prompt: "Topic area", answer: "media", acceptedAnswers: ["media"] },
    { id: "module-g2-listening-q4", number: 4, prompt: "News category", answer: "News and weather", acceptedAnswers: ["News and weather", "news weather"] },
    { id: "module-g2-listening-q5", number: 5, prompt: "Which letter is mentioned?", answer: "first letter", acceptedAnswers: ["first letter"] },
    { id: "module-g2-listening-q6", number: 6, prompt: "Social bonds come before ...", answer: "strong", acceptedAnswers: ["strong"] },
    { id: "module-g2-listening-q7", number: 7, prompt: "Whales and elephants use their ...", answer: "brains", acceptedAnswers: ["brains", "brain"] },
    { id: "module-g2-listening-q8", number: 8, prompt: "Elephants produce ...", answer: "sound", acceptedAnswers: ["sound"] },
    { id: "module-g2-listening-q9", number: 9, prompt: "Whale communication includes ...", answer: "silent singing", acceptedAnswers: ["silent singing"] },
    { id: "module-g2-listening-q10", number: 10, prompt: "Elephants hear through their ...", answer: "feet", acceptedAnswers: ["feet"] },
  ],
};

export const moduleHListeningPage99: IeltsListeningPractice = {
  id: "ielts-listening-module-h-page-99-captive-breeding",
  module: "H",
  title: "Listening Studio: captive breeding essay",
  bookPage: 99,
  answerKeyPage: 85,
  sourceNote: "Focus on Academic Skills for IELTS, Module H, Focus on listening page 99. Audio mapping: CD2 Track 9 and CD2 Track 10.",
  instructions: "Dengarkan tutorial essay tentang captive breeding. Jawab ringkas dan pilihan huruf.",
  tracks: [
    { id: "cd2-t09", path: "/audio/ielts/module-h/page-99/cd2-track-09.mp3", label: "CD2 Track 9", role: "Questions 1–5", durationSeconds: 237.4 },
    { id: "cd2-t10", path: "/audio/ielts/module-h/page-99/cd2-track-10.mp3", label: "CD2 Track 10", role: "Questions 6–10", durationSeconds: 193.7 },
  ],
  questions: [
    { id: "module-h-listening-q1", number: 1, prompt: "Main purpose of the discussion", answer: "to discuss an essay", acceptedAnswers: ["to discuss an essay", "discuss an essay", "essay"] },
    { id: "module-h-listening-q2", number: 2, prompt: "Topic", answer: "captive breeding", acceptedAnswers: ["captive breeding", "breeding animals in captivity"] },
    { id: "module-h-listening-q3", number: 3, prompt: "Purpose: prevent species from becoming ...", answer: "extinct", acceptedAnswers: ["extinct"] },
    { id: "module-h-listening-q4", number: 4, prompt: "Where does the process probably take place?", answer: "zoos", acceptedAnswers: ["zoos", "zoo"] },
    { id: "module-h-listening-q5", number: 5, prompt: "Problem mentioned", answer: "disease", acceptedAnswers: ["disease"] },
    { id: "module-h-listening-q6", number: 6, prompt: "Question 6 option", answer: "A", acceptedAnswers: ["A", "a"] },
    { id: "module-h-listening-q7", number: 7, prompt: "Question 7 option", answer: "B", acceptedAnswers: ["B", "b"] },
    { id: "module-h-listening-q8", number: 8, prompt: "Question 8 option", answer: "C", acceptedAnswers: ["C", "c"] },
    { id: "module-h-listening-q9", number: 9, prompt: "Question 9 option", answer: "B", acceptedAnswers: ["B", "b"] },
    { id: "module-h-listening-q10", number: 10, prompt: "Question 10 option", answer: "A", acceptedAnswers: ["A", "a"] },
  ],
};

export const moduleIReadingPage112: IeltsReadingPractice = {
  id: "ielts-reading-module-i-page-112-hydrogen-buses",
  module: "I",
  title: "Reading Lab: hydrogen bus experiment",
  bookPage: 112,
  answerKeyPage: 86,
  instructions: "Latihan ringkas dari Module I Reading tentang eksperimen bus hydrogen dan transport bersih.",
  evidenceSummary: [
    "The text describes a European experiment involving buses that are non-polluting and use renewable energy sources.",
    "The answer key highlights hydrogen, fuel cells, wind power, renewable energy, and on-site hydrogen production.",
    "Several questions concern participating cities, congestion, infrastructure, and geographical conditions.",
  ],
  questions: [
    { id: "module-i-reading-q1", number: 1, prompt: "What region is the bus experiment in?", answer: "Europe", acceptedAnswers: ["Europe"] },
    { id: "module-i-reading-q2", number: 2, prompt: "How many cities participate?", answer: "nine", acceptedAnswers: ["nine", "9"] },
    { id: "module-i-reading-q3", number: 3, prompt: "What fuel is central to the experiment?", answer: "hydrogen", acceptedAnswers: ["hydrogen"] },
    { id: "module-i-reading-q4", number: 4, prompt: "Which renewable source is mentioned?", answer: "wind power", acceptedAnswers: ["wind power"] },
    { id: "module-i-reading-q5", number: 5, prompt: "Where is hydrogen produced?", answer: "on-site", acceptedAnswers: ["on-site", "on site"] },
    { id: "module-i-reading-q6", number: 6, prompt: "What traffic problem is named?", answer: "congested traffic", acceptedAnswers: ["congested traffic", "traffic congestion"] },
  ],
};

export const moduleJReadingPage126: IeltsReadingPractice = {
  id: "ielts-reading-module-j-page-126-dna-images",
  module: "J",
  title: "Reading Lab: DNA and forensic images",
  bookPage: 126,
  answerKeyPage: 88,
  instructions: "Latihan ringkas dari Module J Reading tentang DNA, forensic science, dan riset eye colour.",
  evidenceSummary: [
    "The answer key references DNA, forensics, DNAprint Genomics, University College London, University of Konstanz, and Liberty.",
    "One part discusses genetic research into eye colour and how DNA can support identification.",
    "Question formats include short answer, matching, and summary completion.",
  ],
  questions: [
    { id: "module-j-reading-q1", number: 1, prompt: "Which scientific material is central to the text?", answer: "DNA", acceptedAnswers: ["DNA", "dna"] },
    { id: "module-j-reading-q2", number: 2, prompt: "Which field applies DNA to criminal identification?", answer: "forensics", acceptedAnswers: ["forensics", "forensic science"] },
    { id: "module-j-reading-q3", number: 3, prompt: "What company is listed in the answer key?", answer: "DNAprint Genomics", acceptedAnswers: ["DNAprint Genomics"] },
    { id: "module-j-reading-q4", number: 4, prompt: "Which UK university is listed?", answer: "University College London", acceptedAnswers: ["University College London", "UCL"] },
    { id: "module-j-reading-q5", number: 5, prompt: "Which German university is listed?", answer: "University of Konstanz", acceptedAnswers: ["University of Konstanz", "Konstanz"] },
    { id: "module-j-reading-q6", number: 6, prompt: "Which human rights group is listed?", answer: "Liberty", acceptedAnswers: ["Liberty"] },
  ],
};

export const moduleIListeningPage117: IeltsListeningPractice = {
  id: "ielts-listening-module-i-page-117-tourism-impact",
  module: "I",
  title: "Listening Studio: tourism and host communities",
  bookPage: 117,
  answerKeyPage: 86,
  sourceNote: "Focus on Academic Skills for IELTS, Module I, Focus on listening page 117. Audio mapping: CD2 Track 14.",
  instructions: "Dengarkan lecture tentang tourism dan host communities. Jawab outline dan istilah kunci.",
  tracks: [{ id: "cd2-t14", path: "/audio/ielts/module-i/page-117/cd2-track-14.mp3", label: "CD2 Track 14", role: "Questions 1–10", durationSeconds: 411.4 }],
  questions: [
    { id: "module-i-listening-q1", number: 1, prompt: "What model is discussed?", answer: "Irridex", acceptedAnswers: ["Irridex", "Irritation Index"] },
    { id: "module-i-listening-q2", number: 2, prompt: "First stage label", answer: "euphoria", acceptedAnswers: ["euphoria"] },
    { id: "module-i-listening-q3", number: 3, prompt: "One early response to tourists", answer: "novelty", acceptedAnswers: ["novelty"] },
    { id: "module-i-listening-q4", number: 4, prompt: "Benefit in the second stage", answer: "economic benefits", acceptedAnswers: ["economic benefits", "economic benefit"] },
    { id: "module-i-listening-q5", number: 5, prompt: "A problem caused by tourism development", answer: "congestion", acceptedAnswers: ["congestion"] },
    { id: "module-i-listening-q6", number: 6, prompt: "Relationships can become very ...", answer: "negative", acceptedAnswers: ["negative"] },
    { id: "module-i-listening-q7", number: 7, prompt: "Traditional what may be revitalised?", answer: "crafts/skills", acceptedAnswers: ["crafts/skills", "traditional crafts", "traditional skills"] },
    { id: "module-i-listening-q8", number: 8, prompt: "Tourism can create openings for ...", answer: "women", acceptedAnswers: ["women"] },
    { id: "module-i-listening-q9", number: 9, prompt: "Tourism workers may acquire new ...", answer: "languages", acceptedAnswers: ["languages", "new languages"] },
    { id: "module-i-listening-q10", number: 10, prompt: "Final stage attitude in Doxey's model", answer: "antagonism", acceptedAnswers: ["antagonism"] },
  ],
};

export const moduleJListeningPage124: IeltsListeningPractice = {
  id: "ielts-listening-module-j-page-124-fayum-portraits",
  module: "J",
  title: "Listening Studio: Fayum portraits",
  bookPage: 124,
  answerKeyPage: 87,
  sourceNote: "Focus on Academic Skills for IELTS, Module J, Focus on listening page 124. Audio mapping: CD2 Track 15.",
  instructions: "Dengarkan lecture art history tentang Fayum portraits dan facial reconstruction.",
  tracks: [{ id: "cd2-t15", path: "/audio/ielts/module-j/page-124/cd2-track-15.mp3", label: "CD2 Track 15", role: "Questions 1–10", durationSeconds: 402.3 }],
  questions: [
    { id: "module-j-listening-q1", number: 1, prompt: "Which ancient civilisation is mentioned with Rome?", answer: "Greece", acceptedAnswers: ["Greece"] },
    { id: "module-j-listening-q2", number: 2, prompt: "Where was the picture placed on the mummy?", answer: "over the face", acceptedAnswers: ["over the face"] },
    { id: "module-j-listening-q3", number: 3, prompt: "What material was applied with a spatula?", answer: "wax", acceptedAnswers: ["wax"] },
    { id: "module-j-listening-q4", number: 4, prompt: "When were the portraits thought to be painted?", answer: "during life", acceptedAnswers: ["during life", "in life", "during lifetime", "in lifetime"] },
    { id: "module-j-listening-q5", number: 5, prompt: "The portraits were more ... than mummy casings", answer: "realistic", acceptedAnswers: ["realistic", "more realistic"] },
    { id: "module-j-listening-q6", number: 6, prompt: "Where may portraits have hung?", answer: "inside the houses", acceptedAnswers: ["inside the houses", "in the houses"] },
    { id: "module-j-listening-q7", number: 7, prompt: "Question 7 option", answer: "B", acceptedAnswers: ["B", "b"] },
    { id: "module-j-listening-q8", number: 8, prompt: "Question 8 option", answer: "A", acceptedAnswers: ["A", "a"] },
    { id: "module-j-listening-q9", number: 9, prompt: "Question 9 option", answer: "C", acceptedAnswers: ["C", "c"] },
    { id: "module-j-listening-q10", number: 10, prompt: "Question 10 option", answer: "A", acceptedAnswers: ["A", "a"] },
  ],
};
