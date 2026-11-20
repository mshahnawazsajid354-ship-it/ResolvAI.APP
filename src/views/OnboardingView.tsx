import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Flame, 
  Gem,
  Sun,
  Moon
} from 'lucide-react';
import { UserProfile, CommunicationGoal } from '../types';

interface OnboardingViewProps {
  onComplete: (profile: Partial<UserProfile>) => void;
  onBackToLanding: () => void;
  initialProfile: UserProfile;
  theme?: 'light' | 'dark';
  onSetTheme?: (theme: 'light' | 'dark') => void;
  onToggleTheme?: () => void;
  googleDisplayName?: string;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onComplete,
  onBackToLanding,
  initialProfile,
  theme = 'light',
  onSetTheme,
  onToggleTheme,
  googleDisplayName,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State - prefill with googleDisplayName if initialProfile is empty or 'Practitioner'
  const [displayName, setDisplayName] = useState(() => {
    if (initialProfile.displayName && initialProfile.displayName !== 'Practitioner') {
      return initialProfile.displayName;
    }
    return googleDisplayName || '';
  });

  // 6 Core Goals from Emergent
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Workplace communication',
    'Job interviews',
  ]);

  // Level Selection
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  // Daily time
  const [practiceTime, setPracticeTime] = useState<number>(10);

  // Feedback Style (Direct Critique Toggle)
  const [directCritique, setDirectCritique] = useState<boolean>(false);

  const goalOptions = [
    { id: 'job-interviews', label: 'Job interviews', mapped: 'prepare-interviews' as CommunicationGoal },
    { id: 'workplace-comms', label: 'Workplace communication', mapped: 'improve-professional' as CommunicationGoal },
    { id: 'presentations', label: 'Presentations', mapped: 'storytelling-persuasion' as CommunicationGoal },
    { id: 'english-fluency', label: 'English fluency', mapped: 'practise-english' as CommunicationGoal },
    { id: 'speaking-confidence', label: 'Speaking confidence', mapped: 'express-thoughts' as CommunicationGoal },
    { id: 'clear-writing', label: 'Clear writing', mapped: 'everyday-communication' as CommunicationGoal },
  ];

  const toggleGoal = (label: string) => {
    if (selectedGoals.includes(label)) {
      if (selectedGoals.length > 1) {
        setSelectedGoals(selectedGoals.filter((g) => g !== label));
      }
    } else {
      setSelectedGoals([...selectedGoals, label]);
    }
  };

  const handleFinish = () => {
    const mappedGoals: CommunicationGoal[] = goalOptions
      .filter((opt) => selectedGoals.includes(opt.label))
      .map((opt) => opt.mapped);

    onComplete({
      displayName: displayName.trim() || 'Practitioner',
      goals: mappedGoals.length > 0 ? mappedGoals : ['express-thoughts', 'improve-professional'],
      roadmapDays: 30,
      preferences: {
        ...initialProfile.preferences,
        sessionLengthMinutes: practiceTime,
        experienceLevel: level,
        directCritiqueMode: directCritique,
      },
      onboardingCompleted: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 transition-colors">
      {/* Top Header with Progress and Theme Toggle */}
      <header className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-3 flex items-center justify-between gap-4">
        <div className="flex-1 grid grid-cols-3 gap-2 sm:gap-3">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-800'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-800'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-800'}`} />
        </div>

        {/* Compact Theme Switcher */}
        <div 
          className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-2xs shrink-0"
          title={`Active theme: ${theme === 'light' ? 'Light' : 'Dark'}. Click to toggle.`}
        >
          <button
            type="button"
            onClick={() => onSetTheme ? onSetTheme('light') : onToggleTheme?.()}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
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
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
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
      </header>

      {/* Main Step Content */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col justify-center">
        {/* ================= STEP 1: What are you training for? ================= */}
        {step === 1 && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 font-mono">
                STEP 1 OF 3
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                What are you training for?
              </h1>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                What should we call you? <span className="text-slate-500 dark:text-slate-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-sm text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-500 font-medium"
              />
            </div>

            {/* Choose Goals Grid */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Choose your goals
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {goalOptions.map((goal) => {
                  const isSelected = selectedGoals.includes(goal.label);
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => toggleGoal(goal.label)}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 font-semibold shadow-xs'
                          : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700'
                      }`}
                    >
                      <span>{goal.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 sm:pt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onBackToLanding}
                className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: Set your practice preferences ================= */}
        {step === 2 && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 font-mono">
                STEP 2 OF 3
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Set your practice preferences
              </h1>
            </div>

            {/* Current Level */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Current level
              </label>
              <div className="space-y-2.5">
                {[
                  { id: 'beginner', title: 'Beginner', desc: 'I often struggle to organise my thoughts' },
                  { id: 'intermediate', title: 'Intermediate', desc: "I'm okay but want to be sharper" },
                  { id: 'advanced', title: 'Advanced', desc: 'I want to perform under pressure' },
                ].map((item) => {
                  const isSelected = level === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setLevel(item.id as any)}
                      className={`w-full p-3.5 sm:p-4 rounded-xl border text-left transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs'
                          : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className={`text-sm font-bold ${isSelected ? 'text-blue-900 dark:text-blue-200' : 'text-slate-900 dark:text-white'}`}>
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Daily Practice Time Pills */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Daily practice time
              </label>
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                {[5, 10, 15, 20].map((mins) => {
                  const isSelected = practiceTime === mins;
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setPracticeTime(mins)}
                      className={`py-2.5 sm:py-3 px-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700'
                      }`}
                    >
                      <span>{mins} min</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 hidden sm:inline" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Default Feedback Style Toggle */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Default feedback style
              </label>

              <div
                onClick={() => setDirectCritique(!directCritique)}
                className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  directCritique
                    ? 'border-rose-300 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 shadow-xs'
                    : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-200 dark:border-transparent ${
                    directCritique ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-transparent' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {directCritique ? (
                      <Flame className="w-4 h-4" />
                    ) : (
                      <Gem className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className={`text-sm font-bold ${directCritique ? 'text-rose-950 dark:text-rose-200' : 'text-slate-900 dark:text-white'}`}>
                      {directCritique ? 'Direct critique' : 'Constructive coaching'}
                    </div>
                    <div className={`text-xs ${directCritique ? 'text-rose-700 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>
                      {directCritique ? 'Blunt, no-softening feedback' : 'Supportive, encouraging feedback'}
                    </div>
                  </div>
                </div>

                {/* Switch Pill */}
                <div
                  className={`w-11 sm:w-12 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center shrink-0 ${
                    directCritique ? 'bg-rose-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 sm:pt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: Your 30-day roadmap ================= */}
        {step === 3 && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 font-mono">
                STEP 3 OF 3
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Your 30-day roadmap
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
                Each day unlocks after you complete the one before. Retry any day as often as you like.
              </p>
            </div>

            {/* 3 Stage Cards */}
            <div className="space-y-3">
              {/* Stage A */}
              <div className="p-3.5 sm:p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3.5 sm:gap-4 shadow-xs">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black text-sm flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900/60">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Stage A: Foundations</span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-500">Days 1-10</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Express one idea clearly with simple structure.
                  </p>
                </div>
              </div>

              {/* Stage B */}
              <div className="p-3.5 sm:p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3.5 sm:gap-4 shadow-xs">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-black text-sm flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-900/60">
                  B
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Stage B: Complexity</span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-500">Days 11-20</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Trade-offs, persuasion, feedback and nuance.
                  </p>
                </div>
              </div>

              {/* Stage C */}
              <div className="p-3.5 sm:p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3.5 sm:gap-4 shadow-xs">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-black text-sm flex items-center justify-center shrink-0">
                  C
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Stage C: Pressure</span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-500">Days 21-30</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Interviews, bad news and tough questions.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 sm:pt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>Enter the gym</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-slate-500 dark:text-slate-500">
        Personal training environment · No social leaderboards · Practice stays private
      </footer>
    </div>
  );
};
