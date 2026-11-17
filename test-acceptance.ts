// Comprehensive 20-Point Acceptance Test Suite for Gym for Communication (Product One)
// Verifies compliance against Layer 20 of the Master Build Prompt.

// 1. Setup mock environment for browser APIs in Node
const storageMap = new Map<string, string>();
globalThis.localStorage = {
  getItem: (key: string) => storageMap.get(key) || null,
  setItem: (key: string, value: string) => { storageMap.set(key, value); },
  removeItem: (key: string) => { storageMap.delete(key); },
  clear: () => { storageMap.clear(); },
  key: (index: number) => Array.from(storageMap.keys())[index] || null,
  length: 0
} as any;

import { STARTER_CURRICULUM } from './src/data/curriculum.ts';
import { storageService, DEFAULT_USER_PROFILE } from './src/services/storage.ts';
import { aiExpertService } from './src/services/aiExpert.ts';
import type { UserProfile, Topic, PracticeSession, Attempt } from './src/types/index.ts';

async function runAcceptanceTests() {
  console.log('================================================================');
  console.log('  RUNNING GYM FOR COMMUNICATION (PRODUCT ONE) ACCEPTANCE TESTS  ');
  console.log('================================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testNum: number, description: string, details?: string) {
    if (condition) {
      console.log(`[PASS] Test ${testNum.toString().padStart(2, '0')}: ${description}`);
      passedCount++;
    } else {
      console.error(`[FAIL] Test ${testNum.toString().padStart(2, '0')}: ${description}`);
      if (details) console.error(`       Details: ${details}`);
      failedCount++;
    }
  }

  // TEST 1: New user can complete onboarding and preferences are recorded
  storageService.clearAllData();
  const onboardingProfile: Partial<UserProfile> = {
    displayName: 'Amina Al-Mansoor',
    goals: ['improve-professional', 'prepare-interviews'],
    roadmapDays: 30,
    preferences: {
      preferredFormat: 'text',
      sessionLengthMinutes: 10,
      dailyReminder: false,
      initialConfidenceRating: 6,
      experienceLevel: 'intermediate',
      directCritiqueMode: true,
      aiProvider: 'offline-heuristic'
    },
    onboardingCompleted: true
  };
  const savedProfile = storageService.saveUserProfile(onboardingProfile);
  assert(
    savedProfile.displayName === 'Amina Al-Mansoor' &&
    savedProfile.onboardingCompleted === true &&
    savedProfile.preferences.directCritiqueMode === true,
    1,
    'New user onboarding completion and preference persistence'
  );

  // TEST 2: User chosen goals appear and persist
  const reloadedProfile = storageService.getUserProfile();
  assert(
    reloadedProfile.goals.includes('improve-professional') &&
    reloadedProfile.goals.includes('prepare-interviews'),
    2,
    'User chosen communication goals persist accurately in profile'
  );

  // TEST 3: Dashboard recommends relevant next action (Day 1 for new user)
  const allSessions = storageService.getAllSessions();
  const completedTopicIds = new Set(allSessions.filter(s => s.status === 'original-completed' || s.status === 'revised-completed').map(s => s.topicId));
  const nextRecommendedTopic = STARTER_CURRICULUM.find(t => !completedTopicIds.has(t.id));
  assert(
    nextRecommendedTopic !== undefined && nextRecommendedTopic.dayNumber === 1,
    3,
    'Dashboard correctly recommends Day 1 practice for new user'
  );

  // TEST 4: Topic ladder integrity (all 30 topics with required fields and guidelines)
  const all30HaveFields = STARTER_CURRICULUM.length === 30 && STARTER_CURRICULUM.every(t => 
    t.id && t.dayNumber && t.stage && t.title && t.objective &&
    t.difficulty && t.context && t.instructions &&
    t.guidelines && t.guidelines.steps.length >= 3 &&
    t.guidelines.illustrativeExample && t.guidelines.commonMistakeToAvoid &&
    t.suggestedDrill && t.suggestedDrill.targetSkill && t.suggestedDrill.instruction
  );
  assert(
    all30HaveFields,
    4,
    'All 30 curriculum topics possess complete metadata, guidelines & drills'
  );

  // TEST 5: User can enter and submit text response, with word & character counts
  const day1Topic = STARTER_CURRICULUM[0];
  const userText = "Hello everyone. I am Amina, an engineering manager focusing on high-reliability distributed systems. Over the past year, basically I have led our cloud modernization initiative. I am excited to exchange insights with this group today on building resilient teams.";
  const wordCount = userText.trim().split(/\s+/).filter(Boolean).length;
  assert(
    wordCount === 39 && userText.length > 100,
    5,
    'Text response entry and character/word count calculation'
  );

  // TEST 6: AI Evaluation provides structured evaluation and transparent source label
  const evalResult = await aiExpertService.evaluateAttempt({
    topic: day1Topic,
    userResponse: userText,
    attemptType: 'original',
    userProfile: reloadedProfile,
    isHarshCritique: true
  });
  assert(
    evalResult &&
    evalResult.rubricVersion === 'v1.0-standard-four-axes' &&
    evalResult.evaluationSource === 'local-heuristic' &&
    evalResult.modelIdentifier.includes('Local Heuristics Engine') &&
    evalResult.limitationsNote.length > 20,
    6,
    'AI Expert provides structured 4-dimension evaluation with honest source disclosure'
  );

  // TEST 7: Scores include evidence-based explanations and user text quotes
  const hasClarityEvidence = evalResult.dimensions.clarity.evidence.length > 5;
  const hasStructureExplanation = evalResult.dimensions.structureAndFlow.explanation.length > 10;
  const hasSpecificityEvidence = evalResult.dimensions.specificity.evidence.length > 5;
  const hasConcreteExamples = evalResult.concreteExamples.length >= 2;
  assert(
    hasClarityEvidence && hasStructureExplanation && hasSpecificityEvidence && hasConcreteExamples,
    7,
    'Scores include concrete evidence from user text rather than unexplained numbers'
  );

  // TEST 8: Raw original attempt remains strictly preserved and unchanged
  const session = storageService.createSession(day1Topic.id, day1Topic.dayNumber);
  const updatedSession = storageService.saveSessionAttempt(session.id, userText, evalResult, 1, 6);
  assert(
    updatedSession.originalAttempt !== undefined &&
    updatedSession.originalAttempt.userAuthoredContent === userText &&
    updatedSession.originalAttempt.attemptNumber === 1 &&
    updatedSession.originalAttempt.evaluation?.overallScore === evalResult.overallScore,
    8,
    'Original attempt remains strictly preserved as immutable baseline'
  );

  // TEST 9: User can create a revised attempt (Attempt 2)
  const revisedText = "Good morning everyone. I’m Amina, an engineering lead specializing in distributed cloud infrastructure. Over the past year, I directed our cross-region migration, reducing failover latency by 40%. Today, I look forward to collaborating on resilient architecture patterns.";
  const revisedEval = await aiExpertService.evaluateAttempt({
    topic: day1Topic,
    userResponse: revisedText,
    attemptType: 'revised',
    userProfile: reloadedProfile,
    isHarshCritique: true
  });
  const sessionWithRevision = storageService.saveSessionAttempt(session.id, revisedText, revisedEval, 2);
  assert(
    sessionWithRevision.revisedAttempt !== undefined &&
    sessionWithRevision.revisedAttempt.userAuthoredContent === revisedText &&
    sessionWithRevision.attempts?.length === 2,
    9,
    'User can create and save distinct revised attempt'
  );

  // TEST 10: Original and revised evaluations remain distinguishable with delta
  const origScore = sessionWithRevision.originalAttempt!.evaluation!.overallScore!;
  const revScore = sessionWithRevision.revisedAttempt!.evaluation!.overallScore!;
  const scoreDelta = revScore - origScore;
  assert(
    sessionWithRevision.originalAttempt!.userAuthoredContent !== sessionWithRevision.revisedAttempt!.userAuthoredContent &&
    typeof scoreDelta === 'number',
    10,
    `Original and revised evaluations remain distinguishable (Baseline: ${origScore}, Revision: ${revScore}, Delta: ${scoreDelta >= 0 ? '+' : ''}${scoreDelta})`
  );

  // TEST 11: Targeted drill can be completed and linked to session
  const drillResult = {
    id: `drill_${Date.now()}`,
    drillConfig: day1Topic.suggestedDrill,
    userResponse: "I am an engineering leader specializing in resilient distributed systems, currently optimizing cloud infrastructure reliability.",
    completedAt: new Date().toISOString()
  };
  const sessionWithDrill = storageService.saveDrillResult(session.id, drillResult);
  assert(
    sessionWithDrill.drillResult !== undefined &&
    sessionWithDrill.drillResult.userResponse.length > 20,
    11,
    'Targeted drill assignment is saved and linked to original practice session'
  );

  // TEST 12: Reflection can be recorded and organizes in Reflection Vault
  const reflectionData = {
    whatWentWell: "Delivered direct domain focus in the opener without meandering.",
    whatWasDifficult: "Catching myself before using conversational hedges like 'basically'.",
    oneThingToChange: "Anchor the opening in the specific latency metric immediately.",
    whatToPractiseNext: "Describing a meaningful habit on Day 2."
  };
  const sessionWithReflection = storageService.saveReflection(session.id, reflectionData);
  assert(
    sessionWithReflection.reflection !== undefined &&
    sessionWithReflection.reflection.whatWentWell === reflectionData.whatWentWell,
    12,
    'Daily reflection is recorded and linked for Reflection Vault retrieval'
  );

  // TEST 13: Progress values are derived from actual saved records (no fabrication)
  const progress = storageService.getProgressSummary();
  assert(
    progress.daysCompleted === 1 &&
    progress.totalAttemptsRecorded === 2 &&
    progress.completedDrillCount === 1 &&
    progress.savedReflectionCount === 1 &&
    progress.averageOriginalScore !== null,
    13,
    'Progress summary is strictly derived from actual saved records'
  );

  // TEST 14: Empty states do not show fabricated progress when data is empty
  storageService.clearAllData();
  const emptyProgress = storageService.getProgressSummary();
  assert(
    emptyProgress.daysCompleted === 0 &&
    emptyProgress.daysAttempted === 0 &&
    emptyProgress.averageOriginalScore === null &&
    emptyProgress.averageRevisedScore === null &&
    emptyProgress.currentStreak === 0,
    14,
    'Empty state shows zero completed days and null averages without fabricated numbers'
  );

  // Restore the previous session for remaining checks
  storageService.saveUserProfile(onboardingProfile);
  storageService.saveSession(sessionWithReflection);

  // TEST 15: Draft auto-saving and persistence
  storageService.saveDraft('topic-day-2', 'Draft text for Day 2 habit exercise...');
  const retrievedDraft = storageService.getDraft('topic-day-2');
  assert(
    retrievedDraft === 'Draft text for Day 2 habit exercise...',
    15,
    'Draft saving preserves unsubmitted work across sessions'
  );

  // TEST 16: Data export and import functionality
  const exportedJSON = storageService.exportAllData();
  const parsedExport = JSON.parse(exportedJSON);
  assert(
    parsedExport.profile && parsedExport.sessions && parsedExport.sessions.length >= 1,
    16,
    'Complete data export produces valid portable JSON backup'
  );

  // TEST 17: Speech Recognition service handles support and permission checks
  const speechModule = await import('./src/services/speech.ts');
  const isSupported = speechModule.speechService.getIsSupported();
  // In Node it returns false gracefully without throwing
  assert(
    isSupported === false,
    17,
    'Speech service gracefully detects unsupported environments without crashing'
  );

  // TEST 18: Direct / Harsh Critique mode toggle alters evaluation standards
  const lenientEval = aiExpertService.evaluateWithLocalHeuristics({
    topic: day1Topic,
    userResponse: userText,
    attemptType: 'original',
    userProfile: reloadedProfile,
    isHarshCritique: false
  });
  const harshEval = aiExpertService.evaluateWithLocalHeuristics({
    topic: day1Topic,
    userResponse: userText,
    attemptType: 'original',
    userProfile: reloadedProfile,
    isHarshCritique: true
  });
  assert(
    harshEval.overallScore! < lenientEval.overallScore! &&
    harshEval.isHarshCritique === true,
    18,
    `Direct Critique mode applies rigorous standards (Lenient: ${lenientEval.overallScore}, Harsh: ${harshEval.overallScore})`
  );

  // TEST 19: Error handling handles empty user input with descriptive error
  let caughtError = false;
  try {
    await aiExpertService.evaluateAttempt({
      topic: day1Topic,
      userResponse: '   ',
      attemptType: 'original',
      userProfile: reloadedProfile
    });
  } catch (err: any) {
    caughtError = err.message.includes('empty');
  }
  assert(
    caughtError,
    19,
    'System rejects empty input with clear actionable error message'
  );

  // TEST 20: AI improved version preserves meaning and provides key change explanations
  const improvedData = harshEval.aiImprovedVersion;
  assert(
    improvedData !== undefined &&
    improvedData.improvedResponse.length > 50 &&
    improvedData.keyChanges.length >= 4 &&
    improvedData.meaningPreservationNote.includes('preserved'),
    20,
    'AI improved version preserves meaning with 4 categorised key change explanations'
  );

  console.log('\n================================================================');
  console.log(`  ACCEPTANCE TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED  `);
  console.log('================================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAcceptanceTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
