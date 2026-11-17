// Verification test for Attempt 1, 2, 3 with Authentic User Input
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
import { storageService } from './src/services/storage.ts';
import { aiExpertService } from './src/services/aiExpert.ts';

async function verifyUserWorkflow() {
  console.log('--- Verifying Authentic User Workflow across Attempts 1, 2, and 3 ---');
  storageService.clearAllData();

  const topic = STARTER_CURRICULUM[0]; // Day 1: Introducing yourself beyond your name
  const session = storageService.createSession(topic.id, topic.dayNumber);

  // 1. Attempt 1 (Baseline user input)
  const text1 = "hi i am sajid i am working as operational manager and basically my job is finding solution around problem and delivering solution on time. and also i like building products.";
  const eval1 = await aiExpertService.evaluateAttempt({
    topic,
    userResponse: text1,
    attemptType: 'original',
    userProfile: storageService.getUserProfile(),
    isHarshCritique: false
  });
  const s1 = storageService.saveSessionAttempt(session.id, text1, eval1, 1);
  console.log('✓ Attempt 1 saved. Total attempts:', s1.attempts?.length, 'Score:', eval1.overallScore);

  // 2. Attempt 2 (Revision with more structure)
  const text2 = "Hello team, I am Sajid. I work as operations manager where I lead cross-functional projects, resolve bottlenecks, and ensure deliverables are on time. I also love building practical software.";
  const eval2 = await aiExpertService.evaluateAttempt({
    topic,
    userResponse: text2,
    attemptType: 'revised',
    userProfile: storageService.getUserProfile(),
    isHarshCritique: false
  });
  const s2 = storageService.saveSessionAttempt(session.id, text2, eval2, 2);
  console.log('✓ Attempt 2 saved. Total attempts:', s2.attempts?.length, 'Score:', eval2.overallScore);

  // 3. Attempt 3 (Mastery with refined impact)
  const text3 = "Good morning. I am Mohammad Sajid, operations manager. My mission is streamlining operational workflows and building products that bridge communication gap across distributed teams.";
  const eval3 = await aiExpertService.evaluateAttempt({
    topic,
    userResponse: text3,
    attemptType: 'attempt-3',
    userProfile: storageService.getUserProfile(),
    isHarshCritique: false
  });
  const s3 = storageService.saveSessionAttempt(session.id, text3, eval3, 3);
  console.log('✓ Attempt 3 saved. Total attempts:', s3.attempts?.length, 'Score:', eval3.overallScore);

  // Assertions
  if (s3.attempts?.length !== 3) {
    throw new Error(`Expected 3 attempts, got ${s3.attempts?.length}`);
  }

  const att1 = s3.attempts.find(a => a.attemptNumber === 1);
  const att2 = s3.attempts.find(a => a.attemptNumber === 2);
  const att3 = s3.attempts.find(a => a.attemptNumber === 3);

  if (!att1 || !att2 || !att3) {
    throw new Error('Missing one of the attempts in session.attempts');
  }

  const enh1 = aiExpertService.synthesizeAuthenticImprovedVersion(att1.userAuthoredContent, topic, undefined, 1);
  const enh2 = aiExpertService.synthesizeAuthenticImprovedVersion(att2.userAuthoredContent, topic, undefined, 2);
  const enh3 = aiExpertService.synthesizeAuthenticImprovedVersion(att3.userAuthoredContent, topic, undefined, 3);

  console.log('\n--- Authentic In-Place Enhancements ---');
  console.log('Attempt 1 Raw:', att1.userAuthoredContent);
  console.log('Attempt 1 Enhanced:\n ', enh1.improvedResponse);
  console.log('Attempt 1 Benchmarks:', enh1.benchmarkScores);

  console.log('\nAttempt 2 Raw:', att2.userAuthoredContent);
  console.log('Attempt 2 Enhanced:\n ', enh2.improvedResponse);
  console.log('Attempt 2 Benchmarks:', enh2.benchmarkScores);

  console.log('\nAttempt 3 Raw:', att3.userAuthoredContent);
  console.log('Attempt 3 Enhanced:\n ', enh3.improvedResponse);
  console.log('Attempt 3 Benchmarks:', enh3.benchmarkScores);

  // Verify uniqueness
  if (enh1.improvedResponse === enh2.improvedResponse || enh2.improvedResponse === enh3.improvedResponse) {
    throw new Error('Enhanced versions must be distinct and tailored to each specific attempt!');
  }

  // Verify benchmark scores >= 90
  [enh1, enh2, enh3].forEach((enh, i) => {
    const scores = enh.benchmarkScores!;
    if (scores.clarity < 90 || scores.structure < 90 || scores.specificity < 90 || scores.language < 90) {
      throw new Error(`Attempt ${i + 1} benchmark score fell below 90%: ${JSON.stringify(scores)}`);
    }
  });

  console.log('\n🎉 ALL VERIFICATIONS PASSED: Authentic, Distinct, and Benchmarking >= 90% on Every Scale!\n');
}

verifyUserWorkflow().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
