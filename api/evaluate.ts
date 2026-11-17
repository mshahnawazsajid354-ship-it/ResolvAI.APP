import { getServerConfig } from '../server/config.js';
import { checkRateLimit } from '../server/rateLimiter.js';
import { validateRequest } from '../server/validator.js';
import { evaluateWithNvidia } from '../server/nvidiaClient.js';

// Vercel serverless function configuration
export const config = {
  maxDuration: 60, // Accommodates 15s primary + 15s retry + 25s fallback timeout budget
};

export default async function handler(req: any, res: any) {
  const serverConfig = getServerConfig();

  // Helper to set headers
  const setHeader = (key: string, val: string) => {
    if (res.setHeader) {
      res.setHeader(key, val);
    } else if (res.headers) {
      res.headers[key.toLowerCase()] = val;
    }
  };

  // CORS headers
  const reqOrigin = req.headers?.['origin'] || req.headers?.['Origin'] || '';
  const isAllowedOrigin = serverConfig.allowedOrigins.some(
    (o) => o === '*' || o === reqOrigin
  );

  if (isAllowedOrigin && reqOrigin) {
    setHeader('Access-Control-Allow-Origin', reqOrigin);
    setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // Preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // 1. Kill switch verification
  if (!serverConfig.aiEnabled) {
    return res.status(503).json({
      success: false,
      error: 'AI_DISABLED',
      message: 'AI evaluation service is temporarily paused by administrative configuration.',
    });
  }

  // 2. Client IP extraction & Rate limiting
  const forwardedFor = req.headers?.['x-forwarded-for'];
  const clientIp = typeof forwardedFor === 'string'
    ? forwardedFor.split(',')[0].trim()
    : (req.socket?.remoteAddress || '127.0.0.1');

  const rateCheck = checkRateLimit(clientIp, reqOrigin);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: rateCheck.reason || 'Too many requests. Please wait before submitting another practice.',
    });
  }

  // 3. Request validation
  const validation = validateRequest(req.method, req.headers || {}, req.body, serverConfig);
  if (!validation.valid || !validation.data) {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_FAILED',
      message: validation.error || 'Invalid request parameters.',
    });
  }

  // 4. API Key presence check
  if (!serverConfig.apiKey) {
    return res.status(503).json({
      success: false,
      error: 'API_KEY_MISSING',
      message: 'AI evaluation credentials are not configured on the server.',
    });
  }

  // 5. Execute NVIDIA Model Chain
  try {
    const result = await evaluateWithNvidia(validation.data, serverConfig);

    if (!result.success) {
      return res.status(502).json({
        success: false,
        error: result.error || 'MODEL_FAILED',
        message: result.message || 'Evaluation models did not return valid feedback.',
      });
    }

    return res.status(200).json({
      success: true,
      model_used: result.model_used,
      evaluation: result.evaluation,
    });
  } catch (err: any) {
    // Return generic error; never leak keys or internal stack traces
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred during evaluation.',
    });
  }
}
