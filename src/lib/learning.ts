import { curriculumByLanguage } from "@/data/curriculum";
import type { ContentCatalog, Exercise, LanguageCode, Lesson, LocalDate, PersistedState, QuizAnswer, QuizEvent, QuizState, SessionResult } from "@/lib/types";

export const STORAGE_KEY = "tycon:v1";
export const languageNames: Record<LanguageCode, string> = { id: "Bahasa Indonesia", en: "English", "zh-Hans": "简体中文" };
const label = (text: string) => ({ id: text, en: text, "zh-Hans": text });
const utterance = (language: LanguageCode, text: string, romanization?: string) => ({ language, text, ...(romanization ? { romanization } : {}) });
const permutation = (order: readonly string[], tokens: readonly string[]) => {
  const used = new Set<number>();
  return order.map(text => { const index = tokens.findIndex((token, i) => token === text && !used.has(i)); used.add(index); return index; });
};

export function buildCatalog(): ContentCatalog {
  const courses: ContentCatalog["courses"] = [], units: ContentCatalog["units"] = [], lessons: Lesson[] = [], exercises: Exercise[] = [];
  const languages: LanguageCode[] = ["id", "en", "zh-Hans"];
  for (const target of languages) for (const source of languages) {
    if (source === target) continue;
    const courseId = `course-${source}-${target}`, unitId = `unit-${source}-${target}`;
    const pairLessons = curriculumByLanguage[target].slice(0, 2);
    courses.push({ id: courseId, sourceLanguage: source, targetLanguage: target, title: label(`${languageNames[source]} → ${languageNames[target]}`), description: label("A first journey through greetings and introductions."), unitIds: [unitId] });
    const lessonIds = pairLessons.map(item => item.id);
    units.push({ id: unitId, courseId, title: label("First discoveries"), lessonIds });
    for (const seed of pairLessons) {
      lessons.push({ id: seed.id, courseId, unitId, title: label(seed.title), exerciseIds: seed.exercises.map(x => x.id) });
      const word = seed.vocabulary[0];
      const targetLang = target;
      const sourceText = target === "en" ? word.translation : word.translation;
      const choiceOptions = seed.exercises[0];
      const options = choiceOptions.type === "multiple-choice" ? choiceOptions.options : [];
      exercises.push({ id: seed.exercises[0].id, lessonId: seed.id, kind: "choice", instruction: utterance(source, "Choose the best meaning."), prompt: utterance(targetLang, `What does “${word.term}” mean?`, word.pronunciation), explanation: utterance(source, `“${word.term}” means “${sourceText}”.`), options: options.map(option => ({ id: option.id, text: utterance(source, option.text) })), correctOptionId: "a" });
      const order = seed.exercises[1];
      const tokens = order.type === "word-order" ? order.tokens : [];
      const ids = tokens.map((_, i) => `token-${i}`);
      const intended = order.type === "word-order" ? permutation(order.correctOrder, tokens) : [];
      exercises.push({ id: seed.exercises[1].id, lessonId: seed.id, kind: "order", instruction: utterance(source, "Build the phrase in the right order."), prompt: utterance(source, `Put the words in order: “${seed.phrase.translation}”`), explanation: utterance(source, `The phrase means “${seed.phrase.translation}”.`), tokens: tokens.map((text, i) => ({ id: ids[i], text: utterance(targetLang, text) })), correctTokenIds: intended.map(i => ids[i]) });
      const match = seed.vocabulary;
      exercises.push({ id: seed.exercises[2].id, lessonId: seed.id, kind: "choice", instruction: utterance(source, "Choose the matching meaning."), prompt: utterance(targetLang, `What does “${match[1].term}” mean?`, match[1].pronunciation), explanation: utterance(source, `“${match[1].term}” means “${match[1].translation}”.`), options: [{ id: "correct", text: utterance(source, match[1].translation) }, { id: "wrong-a", text: utterance(source, match[0].translation) }, { id: "wrong-b", text: utterance(source, match[2].translation) }], correctOptionId: "correct" });
      const phraseOrder = seed.exercises[1];
      const phraseTokens = phraseOrder.type === "word-order" ? phraseOrder.correctOrder : [];
      const shuffled = phraseOrder.type === "word-order" ? phraseOrder.tokens : [];
      const phraseIds = shuffled.map((_, i) => `phrase-${i}`);
      const correctPhrase = permutation(phraseTokens, shuffled);
      exercises.push({ id: seed.exercises[3].id, lessonId: seed.id, kind: "order", instruction: utterance(source, "Arrange the phrase."), prompt: utterance(source, `Build: “${seed.phrase.translation}”`), explanation: utterance(source, `“${seed.phrase.target}” means “${seed.phrase.translation}”.`), tokens: shuffled.map((text, i) => ({ id: phraseIds[i], text: utterance(targetLang, text) })), correctTokenIds: correctPhrase.map(i => phraseIds[i]) });
    }
  }
  return { version: "tycon-catalog-1", courses, units, lessons, exercises };
}
export const catalog = buildCatalog();
export const emptyState = (): PersistedState => ({ schemaVersion: 1, profile: null, completedSessions: {}, activeSession: null });
export function readState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed || parsed.schemaVersion !== 1 || !parsed.completedSessions || typeof parsed.completedSessions !== "object" || Array.isArray(parsed.completedSessions)) return emptyState();
    if (parsed.profile && (!(["id", "en", "zh-Hans"] as string[]).includes(parsed.profile.sourceLanguage) || !(["id", "en", "zh-Hans"] as string[]).includes(parsed.profile.targetLanguage) || parsed.profile.sourceLanguage === parsed.profile.targetLanguage)) return emptyState();
    for (const [id, result] of Object.entries(parsed.completedSessions)) {
      if (!result || result.sessionId !== id || !catalog.lessons.some(lesson => lesson.id === result.lessonId) || !catalog.courses.some(course => course.id === result.courseId)) return emptyState();
    }
    if (parsed.activeSession) {
      const active = parsed.activeSession;
      if ((active.phase !== "question" && active.phase !== "feedback") || !active.session || active.session.catalogVersion !== catalog.version || !catalog.lessons.some(lesson => lesson.id === active.session.lessonId && lesson.courseId === active.session.courseId) || active.session.exerciseIds.some(id => !catalog.exercises.some(exercise => exercise.id === id))) parsed.activeSession = null;
    }
    return parsed;
  } catch { return emptyState(); }
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
    if (!exercise || event.answer.kind !== exercise.kind) return state;
    const answer = event.answer;
    if (answer.kind === "choice") {
      if (exercise.kind !== "choice" || !exercise.options.some(option => option.id === answer.optionId)) return state;
    } else if (exercise.kind !== "order" || answer.tokenIds.some(id => !exercise.tokens.some(token => token.id === id)) || new Set(answer.tokenIds).size !== answer.tokenIds.length) return state;
    return { ...state, draft: event.answer };
  }
  if (state.phase === "question" && event.type === "SUBMIT" && state.draft) {
    const exercise = catalog.exercises.find(item => item.id === state.session.exerciseIds[state.index]);
    if (!exercise || (state.draft.kind === "order" && (exercise.kind !== "order" || state.draft.tokenIds.length !== exercise.tokens.length))) return state;
    const record = { exerciseId: exercise.id, answer: state.draft, isCorrect: grade(exercise, state.draft), submittedAt: now.toISOString() };
    return { phase: "feedback", session: { ...state.session, answers: [...state.session.answers, record] }, index: state.index, record };
  }
  if (state.phase === "feedback" && event.type === "CONTINUE") {
    if (state.index + 1 < state.session.exerciseIds.length) return { phase: "question", session: state.session, index: state.index + 1, draft: null };
    return { phase: "complete", result: { sessionId: state.session.id, courseId: state.session.courseId, lessonId: state.session.lessonId, catalogVersion: catalog.version, startedAt: state.session.startedAt, completedAt: now.toISOString(), completedOn: localDate(now), answers: state.session.answers, correctCount: state.session.answers.filter(a => a.isCorrect).length, questionCount: state.session.exerciseIds.length, xpEarned: 0 } };
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
  const cursor = new Date(); const today = localDate(cursor); if (!dates.has(today)) cursor.setDate(cursor.getDate() - 1);
  let count = 0; while (dates.has(localDate(cursor))) { count++; cursor.setDate(cursor.getDate() - 1); } return count;
}
