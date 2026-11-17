/**
 * Best-effort in-memory rate limiting.
 *
 * Security & Environment Isolation:
 * Loosened limits apply ONLY when running locally (dev server on localhost).
 * In production (Vercel), limits are strictly 5 requests per IP per day and 20 per minute total.
 * 
 * Why a visitor cannot fake or bypass this with headers:
 * 1. Environment Immunity: The switch checks process.env.VERCEL and process.env.NODE_ENV.
 *    On Vercel, process.env.VERCEL === '1' is injected by Vercel's platform runtime.
 *    External HTTP visitors cannot inject or modify server environment variables.
 * 2. Origin & Loopback Verification: When running outside production, loosened limits
 *    require BOTH a verified local loopback IP (127.0.0.1 or ::1) AND a local origin
 *    (localhost / 127.0.0.1 or direct local scripts). If an external IP reaches the dev
 *    server (e.g. over LAN or tunnel), it remains constrained by the strict production limits.
 * 3. In production, even if a visitor sends spoofed headers like 'Origin: http://localhost:3000'
 *    or 'X-Forwarded-For: 127.0.0.1', the immutable server environment check immediately
 *    disables local mode and enforces the strict production limits.
 */

interface DailyRecord {
  count: number;
  resetTime: number; // Unix timestamp ms
}

interface MinuteRecord {
  count: number;
  resetTime: number; // Unix timestamp ms
}

const ipDailyLimits = new Map<string, DailyRecord>();
let globalMinuteLimit: MinuteRecord = {
  count: 0,
  resetTime: Date.now() + 60 * 1000,
};

// Production limits (strictly enforced on Vercel)
const PROD_MAX_PER_IP_DAY = 5;
const PROD_MAX_GLOBAL_PER_MIN = 20;

// Loosened limits for local development test suites (npm run dev on localhost)
const LOCAL_DEV_MAX_PER_IP_DAY = 100;
const LOCAL_DEV_MAX_GLOBAL_PER_MIN = 60;

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_MINUTE_MS = 60 * 1000;

function isLocalEnvironment(clientIp: string, requestOrigin?: string): boolean {
  // If running in Vercel or production NODE_ENV, visitors cannot be local dev
  const isVercelOrProduction =
    process.env.VERCEL === '1' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.NODE_ENV === 'production';

  if (isVercelOrProduction) {
    return false;
  }

  // When running locally in development:
  // Validate loopback IP
  const isLoopbackIp =
    clientIp === '127.0.0.1' ||
    clientIp === '::1' ||
    clientIp === 'localhost' ||
    clientIp.startsWith('127.') ||
    clientIp === '::ffff:127.0.0.1';

  // Validate local origin (or absent/internal for local test scripts)
  const isLocalOrigin =
    !requestOrigin ||
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(requestOrigin);

  return isLoopbackIp && isLocalOrigin;
}

export function checkRateLimit(
  clientIp: string,
  requestOrigin?: string
): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const isLocal = isLocalEnvironment(clientIp, requestOrigin);

  const maxGlobalPerMin = isLocal ? LOCAL_DEV_MAX_GLOBAL_PER_MIN : PROD_MAX_GLOBAL_PER_MIN;
  const maxPerIpDay = isLocal ? LOCAL_DEV_MAX_PER_IP_DAY : PROD_MAX_PER_IP_DAY;

  // 1. Global per-minute limit check
  if (now > globalMinuteLimit.resetTime) {
    globalMinuteLimit = { count: 0, resetTime: now + ONE_MINUTE_MS };
  }
  if (globalMinuteLimit.count >= maxGlobalPerMin) {
    return {
      allowed: false,
      reason: `Global rate limit reached (${maxGlobalPerMin} requests per minute). Please try again shortly.`,
    };
  }

  // 2. Per-IP daily limit check
  const ipKey = clientIp || 'unknown-client';
  const existing = ipDailyLimits.get(ipKey);

  if (!existing || now > existing.resetTime) {
    ipDailyLimits.set(ipKey, { count: 1, resetTime: now + ONE_DAY_MS });
  } else {
    if (existing.count >= maxPerIpDay) {
      return {
        allowed: false,
        reason: `Daily evaluation limit reached for your connection (${maxPerIpDay} requests per day).`,
      };
    }
    existing.count += 1;
  }

  // Increment global count
  globalMinuteLimit.count += 1;

  return { allowed: true };
}
