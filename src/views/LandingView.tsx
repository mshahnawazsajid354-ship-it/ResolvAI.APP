import React from 'react';
import { 
  ArrowRight, 
  Lock, 
  PenLine, 
  Gauge, 
  RotateCcw,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

interface LandingViewProps {
  onStartTraining: () => void;
  onEnterGym: () => void;
  onOpenAuth?: (mode: 'signup' | 'login') => void;
  hasExistingSession: boolean;
  productName: string;
  theme?: 'light' | 'dark';
  onSetTheme?: (theme: 'light' | 'dark') => void;
  onToggleTheme?: () => void;
  isAuthConfigured?: boolean;
  isSignedIn?: boolean;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartTraining,
  onEnterGym,
  onOpenAuth,
  hasExistingSession,
  productName,
  theme = 'light',
  onSetTheme,
  onToggleTheme,
  isAuthConfigured = false,
  isSignedIn = false,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 transition-colors">
      {/* Top Clean Navbar */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Dedicated Logo Slot Container */}
          <div 
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border-2 border-dashed border-blue-500/70 dark:border-blue-400/70 bg-blue-50/60 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xs sm:text-sm tracking-tighter shadow-2xs"
            title="Logo Slot - Blank space ready for your logo upload"
          >
            <span>R</span>
          </div>
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
            Resolv<span className="text-blue-600 dark:text-blue-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Segmented Theme Switcher */}
          <div 
            className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-2xs"
            title={`Active theme: ${theme === 'light' ? 'Light' : 'Dark'}. Click to toggle.`}
          >
            <button
              type="button"
              onClick={() => onSetTheme ? onSetTheme('light') : onToggleTheme?.()}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                theme === 'light'
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="Switch to Light theme"
            >
              <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500 fill-amber-500' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">Light</span>
            </button>
            <button
              type="button"
              onClick={() => onSetTheme ? onSetTheme('dark') : onToggleTheme?.()}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="Switch to Dark theme"
            >
              <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-blue-400 fill-blue-400' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>

          {hasExistingSession && (
            <button
              onClick={onEnterGym}
              className="hidden sm:inline-block px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Resume practice →
            </button>
          )}

          {isAuthConfigured && onOpenAuth && !isSignedIn && (
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Log in
            </button>
          )}

          <button
            onClick={onStartTraining}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Get started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-block">
              <span className="text-[11px] font-bold tracking-widest uppercase text-slate-600 dark:text-slate-400 font-mono">
                YOUR PERSONAL TRAINING ENVIRONMENT
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Train how you <span className="text-blue-600 dark:text-blue-400">express</span> your thoughts.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
              Short daily exercises, honest AI feedback and deliberate repetition - so you speak and write more clearly, coherently and confidently.
            </p>

            <div className="pt-2 space-y-3">
              <button
                onClick={onStartTraining}
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Get started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500" />
                <span>No sign-up. Practice stays private to this browser.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Score Card Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-5 sm:p-7 space-y-5 sm:space-y-6 transition-colors">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 font-mono">
                  DAY 6 · SHARE AN OPINION
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/60">
                  <CheckCircle2 className="w-3 h-3" />
                  Attempt 1
                </span>
              </div>

              {/* Big Score */}
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  74
                </span>
                <span className="text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-500">/100</span>
              </div>

              {/* Horizontal Progress Bars */}
              <div className="space-y-3.5 pt-1">
                {/* Clarity */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    <span>Clarity</span>
                    <span className="font-semibold text-slate-900 dark:text-white">82</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60 dark:border-transparent">
                    <div className="h-full bg-blue-600 rounded-full w-[82%]" />
                  </div>
                </div>

                {/* Structure */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    <span>Structure</span>
                    <span className="font-semibold text-slate-900 dark:text-white">71</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60 dark:border-transparent">
                    <div className="h-full bg-blue-600 rounded-full w-[71%]" />
                  </div>
                </div>

                {/* Specificity */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    <span>Specificity</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">58</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60 dark:border-transparent">
                    <div className="h-full bg-amber-500 rounded-full w-[58%]" />
                  </div>
                </div>

                {/* Language */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    <span>Language</span>
                    <span className="font-semibold text-slate-900 dark:text-white">84</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60 dark:border-transparent">
                    <div className="h-full bg-blue-600 rounded-full w-[84%]" />
                  </div>
                </div>
              </div>

              {/* Priority Callout Box */}
              <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/50 rounded-xl p-3.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                <span className="font-bold">Priority:</span> add one concrete example to support your second reason.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom 3-Column Feature Section */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 border-t border-slate-300 dark:border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Pillar 1 */}
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center">
              <PenLine className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Practise daily</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              One focused exercise a day across a 30-day ladder.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center">
              <Gauge className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Get scored</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              AI feedback on clarity, structure, specificity and language.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Retry and improve</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Revise with feedback and compare your attempts side by side.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
