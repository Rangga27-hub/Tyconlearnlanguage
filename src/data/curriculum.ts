/**
 * Stable, local seed content for Tycon's first beginner learning paths.
 * Translations are English glosses; `pronunciation` is supplied for Mandarin.
 */
export type LanguageCode = "id" | "en" | "zh-Hans";

export type VocabularyItem = {
  id: string;
  term: string;
  translation: string;
  pronunciation?: string;
};

export type MultipleChoiceExercise = {
  id: string;
  type: "multiple-choice";
  prompt: string;
  options: readonly { id: string; text: string }[];
  correctOptionId: string;
};
export type WordOrderExercise = {
  id: string;
  type: "word-order";
  prompt: string;
  tokens: readonly string[];
  correctOrder: readonly string[];
};
export type MatchingExercise = {
  id: string;
  type: "matching";
  prompt: string;
  pairs: readonly { id: string; left: string; right: string }[];
};
export type ListeningSimulationExercise = {
  id: string;
  type: "listening-simulation";
  prompt: string;
  simulatedAudioText: string;
  pronunciation?: string;
  answer: string;
};
export type Exercise =
  | MultipleChoiceExercise
  | WordOrderExercise
  | MatchingExercise
  | ListeningSimulationExercise;

export type LessonSeed = {
  id: string;
  language: LanguageCode;
  level: "beginner";
  order: number;
  title: string;
  objective: string;
  vocabulary: readonly VocabularyItem[];
  phrase: { target: string; translation: string; pronunciation?: string };
  exercises: readonly Exercise[];
};

type LessonSource = Omit<LessonSeed, "level" | "vocabulary" | "phrase" | "exercises"> & {
  words: readonly [VocabularyItem, VocabularyItem, VocabularyItem];
  phrase: LessonSeed["phrase"];
  orderTokens: readonly string[];
  distractors: readonly [string, string, string];
};

/** Each lesson deliberately includes all four interaction modes with deterministic IDs. */
const makeLesson = ({ words, phrase, orderTokens, distractors, ...source }: LessonSource): LessonSeed => ({
  ...source,
  level: "beginner",
  vocabulary: words,
  phrase,
  exercises: [
    {
      id: `${source.id}-mc-01`, type: "multiple-choice",
      prompt: `What does “${words[0].term}” mean?`,
      options: [
        { id: "a", text: words[0].translation }, { id: "b", text: distractors[0] },
        { id: "c", text: distractors[1] }, { id: "d", text: distractors[2] },
      ], correctOptionId: "a",
    },
    {
      id: `${source.id}-order-01`, type: "word-order",
      prompt: `Put the words in order: “${phrase.translation}”`,
      tokens: [...orderTokens].reverse(), correctOrder: orderTokens,
    },
    {
      id: `${source.id}-match-01`, type: "matching", prompt: "Match each word to its meaning.",
      pairs: words.map((word, index) => ({ id: `pair-${index + 1}`, left: word.term, right: word.translation })),
    },
    {
      id: `${source.id}-listen-01`, type: "listening-simulation",
      prompt: "Listen to the simulated audio and type what you hear.",
      simulatedAudioText: phrase.target, pronunciation: phrase.pronunciation, answer: phrase.target,
    },
  ],
});

const indonesianLessons = [
  makeLesson({ id: "id-beginner-01-greetings", language: "id", order: 1, title: "Greetings", objective: "Greet someone politely.", words: [{ id: "id-hello", term: "halo", translation: "hello" }, { id: "id-good-morning", term: "selamat pagi", translation: "good morning" }, { id: "id-thank-you", term: "terima kasih", translation: "thank you" }], phrase: { target: "Halo, apa kabar?", translation: "Hello, how are you?" }, orderTokens: ["Halo,", "apa", "kabar?"], distractors: ["goodbye", "please", "friend"] }),
  makeLesson({ id: "id-beginner-02-introductions", language: "id", order: 2, title: "Introductions", objective: "Say your name.", words: [{ id: "id-name", term: "nama", translation: "name" }, { id: "id-i", term: "saya", translation: "I" }, { id: "id-you", term: "Anda", translation: "you" }], phrase: { target: "Nama saya Ana.", translation: "My name is Ana." }, orderTokens: ["Nama", "saya", "Ana."], distractors: ["city", "teacher", "water"] }),
  makeLesson({ id: "id-beginner-03-numbers", language: "id", order: 3, title: "Numbers", objective: "Recognize numbers one to three.", words: [{ id: "id-one", term: "satu", translation: "one" }, { id: "id-two", term: "dua", translation: "two" }, { id: "id-three", term: "tiga", translation: "three" }], phrase: { target: "Saya punya dua buku.", translation: "I have two books." }, orderTokens: ["Saya", "punya", "dua", "buku."], distractors: ["four", "red", "tomorrow"] }),
  makeLesson({ id: "id-beginner-04-food", language: "id", order: 4, title: "Food and drink", objective: "Name everyday food and drink.", words: [{ id: "id-water", term: "air", translation: "water" }, { id: "id-rice", term: "nasi", translation: "rice" }, { id: "id-tea", term: "teh", translation: "tea" }], phrase: { target: "Saya minum air.", translation: "I drink water." }, orderTokens: ["Saya", "minum", "air."], distractors: ["bread", "coffee", "milk"] }),
  makeLesson({ id: "id-beginner-05-places", language: "id", order: 5, title: "Places", objective: "Ask where a place is.", words: [{ id: "id-school", term: "sekolah", translation: "school" }, { id: "id-home", term: "rumah", translation: "home" }, { id: "id-market", term: "pasar", translation: "market" }], phrase: { target: "Di mana sekolah?", translation: "Where is the school?" }, orderTokens: ["Di", "mana", "sekolah?"], distractors: ["when", "why", "who"] }),
  makeLesson({ id: "id-beginner-06-colors", language: "id", order: 6, title: "Colors", objective: "Describe a basic color.", words: [{ id: "id-red", term: "merah", translation: "red" }, { id: "id-blue", term: "biru", translation: "blue" }, { id: "id-white", term: "putih", translation: "white" }], phrase: { target: "Buku itu biru.", translation: "That book is blue." }, orderTokens: ["Buku", "itu", "biru."], distractors: ["green", "small", "warm"] }),
  makeLesson({ id: "id-beginner-07-routine", language: "id", order: 7, title: "Daily routine", objective: "Talk about a simple routine.", words: [{ id: "id-eat", term: "makan", translation: "eat" }, { id: "id-sleep", term: "tidur", translation: "sleep" }, { id: "id-work", term: "bekerja", translation: "work" }], phrase: { target: "Saya bekerja hari ini.", translation: "I work today." }, orderTokens: ["Saya", "bekerja", "hari", "ini."], distractors: ["read", "walk", "listen"] }),
  makeLesson({ id: "id-beginner-08-help", language: "id", order: 8, title: "Simple help", objective: "Ask for help politely.", words: [{ id: "id-help", term: "tolong", translation: "help / please" }, { id: "id-yes", term: "ya", translation: "yes" }, { id: "id-no", term: "tidak", translation: "no" }], phrase: { target: "Tolong bantu saya.", translation: "Please help me." }, orderTokens: ["Tolong", "bantu", "saya."], distractors: ["wait", "stop", "welcome"] }),
] as const;

const englishLessons = [
  makeLesson({ id: "en-beginner-01-greetings", language: "en", order: 1, title: "Greetings", objective: "Greet someone politely.", words: [{ id: "en-hello", term: "hello", translation: "a greeting" }, { id: "en-good-morning", term: "good morning", translation: "a morning greeting" }, { id: "en-thanks", term: "thank you", translation: "an expression of gratitude" }], phrase: { target: "Hello, how are you?", translation: "Hello, how are you?" }, orderTokens: ["Hello,", "how", "are", "you?"], distractors: ["a farewell", "a question about place", "a color"] }),
  makeLesson({ id: "en-beginner-02-introductions", language: "en", order: 2, title: "Introductions", objective: "Say your name.", words: [{ id: "en-name", term: "name", translation: "a person's identifying word" }, { id: "en-my", term: "my", translation: "belonging to me" }, { id: "en-you", term: "you", translation: "the person addressed" }], phrase: { target: "My name is Ana.", translation: "My name is Ana." }, orderTokens: ["My", "name", "is", "Ana."], distractors: ["a number", "a meal", "a building"] }),
  makeLesson({ id: "en-beginner-03-numbers", language: "en", order: 3, title: "Numbers", objective: "Recognize numbers one to three.", words: [{ id: "en-one", term: "one", translation: "1" }, { id: "en-two", term: "two", translation: "2" }, { id: "en-three", term: "three", translation: "3" }], phrase: { target: "I have two books.", translation: "I have two books." }, orderTokens: ["I", "have", "two", "books."], distractors: ["4", "a color", "a day"] }),
  makeLesson({ id: "en-beginner-04-food", language: "en", order: 4, title: "Food and drink", objective: "Name everyday food and drink.", words: [{ id: "en-water", term: "water", translation: "a drink" }, { id: "en-rice", term: "rice", translation: "a grain food" }, { id: "en-tea", term: "tea", translation: "a hot or cold drink" }], phrase: { target: "I drink water.", translation: "I drink water." }, orderTokens: ["I", "drink", "water."], distractors: ["a place", "a color", "a person"] }),
  makeLesson({ id: "en-beginner-05-places", language: "en", order: 5, title: "Places", objective: "Ask where a place is.", words: [{ id: "en-school", term: "school", translation: "a place to learn" }, { id: "en-home", term: "home", translation: "a place where one lives" }, { id: "en-market", term: "market", translation: "a place to buy goods" }], phrase: { target: "Where is the school?", translation: "Where is the school?" }, orderTokens: ["Where", "is", "the", "school?"], distractors: ["a drink", "a number", "a greeting"] }),
  makeLesson({ id: "en-beginner-06-colors", language: "en", order: 6, title: "Colors", objective: "Describe a basic color.", words: [{ id: "en-red", term: "red", translation: "the color of a stop sign" }, { id: "en-blue", term: "blue", translation: "a primary color" }, { id: "en-white", term: "white", translation: "a very light color" }], phrase: { target: "The book is blue.", translation: "The book is blue." }, orderTokens: ["The", "book", "is", "blue."], distractors: ["a food", "a place", "a verb"] }),
  makeLesson({ id: "en-beginner-07-routine", language: "en", order: 7, title: "Daily routine", objective: "Talk about a simple routine.", words: [{ id: "en-eat", term: "eat", translation: "to have food" }, { id: "en-sleep", term: "sleep", translation: "to rest at night" }, { id: "en-work", term: "work", translation: "to do a job" }], phrase: { target: "I work today.", translation: "I work today." }, orderTokens: ["I", "work", "today."], distractors: ["to sing", "to swim", "to write"] }),
  makeLesson({ id: "en-beginner-08-help", language: "en", order: 8, title: "Simple help", objective: "Ask for help politely.", words: [{ id: "en-please", term: "please", translation: "a polite request word" }, { id: "en-yes", term: "yes", translation: "an affirmative answer" }, { id: "en-no", term: "no", translation: "a negative answer" }], phrase: { target: "Please help me.", translation: "Please help me." }, orderTokens: ["Please", "help", "me."], distractors: ["a color", "a place", "a number"] }),
] as const;

const mandarinLessons = [
  makeLesson({ id: "zh-hans-beginner-01-greetings", language: "zh-Hans", order: 1, title: "Greetings", objective: "Greet someone politely.", words: [{ id: "zh-nihao", term: "你好", translation: "hello", pronunciation: "nǐ hǎo" }, { id: "zh-zaoshanghao", term: "早上好", translation: "good morning", pronunciation: "zǎoshang hǎo" }, { id: "zh-xiexie", term: "谢谢", translation: "thank you", pronunciation: "xièxie" }], phrase: { target: "你好，你好吗？", translation: "Hello, how are you?", pronunciation: "nǐ hǎo, nǐ hǎo ma?" }, orderTokens: ["你", "好，", "你", "好", "吗？"], distractors: ["goodbye", "please", "friend"] }),
  makeLesson({ id: "zh-hans-beginner-02-introductions", language: "zh-Hans", order: 2, title: "Introductions", objective: "Say your name.", words: [{ id: "zh-name", term: "名字", translation: "name", pronunciation: "míngzi" }, { id: "zh-i", term: "我", translation: "I", pronunciation: "wǒ" }, { id: "zh-you", term: "你", translation: "you", pronunciation: "nǐ" }], phrase: { target: "我叫安娜。", translation: "My name is Ana.", pronunciation: "wǒ jiào Ānnà." }, orderTokens: ["我", "叫", "安娜。"], distractors: ["city", "teacher", "water"] }),
  makeLesson({ id: "zh-hans-beginner-03-numbers", language: "zh-Hans", order: 3, title: "Numbers", objective: "Recognize numbers one to three.", words: [{ id: "zh-one", term: "一", translation: "one", pronunciation: "yī" }, { id: "zh-two", term: "二", translation: "two", pronunciation: "èr" }, { id: "zh-three", term: "三", translation: "three", pronunciation: "sān" }], phrase: { target: "我有两本书。", translation: "I have two books.", pronunciation: "wǒ yǒu liǎng běn shū." }, orderTokens: ["我", "有", "两", "本", "书。"], distractors: ["four", "red", "tomorrow"] }),
  makeLesson({ id: "zh-hans-beginner-04-food", language: "zh-Hans", order: 4, title: "Food and drink", objective: "Name everyday food and drink.", words: [{ id: "zh-water", term: "水", translation: "water", pronunciation: "shuǐ" }, { id: "zh-rice", term: "米饭", translation: "rice", pronunciation: "mǐfàn" }, { id: "zh-tea", term: "茶", translation: "tea", pronunciation: "chá" }], phrase: { target: "我喝水。", translation: "I drink water.", pronunciation: "wǒ hē shuǐ." }, orderTokens: ["我", "喝", "水。"], distractors: ["bread", "coffee", "milk"] }),
  makeLesson({ id: "zh-hans-beginner-05-places", language: "zh-Hans", order: 5, title: "Places", objective: "Ask where a place is.", words: [{ id: "zh-school", term: "学校", translation: "school", pronunciation: "xuéxiào" }, { id: "zh-home", term: "家", translation: "home", pronunciation: "jiā" }, { id: "zh-market", term: "市场", translation: "market", pronunciation: "shìchǎng" }], phrase: { target: "学校在哪里？", translation: "Where is the school?", pronunciation: "xuéxiào zài nǎlǐ?" }, orderTokens: ["学校", "在", "哪里？"], distractors: ["when", "why", "who"] }),
  makeLesson({ id: "zh-hans-beginner-06-colors", language: "zh-Hans", order: 6, title: "Colors", objective: "Describe a basic color.", words: [{ id: "zh-red", term: "红色", translation: "red", pronunciation: "hóngsè" }, { id: "zh-blue", term: "蓝色", translation: "blue", pronunciation: "lánsè" }, { id: "zh-white", term: "白色", translation: "white", pronunciation: "báisè" }], phrase: { target: "那本书是蓝色的。", translation: "That book is blue.", pronunciation: "nà běn shū shì lánsè de." }, orderTokens: ["那", "本", "书", "是", "蓝色", "的。"], distractors: ["green", "small", "warm"] }),
  makeLesson({ id: "zh-hans-beginner-07-routine", language: "zh-Hans", order: 7, title: "Daily routine", objective: "Talk about a simple routine.", words: [{ id: "zh-eat", term: "吃", translation: "eat", pronunciation: "chī" }, { id: "zh-sleep", term: "睡觉", translation: "sleep", pronunciation: "shuìjiào" }, { id: "zh-work", term: "工作", translation: "work", pronunciation: "gōngzuò" }], phrase: { target: "我今天工作。", translation: "I work today.", pronunciation: "wǒ jīntiān gōngzuò." }, orderTokens: ["我", "今天", "工作。"], distractors: ["read", "walk", "listen"] }),
  makeLesson({ id: "zh-hans-beginner-08-help", language: "zh-Hans", order: 8, title: "Simple help", objective: "Ask for help politely.", words: [{ id: "zh-help", term: "请", translation: "please", pronunciation: "qǐng" }, { id: "zh-yes", term: "是的", translation: "yes", pronunciation: "shì de" }, { id: "zh-no", term: "不", translation: "no / not", pronunciation: "bù" }], phrase: { target: "请帮帮我。", translation: "Please help me.", pronunciation: "qǐng bāngbang wǒ." }, orderTokens: ["请", "帮帮", "我。"], distractors: ["wait", "stop", "welcome"] }),
] as const;

export const curriculum: readonly LessonSeed[] = [...indonesianLessons, ...englishLessons, ...mandarinLessons];

export const curriculumByLanguage: Readonly<Record<LanguageCode, readonly LessonSeed[]>> = {
  id: indonesianLessons,
  en: englishLessons,
  "zh-Hans": mandarinLessons,
};
