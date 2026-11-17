import { ServerConfig } from './config.js';
import { EvaluationInput } from './validator.js';
import { buildSystemPrompt, buildUserPrompt } from './prompt.js';

export interface EvaluationResult {
  success: boolean;
  model_used?: string;
  evaluation?: any;
  error?: string;
  message?: string;
}

interface ValidationOutput {
  valid: boolean;
  errorReason?: string;
  data?: any;
}

function normalizeForQuoteCheck(str: string): string {
  return str.toLowerCase().replace(/\s+/g, ' ').trim();
}

function verifyAndSanitizeQuotes(dimensions: any, originalTranscript: string): void {
  const normTranscript = normalizeForQuoteCheck(originalTranscript);
  const dimKeys = ['clarity', 'structureAndFlow', 'specificity', 'languageEffectiveness'];
  
  dimKeys.forEach((key) => {
    if (dimensions[key] && typeof dimensions[key].evidence === 'string') {
      const ev = dimensions[key].evidence;
      const cleanEv = ev.replace(/^["']|["']$/g, '').trim();
      const normEv = normalizeForQuoteCheck(cleanEv);
      if (normEv && !normTranscript.includes(normEv)) {
        // If the model invented a quote not found in user speech, clear it
        dimensions[key].evidence = '';
      }
    }
  });
}

// Safe close utility to repair slightly truncated JSON responses before failing
function repairTruncatedJson(raw: string): any {
  let text = raw.trim();
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*)/i);
  if (fenceMatch) {
    text = fenceMatch[1].replace(/```\s*$/g, '').trim();
  }
  const firstBrace = text.indexOf('{');
  if (firstBrace === -1) return null;
  text = text.substring(firstBrace).trim();

  try {
    return JSON.parse(text);
  } catch {}

  // Attempt safe close of unclosed strings, arrays, and objects
  let inString = false;
  let isEscaped = false;
  const stack: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === '\\') {
      isEscaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '{') stack.push('}');
      else if (char === '[') stack.push(']');
      else if (char === '}' || char === ']') {
        if (stack.length > 0 && stack[stack.length - 1] === char) stack.pop();
      }
    }
  }

  let repaired = text;
  if (inString) repaired += '"';
  repaired = repaired.replace(/,\s*$/g, '');

  while (stack.length > 0) {
    repaired = repaired.replace(/,\s*$/g, '');
    repaired += stack.pop();
  }

  try {
    return JSON.parse(repaired);
  } catch {
    // If cut off at a trailing key or colon without value, e.g. "key":
    const trimmed = text.replace(/,\s*["'][^"']*["']?\s*:\s*[^,}\]]*$/g, '');
    if (trimmed !== text) {
      return repairTruncatedJson(trimmed);
    }
    return null;
  }
}

// Tolerant validator: accepts valid JSON with core fields and fills missing optional fields with safe defaults
function parseAndValidateTolerant(raw: string, originalTranscript: string): ValidationOutput {
  const parsed = repairTruncatedJson(raw);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { valid: false, errorReason: 'invalid JSON' };
  }

  // Core fields verification
  const topStrength = parsed.top_strength || parsed.strongestElement;
  const topImprovement = parsed.top_improvement || parsed.mainImprovementPriority;
  const reflectionQuestion = parsed.reflection_question || 'What is one specific change you will focus on in your next practice?';

  if (!topStrength || typeof topStrength !== 'string' || !topStrength.trim()) {
    return { valid: false, errorReason: 'missing or invalid string: top_strength' };
  }
  if (!topImprovement || typeof topImprovement !== 'string' || !topImprovement.trim()) {
    return { valid: false, errorReason: 'missing or invalid string: top_improvement' };
  }

  // Tolerant optional fields with safe defaults
  const defaultDimensions = {
    clarity: {
      score: 80,
      explanation: 'Clear communication of main ideas.',
      evidence: '',
    },
    structureAndFlow: {
      score: 80,
      explanation: 'Logical progression and transitions.',
      evidence: '',
    },
    specificity: {
      score: 80,
      explanation: 'Grounded details and initiatives.',
      evidence: '',
    },
    languageEffectiveness: {
      score: 80,
      explanation: 'Professional and appropriate vocabulary.',
      evidence: '',
    },
  };

  const dimensions = parsed.dimensions && typeof parsed.dimensions === 'object'
    ? {
        clarity: {
          score: typeof parsed.dimensions.clarity?.score === 'number' ? parsed.dimensions.clarity.score : 80,
          explanation: parsed.dimensions.clarity?.explanation || 'Clear communication of main ideas.',
          evidence: parsed.dimensions.clarity?.evidence || '',
        },
        structureAndFlow: {
          score: typeof parsed.dimensions.structureAndFlow?.score === 'number' ? parsed.dimensions.structureAndFlow.score : 80,
          explanation: parsed.dimensions.structureAndFlow?.explanation || 'Logical flow and progression.',
          evidence: parsed.dimensions.structureAndFlow?.evidence || '',
        },
        specificity: {
          score: typeof parsed.dimensions.specificity?.score === 'number' ? parsed.dimensions.specificity.score : 80,
          explanation: parsed.dimensions.specificity?.explanation || 'Specific operational details.',
          evidence: parsed.dimensions.specificity?.evidence || '',
        },
        languageEffectiveness: {
          score: typeof parsed.dimensions.languageEffectiveness?.score === 'number' ? parsed.dimensions.languageEffectiveness.score : 80,
          explanation: parsed.dimensions.languageEffectiveness?.explanation || 'Professional and effective vocabulary.',
          evidence: parsed.dimensions.languageEffectiveness?.evidence || '',
        },
      }
    : defaultDimensions;

  // Strict check: every evidence quote must actually exist in the user's transcript
  verifyAndSanitizeQuotes(dimensions, originalTranscript);

  const dimScores = [
    dimensions.clarity.score,
    dimensions.structureAndFlow.score,
    dimensions.specificity.score,
    dimensions.languageEffectiveness.score,
  ];
  const avgScore = Math.round(dimScores.reduce((acc, val) => acc + val, 0) / dimScores.length);
  const overallScore = typeof parsed.overallScore === 'number' ? parsed.overallScore : avgScore;

  const gainChecklist = parsed.gain_checklist && typeof parsed.gain_checklist === 'object'
    ? {
        greet: Boolean(parsed.gain_checklist.greet ?? true),
        acknowledge: Boolean(parsed.gain_checklist.acknowledge ?? true),
        insight: Boolean(parsed.gain_checklist.insight ?? true),
        navigateOut: Boolean(parsed.gain_checklist.navigateOut ?? true),
      }
    : undefined;

  const guidelineChecks = Array.isArray(parsed.guideline_checks) ? parsed.guideline_checks : [];

  return {
    valid: true,
    data: {
      overallScore,
      dimensions,
      overallAssessment: parsed.overallAssessment || 'Strong practice attempt with actionable feedback.',
      strongestElement: parsed.strongestElement || topStrength,
      mainImprovementPriority: parsed.mainImprovementPriority || topImprovement,
      toneAssessment: parsed.toneAssessment || 'Professional and engaged.',
      concreteExamples: Array.isArray(parsed.concreteExamples) ? parsed.concreteExamples : [],
      aiAssistedExample: parsed.aiAssistedExample || '',
      retryInstruction: parsed.retryInstruction || 'Focus on implementing the suggested refinement in your next attempt.',
      gain_checklist: gainChecklist,
      guideline_checks: guidelineChecks,
      top_strength: topStrength,
      top_improvement: topImprovement,
      reflection_question: reflectionQuestion,
    },
  };
}

async function executeAttempt(
  model: string,
  timeoutMs: number,
  systemPrompt: string,
  userPrompt: string,
  originalTranscript: string,
  config: ServerConfig
): Promise<{ success: boolean; data?: any; errorReason?: string }> {
  const startTime = Date.now();

  try {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 1200,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    const elapsedMs = Date.now() - startTime;

    if (!res.ok) {
      console.log(`[SERVER ATTEMPT] Model: ${model} | HTTP Status: ${res.status} | Time: ${elapsedMs}ms`);
      return { success: false, errorReason: `HTTP_${res.status}` };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? '';

    const validation = parseAndValidateTolerant(content, originalTranscript);
    if (!validation.valid) {
      console.log(`[SERVER ATTEMPT] Model: ${model} | Status: failed validation (${validation.errorReason}) | Time: ${elapsedMs}ms`);
      return { success: false, errorReason: validation.errorReason };
    }

    console.log(`[SERVER ATTEMPT] Model: ${model} | HTTP Status: 200 | Time: ${elapsedMs}ms | Validation: OK`);
    return { success: true, data: validation.data };
  } catch (err: any) {
    const elapsedMs = Date.now() - startTime;
    const errorName = err.name || 'FetchError';
    console.log(`[SERVER ATTEMPT] Model: ${model} | Error: ${errorName} | Time: ${elapsedMs}ms`);
    return { success: false, errorReason: errorName };
  }
}

export async function evaluateWithNvidia(
  input: EvaluationInput,
  config: ServerConfig
): Promise<EvaluationResult> {
  const systemPrompt = buildSystemPrompt(input.mode, input.frameworkType);
  const userPrompt = buildUserPrompt(input);

  // 1. Primary Model Attempt 1 (25-second timeout)
  const attempt1 = await executeAttempt(
    config.primaryModel,
    25000,
    systemPrompt,
    userPrompt,
    input.transcript,
    config
  );
  if (attempt1.success) {
    return {
      success: true,
      model_used: config.primaryModel,
      evaluation: attempt1.data,
    };
  }

  // 2. Primary Model Retry (25-second timeout)
  const attempt2 = await executeAttempt(
    config.primaryModel,
    25000,
    systemPrompt,
    userPrompt,
    input.transcript,
    config
  );
  if (attempt2.success) {
    return {
      success: true,
      model_used: config.primaryModel,
      evaluation: attempt2.data,
    };
  }

  // 3. Fallback Model Attempt (25-second timeout)
  const fallbackAttempt = await executeAttempt(
    config.fallbackModel,
    25000,
    systemPrompt,
    userPrompt,
    input.transcript,
    config
  );
  if (fallbackAttempt.success) {
    return {
      success: true,
      model_used: config.fallbackModel,
      evaluation: fallbackAttempt.data,
    };
  }

  // 4. Return controlled failure code if all attempts fail
  return {
    success: false,
    error: 'MODEL_CHAIN_FAILED',
    message: 'AI evaluation services are temporarily unavailable. Local analysis will be used.',
  };
}
