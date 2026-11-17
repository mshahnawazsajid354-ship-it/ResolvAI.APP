// Server configuration helper
// Note: Never log or print the API key or raw environment secrets.

import fs from 'fs';
import path from 'path';

export interface ServerConfig {
  apiKey: string;
  baseUrl: string;
  primaryModel: string;
  fallbackModel: string;
  allowedOrigins: string[];
  aiEnabled: boolean;
}

// Ensure .env is loaded if running in environments where Vite or dotenv did not preload it
function ensureEnvLoaded() {
  if (!process.env.NVIDIA_API_KEY) {
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const raw = fs.readFileSync(envPath, 'utf8');
        raw.split(/\r?\n/).forEach((line) => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx > 0) {
              const k = trimmed.substring(0, eqIdx).trim();
              const v = trimmed.substring(eqIdx + 1).trim();
              if (k && !process.env[k]) {
                process.env[k] = v;
              }
            }
          }
        });
      }
    } catch {}
  }
}

ensureEnvLoaded();

let startupLogged = false;

export function getServerConfig(): ServerConfig {
  ensureEnvLoaded();

  const apiKey = process.env.NVIDIA_API_KEY || '';
  const baseUrl = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';

  const envModel = process.env.NVIDIA_MODEL?.trim();
  const primaryModel = (envModel && envModel !== 'vendor/model-name')
    ? envModel
    : 'nvidia/nemotron-3.5-bolt-e4b';

  const envFallback = process.env.NVIDIA_FALLBACK_MODEL?.trim();
  const fallbackModel = (envFallback && envFallback !== 'vendor/model-name')
    ? envFallback
    : 'nvidia/nemotron-3.5-lightning-30b-a3b';

  const originsRaw = process.env.ALLOWED_ORIGINS || 'http://localhost:3000';
  const allowedOrigins = originsRaw.split(',').map((o) => o.trim()).filter(Boolean);

  // Kill switch: setting AI_ENABLED=false disables AI evaluation instantly
  const aiEnabled = process.env.AI_ENABLED !== 'false';

  // Log true/false only once at server startup
  if (!startupLogged) {
    startupLogged = true;
    console.log(
      `[SERVER STARTUP] Config loaded: NVIDIA_API_KEY=${Boolean(apiKey)}, NVIDIA_MODEL=${Boolean(process.env.NVIDIA_MODEL)}, NVIDIA_FALLBACK_MODEL=${Boolean(process.env.NVIDIA_FALLBACK_MODEL)}, NVIDIA_BASE_URL=${Boolean(process.env.NVIDIA_BASE_URL)}`
    );
  }

  return {
    apiKey,
    baseUrl,
    primaryModel,
    fallbackModel,
    allowedOrigins,
    aiEnabled,
  };
}
