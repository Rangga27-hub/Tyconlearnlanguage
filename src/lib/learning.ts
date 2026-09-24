import { curriculumByLanguage } from "@/data/curriculum";
import type { ActiveQuizState, ContentCatalog, Exercise, LanguageCode, Lesson, LocalDate, PersistedState, QuizAnswer, QuizEvent, QuizState, SessionResult } from "@/lib/types";

export const STORAGE_KEY = "tycon:v1";
export const languageNames: Record<LanguageCode, string> = { id: "Bahasa Indonesia", en: "English" };

const localizedLanguageNames: Record<LanguageCode, Record<LanguageCode, string>> = {
  id: { id: "Bahasa Indonesia", en: "Indonesian" },
  en: { id: "Bahasa Inggris", en: "English" },
};
const lessonTitles: Record<string, Record<LanguageCode, string>> = {
  Greetings: { id: "Salam", en: "Greetings" },
  Introductions: { id: "Perkenalan", en: "Introductions" },
};
const glosses: Record<Exclude<LanguageCode, "en">, Record<string, string>> = {
  id: {
    hello: "halo", "good morning": "selamat pagi", "thank you": "terima kasih", goodbye: "selamat tinggal", please: "tolong", friend: "teman",
    name: "nama", I: "saya", you: "Anda", city: "kota", teacher: "guru", water: "air",
    "a greeting": "sebuah salam", "a morning greeting": "salam pagi", "an expression of gratitude": "ungkapan terima kasih",
    "a farewell": "sebuah ucapan perpisahan", "a question about place": "pertanyaan tentang tempat", "a color": "sebuah warna",
    "a person's identifying word": "kata yang mengidentifikasi seseorang", "belonging to me": "milik saya", "the person addressed": "orang yang diajak bicara",
    "a number": "sebuah angka", "a meal": "sebuah hidangan", "a building": "sebuah bangunan",
  },
};
const phrases: Record<string, Record<LanguageCode, string>> = {
  "Hello, how are you?": { id: "Halo, apa kabar?", en: "Hello, how are you?" },
  "My name is Ana.": { id: "Nama saya Ana.", en: "My name is Ana." },
};
const copy: Record<LanguageCode, { choose: string; order: string; match: string; arrange: string; means: (term: string, meaning: string) => string; build: (meaning: string) => string; phrase: (target: string, meaning: string) => string }> = {
  en: { choose: "Choose the best meaning.", order: "Build the phrase in the right order.", match: "Choose the matching meaning.", arrange: "Arrange the phrase.", means: (term, meaning) => `“${term}” means “${meaning}”.`, build: meaning => `Put the words in order: “${meaning}”`, phrase: (target, meaning) => `“${target}” means “${meaning}”.` },
  id: { choose: "Pilih arti yang paling tepat.", order: "Susun frasa dengan urutan yang benar.", match: "Pilih arti yang sesuai.", arrange: "Susun frasa ini.", means: (term, meaning) => `“${term}” berarti “${meaning}”.`, build: meaning => `Susun kata-kata untuk membentuk: “${meaning}”`, phrase: (target, meaning) => `“${target}” berarti “${meaning}”.` },
};
const label = (values: Record<LanguageCode, string>) => values;
const utterance = (language: LanguageCode, text: string) => ({ language, text });
const localizeGloss = (text: string, language: LanguageCode) => language === "en" ? text : glosses[language][text] ?? text;
const localizePhrase = (text: string, language: LanguageCode) => phrases[text]?.[language] ?? text;
const permutation = (order: readonly string[], tokens: readonly string[]) => {
  const used = new Set<number>();
  return order.map(text => {
    const index = tokens.findIndex((token, i) => token === text && !used.has(i));
    if (index < 0) throw new Error(`Invalid curriculum token: ${text}`);
    used.add(index);
    return index;
  });
};

export function buildCatalog(): ContentCatalog {
  const courses: ContentCatalog["courses"] = [], units: ContentCatalog["units"] = [], lessons: Lesson[] = [], exercises: Exercise[] = [];
  const source: LanguageCode = "id";
  const target: LanguageCode = "en";
    const courseId = `course-${source}-${target}`, unitId = `unit-${source}-${target}`;
    const pairLessons = curriculumByLanguage.en;
    courses.push({
      id: courseId,
      sourceLanguage: source,
      targetLanguage: target,
      title: label({ id: `${localizedLanguageNames[source].id} → ${localizedLanguageNames[target].id}`, en: `${localizedLanguageNames[source].en} → ${localizedLanguageNames[target].en}` }),
      description: label({ id: "Perjalanan pertama melalui salam dan perkenalan.", en: "A first journey through greetings and introductions." }),
      unitIds: [unitId],
    });
    const lessonIds = pairLessons.map(seed => `${courseId}:${seed.id}`);
    units.push({ id: unitId, courseId, title: label({ id: "Penemuan pertama", en: "First discoveries" }), lessonIds });
    pairLessons.forEach((seed, lessonIndex) => {
      const lessonId = lessonIds[lessonIndex];
      const exerciseIds = seed.exercises.map(item => `${lessonId}:${item.id}`);
      lessons.push({ id: lessonId, courseId, unitId, title: lessonTitles[seed.title] ?? label({ id: seed.title, en: seed.title }), exerciseIds });
      const targetLang = target;
      const word = seed.vocabulary[0];
      const choiceSeed = seed.exercises[0];
      const choiceOptions = choiceSeed.type === "multiple-choice" ? choiceSeed.options : [];
      const wordMeaning = localizeGloss(word.translation, source);
      exercises.push({ id: exerciseIds[0], lessonId, kind: "choice", instruction: utterance(source, copy[source].choose), prompt: utterance(targetLang, word.term), explanation: utterance(source, copy[source].means(word.term, wordMeaning)), options: choiceOptions.map(option => ({ id: option.id, text: utterance(source, localizeGloss(option.text, source)) })), correctOptionId: choiceSeed.type === "multiple-choice" ? choiceSeed.correctOptionId : "a" });
      const orderSeed = seed.exercises[1];
      const tokens = orderSeed.type === "word-order" ? orderSeed.tokens : [];
      const ids = tokens.map((_, i) => `token-${i}`);
      const intended = orderSeed.type === "word-order" ? permutation(orderSeed.correctOrder, tokens) : [];
      const phraseMeaning = localizePhrase(seed.phrase.translation, source);
      exercises.push({ id: exerciseIds[1], lessonId, kind: "order", instruction: utterance(source, copy[source].order), prompt: utterance(source, copy[source].build(phraseMeaning)), explanation: utterance(source, copy[source].phrase(seed.phrase.target, phraseMeaning)), tokens: tokens.map((text, i) => ({ id: ids[i], text: utterance(targetLang, text) })), correctTokenIds: intended.map(i => ids[i]) });
      const match = seed.vocabulary;
      const matchMeaning = localizeGloss(match[1].translation, source);
      exercises.push({ id: exerciseIds[2], lessonId, kind: "choice", instruction: utterance(source, copy[source].match), prompt: utterance(targetLang, match[1].term), explanation: utterance(source, copy[source].means(match[1].term, matchMeaning)), options: [{ id: "correct", text: utterance(source, matchMeaning) }, { id: "wrong-a", text: utterance(source, localizeGloss(match[0].translation, source)) }, { id: "wrong-b", text: utterance(source, localizeGloss(match[2].translation, source)) }], correctOptionId: "correct" });
      const shuffled = orderSeed.type === "word-order" ? orderSeed.tokens : [];
      const correctOrder = orderSeed.type === "word-order" ? orderSeed.correctOrder : [];
      const phraseIds = shuffled.map((_, i) => `phrase-${i}`);
      const correctPhrase = permutation(correctOrder, shuffled);
      exercises.push({ id: exerciseIds[3], lessonId, kind: "order", instruction: utterance(source, copy[source].arrange), prompt: utterance(source, copy[source].build(phraseMeaning)), explanation: utterance(source, copy[source].phrase(seed.phrase.target, phraseMeaning)), tokens: shuffled.map((text, i) => ({ id: phraseIds[i], text: utterance(targetLang, text) })), correctTokenIds: correctPhrase.map(i => phraseIds[i]) });
    });
  return { version: "tycon-catalog-2", courses, units, lessons, exercises };
}

export const catalog = buildCatalog();
export const emptyState = (): PersistedState => ({ schemaVersion: 1, profile: null, completedSessions: {}, activeSession: null });
let recoveryNotice = "";
export function consumeRecoveryNotice() { const message = recoveryNotice; recoveryNotice = ""; return message; }
const isObject = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const isDate = (value: unknown): value is string => typeof value === "string" && !Number.isNaN(Date.parse(value));
const isLocalDate = (value: unknown): value is LocalDate => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
const answerIsValid = (answer: unknown, exercise: Exercise, allowPartial = false): answer is QuizAnswer => {
  if (!isObject(answer) || answer.kind !== exercise.kind) return false;
  if (exercise.kind === "choice") return typeof answer.optionId === "string" && exercise.options.some(option => option.id === answer.optionId);
  if (!Array.isArray(answer.tokenIds) || answer.tokenIds.some(id => typeof id !== "string") || new Set(answer.tokenIds).size !== answer.tokenIds.length || answer.tokenIds.some(id => !exercise.tokens.some(token => token.id === id))) return false;
  return allowPartial || answer.tokenIds.length === exercise.tokens.length;
};
const validResult = (value: unknown, key: string): value is SessionResult => {
  if (!isObject(value) || value.sessionId !== key || typeof value.courseId !== "string" || typeof value.lessonId !== "string") return false;
  const lesson = catalog.lessons.find(item => item.id === value.lessonId && item.courseId === value.courseId);
  if (!lesson || value.catalogVersion !== catalog.version || !isDate(value.startedAt) || !isDate(value.completedAt) || !isLocalDate(value.completedOn)) return false;
  if (!Array.isArray(value.answers) || value.answers.length !== lesson.exerciseIds.length || value.questionCount !== lesson.exerciseIds.length || !Number.isInteger(value.correctCount) || typeof value.xpEarned !== "number" || !Number.isFinite(value.xpEarned)) return false;
  let correctCount = 0;
  for (let index = 0; index < value.answers.length; index++) {
    const record = value.answers[index], exercise = catalog.exercises.find(item => item.id === lesson.exerciseIds[index]);
    if (!exercise || !isObject(record) || record.exerciseId !== exercise.id || typeof record.isCorrect !== "boolean" || !isDate(record.submittedAt) || !answerIsValid(record.answer, exercise) || record.isCorrect !== grade(exercise, record.answer)) return false;
    if (record.isCorrect) correctCount++;
  }
  return value.correctCount === correctCount && (value.xpEarned === 0 || value.xpEarned === 10 + 2 * correctCount);
};
const validActive = (value: unknown, profile: PersistedState["profile"]): value is ActiveQuizState => {
  if (!profile || !isObject(value) || (value.phase !== "question" && value.phase !== "feedback") || !isObject(value.session) || typeof value.index !== "number") return false;
  const session = value.session;
  const activeIndex = value.index;
  const course = catalog.courses.find(item => item.id === session.courseId && item.sourceLanguage === profile.sourceLanguage && item.targetLanguage === profile.targetLanguage);
  const lesson = catalog.lessons.find(item => item.id === session.lessonId && item.courseId === course?.id);
  if (!course || !lesson || session.catalogVersion !== catalog.version || !Array.isArray(session.exerciseIds) || !isDate(session.startedAt) || typeof session.id !== "string" || !Array.isArray(session.answers)) return false;
  const exerciseIds = session.exerciseIds;
  const answers = session.answers;
  if (exerciseIds.length !== lesson.exerciseIds.length || exerciseIds.some((id, i) => id !== lesson.exerciseIds[i])) return false;
  if (!Number.isInteger(activeIndex) || activeIndex < 0 || activeIndex >= exerciseIds.length) return false;
  const expectedAnswers = value.phase === "feedback" ? activeIndex + 1 : activeIndex;
  if (answers.length !== expectedAnswers) return false;
  for (let index = 0; index < answers.length; index++) {
    const record = answers[index], exercise = catalog.exercises.find(item => item.id === exerciseIds[index]);
    if (!exercise || !isObject(record) || record.exerciseId !== exercise.id || typeof record.isCorrect !== "boolean" || !isDate(record.submittedAt) || !answerIsValid(record.answer, exercise) || record.isCorrect !== grade(exercise, record.answer)) return false;
  }
  const current = catalog.exercises.find(item => item.id === exerciseIds[activeIndex]);
  if (!current) return false;
  if (value.phase === "question") return value.draft === null || answerIsValid(value.draft, current, true);
  const savedRecord = answers[activeIndex];
  return isObject(savedRecord) && isObject(value.record) && value.record.exerciseId === savedRecord.exerciseId && value.record.isCorrect === savedRecord.isCorrect && value.record.submittedAt === savedRecord.submittedAt && answerIsValid(value.record.answer, current) && JSON.stringify(value.record.answer) === JSON.stringify(savedRecord.answer);
};

export function readState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed: unknown = JSON.parse(raw);
    if (!isObject(parsed) || parsed.schemaVersion !== 1 || !isObject(parsed.completedSessions)) throw new Error("invalid envelope");
    let profile: PersistedState["profile"] = null;
    if (parsed.profile !== null) {
      if (!isObject(parsed.profile) || typeof parsed.profile.id !== "string" || typeof parsed.profile.sourceLanguage !== "string" || !parsed.profile.sourceLanguage || typeof parsed.profile.targetLanguage !== "string" || !parsed.profile.targetLanguage || parsed.profile.sourceLanguage === parsed.profile.targetLanguage || !isDate(parsed.profile.createdAt)) throw new Error("invalid profile");
      profile = { id: parsed.profile.id, sourceLanguage: "id", targetLanguage: "en", uiLanguage: "en", dailyGoal: [8, 12, 20, 30].includes(Number(parsed.profile.dailyGoal)) ? Number(parsed.profile.dailyGoal) : 12, createdAt: parsed.profile.createdAt };
    }
    const completedSessions: PersistedState["completedSessions"] = {};
    for (const [id, result] of Object.entries(parsed.completedSessions)) {
      if (validResult(result, id)) completedSessions[id] = result;
      else recoveryNotice = "Some outdated progress could not be restored, but your profile is safe.";
    }
    const activeSession = validActive(parsed.activeSession, profile) ? parsed.activeSession : null;
    if (parsed.activeSession && !activeSession) recoveryNotice = "An outdated lesson was closed safely. Choose a lesson to continue.";
    return { schemaVersion: 1, profile, completedSessions, activeSession };
  } catch {
    recoveryNotice = "Saved data could not be read, so Tycon opened a fresh local journal.";
    return emptyState();
  }
}

export function localDate(date = new Date()): LocalDate { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
export function grade(exercise: Exercise, answer: QuizAnswer) {
  return exercise.kind === "choice" ? answer.kind === "choice" && answer.optionId === exercise.correctOptionId : answer.kind === "order" && answer.tokenIds.length === exercise.correctTokenIds.length && answer.tokenIds.every((id, i) => id === exercise.correctTokenIds[i]);
}
export function quizReducer(state: QuizState, event: QuizEvent, now = new Date()): QuizState {
  if (event.type === "START" && (state.phase === "idle" || state.phase === "complete")) {
    const lesson = catalog.lessons.find(item => item.id === event.lessonId), course = catalog.courses.find(item => item.id === event.courseId);
    if (!lesson || !course || lesson.courseId !== course.id) return state;
    return { phase: "question", index: 0, draft: null, session: { id: crypto.randomUUID(), courseId: course.id, lessonId: lesson.id, catalogVersion: catalog.version, exerciseIds: [...lesson.exerciseIds], startedAt: now.toISOString(), answers: [] } };
  }
  if (state.phase === "question" && event.type === "SET_DRAFT") {
    const exercise = catalog.exercises.find(item => item.id === state.session.exerciseIds[state.index]);
    if (!exercise || !answerIsValid(event.answer, exercise, true)) return state;
    return { ...state, draft: event.answer };
  }
  if (state.phase === "question" && event.type === "SUBMIT" && state.draft) {
    const exercise = catalog.exercises.find(item => item.id === state.session.exerciseIds[state.index]);
    if (!exercise || !answerIsValid(state.draft, exercise)) return state;
    const record = { exerciseId: exercise.id, answer: state.draft, isCorrect: grade(exercise, state.draft), submittedAt: now.toISOString() };
    return { phase: "feedback", session: { ...state.session, answers: [...state.session.answers, record] }, index: state.index, record };
  }
  if (state.phase === "feedback" && event.type === "CONTINUE") {
    if (state.index + 1 < state.session.exerciseIds.length) return { phase: "question", session: state.session, index: state.index + 1, draft: null };
    return { phase: "complete", result: { sessionId: state.session.id, courseId: state.session.courseId, lessonId: state.session.lessonId, catalogVersion: catalog.version, startedAt: state.session.startedAt, completedAt: now.toISOString(), completedOn: localDate(now), answers: state.session.answers, correctCount: state.session.answers.filter(answer => answer.isCorrect).length, questionCount: state.session.exerciseIds.length, xpEarned: 0 } };
  }
  if ((state.phase === "question" || state.phase === "feedback") && event.type === "QUIT") return { phase: "idle" };
  return state;
}
export function award(state: PersistedState, result: SessionResult): SessionResult {
  const first = !Object.values(state.completedSessions).some(saved => saved.lessonId === result.lessonId);
  return { ...result, xpEarned: first ? 10 + 2 * result.correctCount : 0 };
}
export function lessonProgress(state: PersistedState) { return new Set(Object.values(state.completedSessions).map(result => result.lessonId)); }
export function totalXp(state: PersistedState) { return Object.values(state.completedSessions).reduce((sum, result) => sum + result.xpEarned, 0); }
export function streak(state: PersistedState) {
  const dates = new Set(Object.values(state.completedSessions).map(result => result.completedOn));
  const cursor = new Date();
  if (!dates.has(localDate(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (dates.has(localDate(cursor))) { count++; cursor.setDate(cursor.getDate() - 1); }
  return count;
}
