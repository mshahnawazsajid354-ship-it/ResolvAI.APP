// Layer 1 & 15: Core Data Models and Domain Types

export type StageId = 'stage-a' | 'stage-b' | 'stage-c';

export type CognitiveMode = 'Reflective' | 'Analytical' | 'Expressive';

export type CommunicationGoal = 
  | 'express-thoughts'
  | 'improve-professional'
  | 'practise-english'
  | 'prepare-interviews'
  | 'storytelling-persuasion'
  | 'everyday-communication'
  | 'explore-weaknesses';

export interface UserPreferences {
  preferredFormat: 'text' | 'voice';
  sessionLengthMinutes: number; // e.g. 5, 10, 15
  dailyReminder: boolean;
  reminderTime?: string;
  initialConfidenceRating?: number; // 1 to 10
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  directCritiqueMode: boolean; // Layer 10: Harsh/Direct Critique toggle
  aiProvider: 'offline-heuristic' | 'gemini' | 'openai';
  apiKey?: string;
  aiPersona?: string; // Background & personality extracted from ChatGPT/Claude/Gemini
}

export interface UserProfile {
  id: string;
  displayName: string;
  goals: CommunicationGoal[];
  preferences: UserPreferences;
  onboardingCompleted: boolean;
  roadmapDays: 30 | 60 | 90;
  createdAt: string;
  updatedAt: string;
}

export interface GuidelineStep {
  label: string; // e.g., 'G - Greet'
  instruction: string;
  example?: string;
}

export interface GuidelineFramework {
  type: 'GAIN' | 'STANDARD'; // GAIN or Opener -> Context -> Insight -> Closure
  title: string;
  objective: string;
  whyItMatters: string;
  steps: GuidelineStep[];
  illustrativeExample: string;
  commonMistakeToAvoid: string;
}

export interface DrillConfig {
  targetSkill: string;
  reason: string;
  instruction: string;
  completionCriteria: string;
  placeholder?: string;
}

export interface Topic {
  id: string; // e.g., 'topic-day-1'
  dayNumber: number; // 1 to 30 (extensible to 90)
  stage: StageId;
  stageTitle: string; // e.g., "Stage A: Foundation & Self-Expression"
  title: string;
  objective: string;
  difficulty: 'Comfort' | 'Challenge' | 'Command';
  cognitiveMode: CognitiveMode;
  categoryTag: 'Personal' | 'Professional' | 'Interpersonal' | 'Leadership';
  context: string;
  instructions: string;
  guidelines: GuidelineFramework;
  suggestedCompletionMinutes: number;
  extensionQuestion?: string;
  suggestedDrill: DrillConfig;
}

export type AttemptType = 'original' | 'revised' | 'attempt-1' | 'attempt-2' | 'attempt-3';

export interface SoundComparison {
  howItIsSounding: {
    toneDiagnosis: string;
    impressionOnListener: string;
    fillerOrHesitationImpact: string;
  };
  howItShouldSound: {
    polishedAIModelVoice: string;
    structuralUpgradeExplanation: string;
    keyShiftsMade: string[];
  };
}

export interface KeyChange {
  category: 'Clarity & Brevity' | 'Structure & Flow' | 'Fluency & Phrasing' | 'Context & Authority';
  explanation: string;
  beforeSnippet?: string;
  afterSnippet?: string;
}

export interface SentenceDiff {
  sentenceNumber: number;
  original: string;
  enhanced: string;
  changesMade: string[];
}

export interface AIImprovedVersion {
  improvedResponse: string;
  originalResponsePreserved: string;
  meaningPreservationNote: string;
  keyChanges: KeyChange[];
  sentenceDiffs?: SentenceDiff[];
  contextSuitability: string;
  benchmarkScores?: {
    clarity: number;
    structure: number;
    specificity: number;
    language: number;
    overall: number;
  };
}

export interface DimensionScore {
  score: number | null; // 0-100 or null if unavailable
  explanation: string;
  evidence: string; // Observable quote/segment from user input
  isUnavailable?: boolean;
  unavailableReason?: string;
}

export interface EvaluationRubric {
  rubricVersion: string; // e.g. "v1.0-standard"
  overallScore: number | null; // Simple average of available dimensions
  dimensions: {
    clarity: DimensionScore;
    structureAndFlow: DimensionScore;
    specificity: DimensionScore;
    languageEffectiveness: DimensionScore;
  };
  overallAssessment: string;
  strongestElement: string;
  mainImprovementPriority: string;
  toneAssessment?: string;
  concreteExamples: string[];
  aiAssistedExample?: string;
  targetedDrill: DrillConfig;
  retryInstruction: string;
  soundComparison?: SoundComparison;
  aiImprovedVersion?: AIImprovedVersion;
  gain_checklist?: {
    greet: boolean;
    acknowledge: boolean;
    insight: boolean;
    navigateOut: boolean;
    quotes?: {
      greet?: string;
      acknowledge?: string;
      insight?: string;
      navigateOut?: string;
      [key: string]: string | undefined;
    };
    [key: string]: any;
  };
  guideline_checks?: Array<{
    guideline: string;
    followed: boolean;
    observation?: string;
  }>;
  reflection_question?: string;
  evaluationSource: 'live-ai' | 'local-heuristic' | 'demo-fallback';
  modelIdentifier?: string;
  fallbackReason?: string;
  limitationsNote: string;
  isHarshCritique?: boolean;
}

export interface Attempt {
  id: string;
  sessionId: string;
  topicId: string;
  attemptType: AttemptType;
  attemptNumber?: number; // 1, 2, or 3
  userAuthoredContent: string;
  wordCount: number;
  characterCount: number;
  prePracticeSelfRating?: number; // 1-10
  timestamp: string;
  evaluation?: EvaluationRubric;
  evaluationStatus: 'pending' | 'completed' | 'failed';
  aiImprovedVersion?: AIImprovedVersion; // Sealed AI Enhanced Paragraph + Diffs + Benchmarks
  isLocked?: boolean; // Immutable Snapshot Lock
  lockedAt?: string; // ISO Timestamp when locked
  lockedModel?: string; // Evaluation Engine Identifier (e.g. 'local-expert-v1')
}

export interface ReflectionData {
  id: string;
  sessionId: string;
  topicId: string;
  whatWentWell: string;
  whatWasDifficult: string;
  oneThingToChange: string;
  whatToPractiseNext: string;
  timestamp: string;
}

export interface DrillResult {
  id: string;
  drillConfig: DrillConfig;
  userResponse: string;
  completedAt: string;
  feedback?: string;
}

export interface PracticeSession {
  id: string;
  userId: string;
  topicId: string;
  dayNumber: number;
  startedAt: string;
  completedAt?: string;
  status: 'draft' | 'in-progress' | 'completed' | 'original-completed' | 'revised-completed' | 'abandoned';
  attempts?: Attempt[]; // Up to 3 attempts (Attempt 1, Attempt 2, Attempt 3)
  originalAttempt?: Attempt; // Backward compatibility (Attempt 1)
  revisedAttempt?: Attempt; // Backward compatibility (Attempt 2)
  attempt3?: Attempt; // Backward compatibility (Attempt 3)
  reflection?: ReflectionData;
  drillResult?: DrillResult;
}

export interface DimensionTrend {
  date: string;
  topicTitle: string;
  dayNumber: number;
  score: number;
}

export interface ProgressSummary {
  daysAttempted: number;
  daysCompleted: number;
  currentStreak: number;
  bestStreak: number;
  totalWordsPracticed: number;
  averageOriginalScore: number | null;
  averageRevisedScore: number | null;
  dimensionAverages: {
    clarity: number | null;
    structureAndFlow: number | null;
    specificity: number | null;
    languageEffectiveness: number | null;
  };
  frequentImprovementAreas: { area: string; count: number }[];
  totalAttemptsRecorded?: number;
  averageRevisionGain?: number | null;
  latestAssessmentDate?: string;
  targetedPracticeRecommendations?: string[];
  completedDrillCount: number;
  savedReflectionCount: number;
  lastPracticeDate?: string;
}

export type ActiveView = 
  | 'landing'
  | 'onboarding'
  | 'auth'
  | 'dashboard'
  | 'gym'
  | 'practice'
  | 'expert'
  | 'progress'
  | 'vault'
  | 'settings';
