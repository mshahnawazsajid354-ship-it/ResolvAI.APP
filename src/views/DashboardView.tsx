import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Flame, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import { UserProfile, ProgressSummary, Topic, PracticeSession } from '../types';
import { isSessionCompleted, isSessionInProgress } from '../services/storage';
import { useAuth } from '../context/AuthContext';

interface DashboardViewProps {
  userProfile: UserProfile;
  progressSummary: ProgressSummary;
  topics: Topic[];
  recentSessions: PracticeSession[];
  onStartPractice: (topic: Topic) => void;
  onNavigateToGym: () => void;
  onNavigateToProgress: () => void;
  onNavigateToVault: () => void;
  onReopenSession: (session: PracticeSession) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  progressSummary,
  topics,
  recentSessions,
  onStartPractice,
  onNavigateToGym,
  onNavigateToProgress,
  onNavigateToVault,
  onReopenSession,
}) => {
  const { user } = useAuth();
  const isNewUser = progressSummary.daysCompleted === 0;

  // Map completed topics
  const sessionMap = new Map<string, PracticeSession>();
  recentSessions.forEach((s) => sessionMap.set(s.topicId, s));

  // Determine completed topic IDs using authentic status
  const completedTopicIds = new Set(
    recentSessions
      .filter((s) => isSessionCompleted(s))
      .map((s) => s.topicId)
  );

  // Check for active in-progress session
  const inProgressSession = recentSessions.find((s) => isSessionInProgress(s));
  const inProgressTopic = inProgressSession ? topics.find((t) => t.id === inProgressSession.topicId) : undefined;

  // Active topic is the in-progress topic if one exists, otherwise the first uncompleted topic
  const nextTopic = inProgressTopic || topics.find((t) => !completedTopicIds.has(t.id)) || topics[0];
  const isCurrentInProgress = inProgressTopic && nextTopic.id === inProgressTopic.id;

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-14 space-y-8 sm:space-y-10 animate-fadeIn">
      {/* 1. Minimal Header Greeting & App Info */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Executive Communication Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome back, {userProfile.displayName || 'Practitioner'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
          Build structured, clear, and confident communication through five minutes of deliberate daily practice.
        </p>
      </div>

      {/* 2. Today's Practice Card (Ultra Clean & Focused Hero CTA) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-300 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-mono ${
              isCurrentInProgress
                ? 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/60'
                : 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900/60'
            }`}>
              DAY {nextTopic.dayNumber} : {isCurrentInProgress ? 'IN PROGRESS' : nextTopic.stageTitle.split(':')[0].toUpperCase()}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-500 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              ~{nextTopic.suggestedCompletionMinutes} min
            </span>
          </div>

          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {nextTopic.guidelines.type} Framework
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {nextTopic.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {nextTopic.objective}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {isCurrentInProgress ? (
              <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>You have an in-progress draft (Attempt {inProgressSession?.attempts?.length ?? 1} of 3)</span>
              </span>
            ) : (
              <span>Ready for today's response? Takes about 5 minutes.</span>
            )}
          </div>

          <button
            onClick={() => isCurrentInProgress && inProgressSession ? onReopenSession(inProgressSession) : onStartPractice(nextTopic)}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isCurrentInProgress
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            <span>{isCurrentInProgress ? `Resume Day ${nextTopic.dayNumber}` : `Start Day ${nextTopic.dayNumber} Practice`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. About ResolvAI (Minimal Info in 3 Clean Cards) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500 font-mono">
          How ResolvAI Works
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xs font-bold font-mono">
              01
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Daily Deliberate Practice</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              One focused prompt each day structured to build authentic verbal clarity.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">
              02
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Calibrated AI Feedback</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Objective scoring on Clarity, Structure, Specificity, and Language with concrete quotes.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
              03
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Side-by-Side Revision</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Inspect polished versions and retry up to 3 attempts to lock in speech habits.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Minimal Progress Overview Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4 sm:gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-500 font-mono block">Completed</span>
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {progressSummary.daysCompleted} / 30 Days
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

          <div>
            <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-500 font-mono block">Streak</span>
            <span className="text-base sm:text-lg font-black text-amber-500 flex items-center gap-1">
              <span>🔥</span>
              <span>{progressSummary.currentStreak} Days</span>
            </span>
          </div>

          {(progressSummary.totalAttemptsRecorded ?? 0) > 0 && (
            <>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
              <div className="hidden sm:block">
                <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-500 font-mono block">Total Attempts</span>
                <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">
                  {progressSummary.totalAttemptsRecorded}
                </span>
              </div>
            </>
          )}
        </div>

        <button
          onClick={onNavigateToGym}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          <span>Explore full 30-day curriculum</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5. Minimal Privacy Guarantee Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-500 text-center pt-2">
        <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-slate-500" />
        <span>
          {user
            ? 'Your practice is saved on this device.'
            : 'Your practice is saved on this device. No sign-up required.'}
        </span>
      </div>
    </div>
  );
};
