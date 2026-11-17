import { ServerConfig } from './config.js';

export interface EvaluationInput {
  transcript: string;
  dayNumber: number;
  topic: string;
  goal: string;
  guidelines: string[];
  mode: 'light' | 'hard';
  frameworkType?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  data?: EvaluationInput;
}

export function validateRequest(
  method: string | undefined,
  headers: Record<string, string | string[] | undefined>,
  body: any,
  config: ServerConfig
): ValidationResult {
  // 1. HTTP Method validation
  if (method !== 'POST') {
    return { valid: false, error: 'Method not allowed. Only POST requests are accepted.' };
  }

  // 2. Origin validation
  const originHeader = headers['origin'] || headers['Origin'];
  const origin = Array.isArray(originHeader) ? originHeader[0] : originHeader;

  if (origin && config.allowedOrigins.length > 0) {
    const isAllowed = config.allowedOrigins.some(
      (allowed) => allowed === origin || allowed === '*'
    );
    if (!isAllowed) {
      return { valid: false, error: 'Forbidden origin. Request origin is not permitted.' };
    }
  }

  // 3. Body presence
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid JSON request payload.' };
  }

  const { transcript, dayNumber, topic, goal, guidelines, mode } = body;

  // Mode validation ("light" | "hard", default "light")
  let validatedMode: 'light' | 'hard' = 'light';
  if (mode !== undefined && mode !== null) {
    if (mode !== 'light' && mode !== 'hard') {
      return { valid: false, error: 'Invalid mode. Mode must be either "light" or "hard".' };
    }
    validatedMode = mode;
  }

  // 4. Transcript validation (20-1500 words)
  if (typeof transcript !== 'string') {
    return { valid: false, error: 'Field "transcript" must be a string.' };
  }

  const cleanTranscript = transcript.trim();
  const words = cleanTranscript.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 20) {
    return {
      valid: false,
      error: `Transcript is too brief (${wordCount} words). Please provide at least 20 words for meaningful feedback.`,
    };
  }

  if (wordCount > 1500) {
    return {
      valid: false,
      error: `Transcript exceeds maximum allowed limit (${wordCount} words). Please limit your response to 1500 words.`,
    };
  }

  // 5. Day Number validation
  const parsedDay = Number(dayNumber);
  if (!Number.isInteger(parsedDay) || parsedDay < 1 || parsedDay > 365) {
    return { valid: false, error: 'Field "dayNumber" must be an integer between 1 and 365.' };
  }

  // 6. Topic validation
  if (typeof topic !== 'string' || !topic.trim()) {
    return { valid: false, error: 'Field "topic" must be a non-empty string.' };
  }

  // 7. Goal validation
  if (typeof goal !== 'string' || !goal.trim()) {
    return { valid: false, error: 'Field "goal" must be a non-empty string.' };
  }

  // 8. Guidelines validation
  let normalizedGuidelines: string[] = [];
  if (Array.isArray(guidelines)) {
    normalizedGuidelines = guidelines
      .map((g) => (typeof g === 'string' ? g.trim() : JSON.stringify(g)))
      .filter(Boolean);
  }

  const frameworkType = typeof body.frameworkType === 'string' && body.frameworkType.trim()
    ? body.frameworkType.trim()
    : parsedDay === 1
      ? 'GAIN'
      : 'STANDARD';

  return {
    valid: true,
    data: {
      transcript: cleanTranscript,
      dayNumber: parsedDay,
      topic: topic.trim(),
      goal: goal.trim(),
      guidelines: normalizedGuidelines,
      mode: validatedMode,
      frameworkType,
    },
  };
}
