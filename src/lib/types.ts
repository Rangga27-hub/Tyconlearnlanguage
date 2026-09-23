/** Shared contracts for Tycon's local-first language-learning MVP. */

export const LANGUAGES = ["id", "en", "zh-Hans"] as const;
export type LanguageCode = (typeof LANGUAGES)[number];

/** IDs are stable, opaque strings; do not derive them from translated labels. */
export type CourseId = string;
export type UnitId = string;
export type LessonId = string;
export type ExerciseId = string;
export type SessionId = string;
export type ISODateTime = string; // ISO 8601 UTC instant, e.g. 2026-01-02T03:04:05.000Z
export type LocalDate = string; // YYYY-MM-DD in the learner's local calendar

/** A single utterance in its actual language (not necessarily the UI language). */
export interface LanguageText {
  language: LanguageCode;
  text: string;
  romanization?: string; // Optional pronunciation aid, notably pinyin for zh-Hans
}

/** UI/catalog labels must exist for all three UI languages. */
export type LocalizedLabel = Record<LanguageCode, string>;

export interface LearningPair {
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
}

export interface Course extends LearningPair {
  id: CourseId;
  title: LocalizedLabel;
  description: LocalizedLabel;
  unitIds: UnitId[]; // Ordered; must resolve to units in this course
}

export interface Unit {
  id: UnitId;
  courseId: CourseId;
  title: LocalizedLabel;
  lessonIds: LessonId[]; // Ordered; must resolve to lessons in this unit
}

export interface Lesson {
  id: LessonId;
  unitId: UnitId;
  courseId: CourseId;
  title: LocalizedLabel;
  exerciseIds: ExerciseId[]; // Ordered; at least one; must resolve to exercises in this lesson
}

interface ExerciseBase {
  id: ExerciseId;
  lessonId: LessonId;
  /** Instruction is in the course source language; prompt may be in either language. */
  instruction: LanguageText;
  prompt: LanguageText;
  /** Shown only after submission; give a constructive reason, not just a verdict. */
  explanation: LanguageText;
}

export interface ChoiceExercise extends ExerciseBase {
  kind: "choice";
  options: { id: string; text: LanguageText }[]; // Unique IDs, 2-4 options
  correctOptionId: string;
}

export interface OrderExercise extends ExerciseBase {
  kind: "order";
  tokens: { id: string; text: LanguageText }[]; // Unique IDs; repeats in text are OK
  correctTokenIds: string[]; // Exact permutation of token IDs, in answer order
}

export type Exercise = ChoiceExercise | OrderExercise;

/** Content is bundled with the app; changing version invalidates incompatible active sessions. */
export interface ContentCatalog {
  version: string;
  courses: Course[];
  units: Unit[];
  lessons: Lesson[];
  exercises: Exercise[];
}

export type QuizAnswer =
  | { kind: "choice"; optionId: string }
  | { kind: "order"; tokenIds: string[] };

export interface AnswerRecord {
  exerciseId: ExerciseId;
  answer: QuizAnswer;
  isCorrect: boolean;
  submittedAt: ISODateTime;
}

export interface QuizSession {
  id: SessionId; // UUID, generated once at START; idempotency key at completion
  courseId: CourseId;
  lessonId: LessonId;
  catalogVersion: string;
  exerciseIds: ExerciseId[]; // Snapshot of ordered IDs at START
  startedAt: ISODateTime;
  answers: AnswerRecord[]; // Submitted answers only, ordered by exerciseIds
}

/** Index is zero-based; feedback includes the answer already appended to session.answers. */
export type QuizState =
  | { phase: "idle" }
  | { phase: "question"; session: QuizSession; index: number; draft: QuizAnswer | null }
  | { phase: "feedback"; session: QuizSession; index: number; record: AnswerRecord }
  | { phase: "complete"; result: SessionResult };

export type ActiveQuizState = Extract<QuizState, { phase: "question" | "feedback" }>;

export type QuizEvent =
  | { type: "START"; courseId: CourseId; lessonId: LessonId }
  | { type: "SET_DRAFT"; answer: QuizAnswer }
  | { type: "SUBMIT" }
  | { type: "CONTINUE" }
  | { type: "QUIT" };

export interface SessionResult {
  sessionId: SessionId;
  courseId: CourseId;
  lessonId: LessonId;
  catalogVersion: string;
  startedAt: ISODateTime;
  completedAt: ISODateTime;
  completedOn: LocalDate;
  answers: AnswerRecord[];
  correctCount: number;
  questionCount: number;
  xpEarned: number;
}

export interface LearnerProfile extends LearningPair {
  id: string; // Device-local UUID; not an account or a server identity
  uiLanguage: LanguageCode;
  dailyGoal: number; // XP target, default 12
  createdAt: ISODateTime;
}

/** Derived from completedSessions, not separately stored. */
export interface LessonProgress {
  lessonId: LessonId;
  attempts: number;
  bestCorrectCount: number;
  questionCount: number;
  lastCompletedAt: ISODateTime | null;
}

export interface ProgressSummary {
  totalXp: number;
  todayXp: number;
  streakDays: number;
  completedLessonIds: LessonId[];
  lessons: Record<LessonId, LessonProgress>;
}

/** Only this envelope is written to localStorage (key: tycon:v1). */
export interface PersistedState {
  schemaVersion: 1;
  profile: LearnerProfile | null;
  completedSessions: Record<SessionId, SessionResult>;
  activeSession: ActiveQuizState | null;
}
