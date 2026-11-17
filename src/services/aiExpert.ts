import type { 
  Topic, 
  EvaluationRubric, 
  DrillConfig, 
  UserProfile, 
  AttemptType
} from '../types/index.ts';

export interface EvaluationRequest {
  topic: Topic;
  userResponse: string;
  attemptType: AttemptType;
  userProfile: UserProfile;
  isHarshCritique?: boolean;
}

// Common communication filler words and vague placeholders
const FILLER_HEDGES = [
  'basically', 'literally', 'actually', 'honestly', 'kind of', 'sort of',
  'very', 'really', 'stuff', 'things', 'you know', 'somewhat', 'pretty much',
  'to be honest', 'so yeah', 'at the end of the day', 'um', 'uh'
];

// In-memory cache by transcript + mode
const evaluationCache = new Map<string, EvaluationRubric>();

// Concurrency lock: never allow two requests at once
let activeEvaluationPromise: Promise<EvaluationRubric> | null = null;

/**
 * Provider-Independent AI Communication Expert Service
 * Evaluates the user's attempt strictly against the topic's objectives and the 4-dimension rubric.
 */
export const aiExpertService = {
  async evaluateAttempt(request: EvaluationRequest): Promise<EvaluationRubric> {
    const { topic, userResponse, attemptType, userProfile, isHarshCritique } = request;
    const trimmed = userResponse.trim();

    if (!trimmed) {
      throw new Error('Response is empty. Please enter your thoughts before submitting for feedback.');
    }

    const isHarsh = Boolean(isHarshCritique ?? userProfile.preferences.directCritiqueMode);
    const mode: 'light' | 'hard' = isHarsh ? 'hard' : 'light';
    const cacheKey = `${mode}:${trimmed}`;

    if (evaluationCache.has(cacheKey)) {
      return evaluationCache.get(cacheKey)!;
    }

    if (activeEvaluationPromise) {
      return activeEvaluationPromise;
    }

    const guidelinesList: string[] = [];
    if (topic.guidelines?.steps) {
      topic.guidelines.steps.forEach((s) => {
        guidelinesList.push(`${s.label}: ${s.instruction}`);
      });
    }

    const payload = {
      transcript: trimmed,
      dayNumber: topic.dayNumber,
      topic: topic.title,
      goal: userProfile.goals[0] || 'improve-professional',
      guidelines: guidelinesList,
      mode,
      frameworkType: topic.guidelines?.type || (topic.dayNumber === 1 ? 'GAIN' : 'STANDARD'),
    };

    activeEvaluationPromise = (async () => {
      try {
        const res = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(45000),
        });

        if (!res.ok) {
          throw new Error(`HTTP_${res.status}`);
        }

        const data = await res.json();
        if (!data || !data.success || !data.evaluation) {
          throw new Error(data?.message || 'Invalid evaluation format');
        }

        const rubric: EvaluationRubric = {
          rubricVersion: 'v2.0-server-ai',
          overallScore: data.evaluation.overallScore,
          dimensions: data.evaluation.dimensions,
          overallAssessment: data.evaluation.overallAssessment,
          strongestElement: data.evaluation.top_strength || data.evaluation.strongestElement,
          mainImprovementPriority: data.evaluation.top_improvement || data.evaluation.mainImprovementPriority,
          toneAssessment: data.evaluation.toneAssessment,
          concreteExamples: data.evaluation.concreteExamples || [],
          aiAssistedExample: data.evaluation.aiAssistedExample || undefined,
          targetedDrill: topic.suggestedDrill,
          retryInstruction: data.evaluation.retryInstruction || 'Apply the suggested feedback in your next attempt.',
          gain_checklist: data.evaluation.gain_checklist || undefined,
          guideline_checks: data.evaluation.guideline_checks || undefined,
          reflection_question: data.evaluation.reflection_question || undefined,
          soundComparison: {
            howItIsSounding: {
              toneDiagnosis: data.evaluation.toneAssessment || 'Spoken communication attempt.',
              impressionOnListener: data.evaluation.overallAssessment || '',
              fillerOrHesitationImpact: 'Evaluated against verified filler token occurrences.',
            },
            howItShouldSound: {
              polishedAIModelVoice: data.evaluation.aiAssistedExample || '',
              structuralUpgradeExplanation: `Follows the ${topic.guidelines.type} arc.`,
              keyShiftsMade: [
                'Anchored central claims in concrete details.',
                'Refined transitions for cohesive flow.',
                'Eliminated tentative filler words.',
              ],
            },
          },
          aiImprovedVersion: undefined,
          evaluationSource: 'live-ai',
          modelIdentifier: data.model_used || 'NVIDIA Cloud Model',
          limitationsNote: 'Evaluated live via AI communication mentor. This is a practice simulation.',
          isHarshCritique: isHarsh,
        };

        evaluationCache.set(cacheKey, rubric);
        return rubric;
      } catch (err: any) {
        console.warn('AI evaluation endpoint unavailable or timed out, activating local fallback:', err);
        let fallbackReason = 'service unavailable';
        const msg = (err?.message || '').toLowerCase();
        if (msg.includes('ai_disabled')) fallbackReason = 'AI disabled';
        else if (msg.includes('429') || msg.includes('rate_limit')) fallbackReason = 'rate limited';
        else if (msg.includes('timeout') || err?.name === 'TimeoutError') fallbackReason = 'timeout';
        else if (msg.includes('invalid') || msg.includes('format')) fallbackReason = 'invalid response';
        else if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed')) fallbackReason = 'network error';

        const fallback = this.evaluateWithLocalHeuristics(request);
        fallback.evaluationSource = 'local-heuristic';
        fallback.fallbackReason = fallbackReason;
        fallback.limitationsNote = 'AI feedback is busy right now. Here is instant feedback instead.';
        fallback.modelIdentifier = 'Instant Feedback Engine (Local)';
        fallback.aiAssistedExample = undefined;
        fallback.aiImprovedVersion = undefined;
        return fallback;
      } finally {
        activeEvaluationPromise = null;
      }
    })();

    return activeEvaluationPromise;
  },

  /**
   * Transparent Local Heuristic NLP Evaluator
   * Analyzes sentence counts, filler word frequency, structure signals, and concrete nouns.
   * Note: The local heuristic engine never invents or generates rewritten paragraphs.
   */
  evaluateWithLocalHeuristics(request: EvaluationRequest): EvaluationRubric {
    const { topic, userResponse, attemptType, userProfile, isHarshCritique } = request;
    const text = userResponse.trim();
    
    // Split into sentences
    const sentences = text
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    // Detect filler words
    const lowerText = text.toLowerCase();
    const foundFillers: string[] = [];
    FILLER_HEDGES.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        foundFillers.push(...matches.map(m => m.toLowerCase()));
      }
    });

    // Check for G.A.I.N. signals
    const hasGreetingSignal = /^(hi|hello|good morning|good afternoon|dear|welcome|greetings|hey|to begin|firstly)/i.test(sentences[0] || '');
    const hasClosureSignal = /(in conclusion|therefore|moving forward|looking forward|to wrap up|next step|finally|thank you|as a result)/i.test(sentences[sentences.length - 1] || '');
    const hasEvidenceSignal = /(because|for example|specifically|such as|in particular|when|last|metric|result|cost|time)/i.test(text);

    // Baseline dimension scoring calculations
    // 1. Clarity (0-100)
    let clarityScore = 80;
    const fillerPenalty = Math.min(foundFillers.length * 6, 28);
    clarityScore -= fillerPenalty;
    if (wordCount < 25) clarityScore -= 15;
    if (sentences.length >= 2 && sentences.length <= 7) clarityScore += 6;
    clarityScore = Math.max(35, Math.min(95, clarityScore));

    // 2. Structure & Flow (0-100)
    let structureScore = 75;
    if (hasGreetingSignal) structureScore += 8;
    if (hasClosureSignal) structureScore += 8;
    if (sentences.length < 2) structureScore -= 20;
    structureScore = Math.max(30, Math.min(95, structureScore));

    // 3. Specificity (0-100)
    let specificityScore = 70;
    if (hasEvidenceSignal) specificityScore += 12;
    if (/\d+/.test(text)) specificityScore += 8; // Contains tangible numbers/metrics
    if (wordCount < 30) specificityScore -= 12;
    specificityScore = Math.max(30, Math.min(96, specificityScore));

    // 4. Language Effectiveness (0-100)
    let languageScore = 80;
    if (foundFillers.length === 0) languageScore += 8;
    if (foundFillers.length > 3) languageScore -= 16;
    languageScore = Math.max(40, Math.min(95, languageScore));

    // If harsh critique mode is active, apply rigorous standard
    if (isHarshCritique) {
      clarityScore = Math.max(25, clarityScore - 8);
      structureScore = Math.max(25, structureScore - 10);
      specificityScore = Math.max(25, specificityScore - 10);
      languageScore = Math.max(30, languageScore - 8);
    }

    const overallScore = Math.round((clarityScore + structureScore + specificityScore + languageScore) / 4);

    // Identify evidence extracts
    const sampleSentence = sentences[0] || text.substring(0, 60);
    const middleSentence = sentences[Math.floor(sentences.length / 2)] || text.substring(0, 80);

    // Strongest element
    let strongestElement = '';
    if (specificityScore >= structureScore && specificityScore >= clarityScore) {
      strongestElement = `Grounded detail: You provided concrete anchors (e.g., "${middleSentence.slice(0, 65)}") that gave your argument observable substance.`;
    } else if (structureScore >= clarityScore) {
      strongestElement = `Progression and pacing: Your transition from setup to conclusion follows an orderly communicative arc.`;
    } else {
      strongestElement = `Declarative clarity: Your opening and core message were directly stated without unnecessary ambiguity.`;
    }

    // Main improvement priority
    let mainImprovementPriority = '';
    let priorityDetail = '';
    if (foundFillers.length > 2) {
      mainImprovementPriority = 'Eliminate cognitive filler words';
      priorityDetail = `Detected ${foundFillers.length} filler token(s) (${[...new Set(foundFillers)].slice(0, 3).join(', ')}). Removing these immediately elevates your authority.`;
    } else if (sentences.length < 3) {
      mainImprovementPriority = 'Expand structural scaffolding (Context -> Insight -> Closure)';
      priorityDetail = 'The response is currently a single thought burst. Break it into an opening frame, the core insight, and a purposeful closure.';
    } else if (!hasEvidenceSignal) {
      mainImprovementPriority = 'Ground claims in verifiable examples or metrics';
      priorityDetail = 'The assertion is conceptually sound, but lacks an empirical example or measurable trade-off.';
    } else {
      mainImprovementPriority = 'Sharpen closing navigation and next step';
      priorityDetail = 'Ensure your final sentence explicitly tells the listener what action, reflection, or consensus comes next.';
    }

    // Tone assessment
    const toneAssessment = isHarshCritique
      ? 'Direct & candid: The tone currently exhibits slight hesitation through filler words or broad claims. Stripping qualifiers will produce clean executive presence.'
      : 'Calm & thoughtful: The voice reflects genuine reflection. With minor structural tightening, it will carry natural professional authority.';

    const howItIsSounding = {
      toneDiagnosis: foundFillers.length > 0
        ? `Conversational & slightly hesitant. The presence of ${foundFillers.length} filler expression(s) ("${[...new Set(foundFillers)].slice(0, 2).join('", "')}") signals real-time word searching, which softens your authority.`
        : wordCount < 30
          ? `Terse & unanchored. The listener hears the top-level thought, but lacks the necessary context to retain it.`
          : `Earnest but slightly winding. You express valid points, but the delivery meanders before arriving at the core takeaway.`,
      impressionOnListener: isHarshCritique
        ? `The listener perceives a capable mind trapped behind informal phrasing and uncalibrated pacing.`
        : `The listener recognizes your sincerity, but has to work harder than necessary to extract your central insight.`,
      fillerOrHesitationImpact: foundFillers.length > 0
        ? `Contains ${foundFillers.length} filler token(s) (${[...new Set(foundFillers)].slice(0, 3).join(', ')}), causing cognitive distraction.`
        : `Clean syntax with zero prominent filler tokens detected.`
    };

    const howItShouldSound = {
      polishedAIModelVoice: '',
      structuralUpgradeExplanation: `Follows the strict ${topic.guidelines.type} arc: establishes immediate relevance, eliminates tentative qualifiers, anchors the insight in observable reality, and closes with unambiguous direction.`,
      keyShiftsMade: [
        `Replaced passive hedges with direct, declarative verbs.`,
        `Anchored the central claim to a verifiable operational outcome.`,
        `Closed with an active collaborative conclusion instead of trailing off.`
      ]
    };

    return {
      rubricVersion: 'v1.0-standard-four-axes',
      overallScore,
      dimensions: {
        clarity: {
          score: clarityScore,
          explanation: foundFillers.length > 0 
            ? `Contains ${foundFillers.length} filler expression(s) ("${foundFillers.slice(0, 2).join('", "')}"). Eliminating these allows your core thought to lead.`
            : 'Clear, direct expression with zero conspicuous cognitive fillers.',
          evidence: sampleSentence
        },
        structureAndFlow: {
          score: structureScore,
          explanation: hasGreetingSignal && hasClosureSignal
            ? 'Directional flow: Balanced progression from opening setup to closing resolution.'
            : hasGreetingSignal
              ? 'Directional flow: Good opening hook, but needs a sharper, decisive conclusion.'
              : 'Directional flow: Slightly unorganized. Lead with a direct opening and close with a forward-looking prompt.',
          evidence: `Opening phrase: "${sampleSentence.slice(0, 45)}"`
        },
        specificity: {
          score: specificityScore,
          explanation: hasEvidenceSignal || /\d+/.test(text)
            ? 'Included specific situational references and concrete connectors that anchor your point in reality.'
            : 'Lacks concrete nouns, numbers, or specific operational details. Ground your claims in tangible examples.',
          evidence: middleSentence
        },
        languageEffectiveness: {
          score: languageScore,
          explanation: wordCount >= 30 && wordCount <= 180
            ? 'Word economy is balanced. The text respects the reader\'s cognitive bandwidth without being terse.'
            : wordCount < 30 
              ? 'Response is very brief. Expand slightly to develop your central idea.'
              : 'Slightly dense. Consider splitting compound sentences into distinct points.',
          evidence: `Total word volume: ${wordCount} words across ${sentences.length} sentence(s).`
        }
      },
      overallAssessment: isHarshCritique
        ? `[Direct Critique] Your attempt communicates the base concept, but falls into common traps of ${mainImprovementPriority.toLowerCase()}. To reach executive standard, cut the passive padding and anchor your claim in a concrete before-and-after outcome.`
        : `Your response provides a thoughtful foundation for ${topic.title.toLowerCase()}. Your primary opportunity for growth is to ${mainImprovementPriority.toLowerCase()}.`,
      strongestElement,
      mainImprovementPriority,
      toneAssessment,
      concreteExamples: [
        `Replace soft hedges with declarative assertions (e.g., replace "I think it basically..." with "My observation is...").`,
        `Anchor your central insight to a single concrete milestone or observation.`,
        `Ensure your final sentence provides a clear navigational closure rather than trailing off.`
      ],
      aiAssistedExample: undefined,
      targetedDrill: topic.suggestedDrill,
      retryInstruction: attemptType === 'original'
        ? `Keep your original attempt intact as your baseline. Now click "Create Revised Attempt" to draft a version that eliminates "${foundFillers[0] || 'vague wording'}" and incorporates the structured G.A.I.N. steps.`
        : 'Review the score delta below to see how your revision sharpened clarity and specificity.',
      evaluationSource: 'local-heuristic',
      modelIdentifier: 'Local Heuristics Engine (Rule-based NLP)',
      limitationsNote: 'This evaluation was computed using client-side heuristic analysis based on sentence syntax, structure markers, and vocabulary economy. It is a provisional prototype indicator, not a psychometric test.',
      isHarshCritique: !!isHarshCritique,
      soundComparison: {
        howItIsSounding,
        howItShouldSound
      }
    };
  }
};
