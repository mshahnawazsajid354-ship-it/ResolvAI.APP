import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

interface AuthScreenProps {
  mode: 'signup' | 'login';
  onSwitchMode: (mode: 'signup' | 'login') => void;
  onSkip: () => void;
  onBack: () => void;
  theme?: 'light' | 'dark';
}

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const AuthScreen: React.FC<AuthScreenProps> = ({
  mode,
  onSwitchMode,
  onSkip,
  onBack,
  theme = 'light',
}) => {
  const { signInWithGoogle, loading } = useAuth();
  const isSignUp = mode === 'signup';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 transition-colors">
      {/* Top Navigation Bar with Back Button and Brand */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="dark:hidden">
            <Logo variant="horizontal" onDark={false} />
          </span>
          <span className="hidden dark:inline">
            <Logo variant="horizontal" onDark={true} />
          </span>
        </div>
      </header>

      {/* Main Centered Auth Card */}
      <main className="w-full max-w-md mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8 space-y-6 transition-colors">
          {/* Header Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isSignUp ? 'Create your free account' : 'Welcome back'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isSignUp
                ? 'Sign up with Google to get started. It takes one click.'
                : 'Welcome back. Sign in with Google to continue.'}
            </p>
          </div>

          {/* Primary Action: Official Google Sign-In / Sign-Up Button & Consent Line */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full min-h-[44px] px-4 py-3 rounded-xl flex items-center justify-center gap-3 font-medium transition-all shadow-2xs hover:opacity-95 active:scale-[0.99] focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#F2F2F2',
                color: '#1F1F1F',
                fontSize: '14px',
                lineHeight: '20px',
              }}
            >
              <GoogleIcon className="w-5 h-5 shrink-0" />
              <span className="font-semibold">
                {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
              </span>
            </button>

            <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
              By continuing, you agree to our{' '}
              <a
                href="/privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-700 dark:hover:text-slate-200"
              >
                Privacy Policy
              </a>.
            </p>
          </div>

          {/* Secondary Actions: Skip (only on sign up) and Mode Switcher */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-4 text-center">
            {isSignUp && (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={onSkip}
                  className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline py-1 focus:outline-hidden focus:ring-2 focus:ring-blue-500 rounded"
                >
                  Skip for now
                </button>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your practice stays on this device.
                </p>
              </div>
            )}

            <div className="text-xs text-slate-600 dark:text-slate-400">
              {isSignUp ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onSwitchMode('login')}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline py-1 focus:outline-hidden focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Log in
                  </button>
                </span>
              ) : (
                <span>
                  New here?{' '}
                  <button
                    type="button"
                    onClick={() => onSwitchMode('signup')}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline py-1 focus:outline-hidden focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Sign up
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Clean Bottom Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-500 dark:text-slate-500">
        ResolvAI · Deliberate practice for executive communication
      </footer>
    </div>
  );
};
