import React, { useState } from 'react';
import { 
  ProgressSummary, 
  PracticeSession, 
  Topic,
  Attempt
} from '../types';
import { 
  TrendingUp, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  BarChart3, 
  Award, 
  Layers 
} from 'lucide-react';

interface ProgressViewProps {
  progressSummary: ProgressSummary;
  sessions: PracticeSession[];
  topics: Topic[];
  onStartPractice: (topic: Topic) => void;
  onReviewSession?: (session: PracticeSession) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progressSummary,
  sessions,
  topics,
  onStartPractice,
  onReviewSession,
}) => {
  const isNewUser = progressSummary.daysCompleted === 0;
  const targetBenchmark = 85;

  const evaluatedSessions = sessions
    .filter((s) => s.originalAttempt?.evaluation)
    .sort((a, b) => (a.dayNumber || 1) - (b.dayNumber || 1));

  const topicMap = new Map<string, Topic>();
  topics.forEach((t) => topicMap.set(t.id, t));

  const nextTopic = topics.find((t) => !sessions.some((s) => s.topicId === t.id && s.originalAttempt)) || topics[0];

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/60 font-mono">
            GROWTH ANALYTICS
          </span>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/60 flex items-center gap-1 font-mono">
            <Target className="w-3 h-3" />
            Executive Benchmark: {targetBenchmark}/100
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Progress & Benchmark Trajectory
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Derived strictly from your saved practice records. No vanity metrics or punitive streaks.
        </p>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500 font-mono block">
            Days Completed
          </span>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {progressSummary.daysCompleted} <span className="text-sm font-normal text-slate-500 dark:text-slate-500">/ 30</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {Math.round((progressSummary.daysCompleted / 30) * 100)}% of 30-day ladder
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500 font-mono block">
            Attempts Recorded
          </span>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
            {progressSummary.totalAttemptsRecorded || 0}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Baselines & revisions saved
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500 font-mono block">
            Average Baseline
          </span>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {progressSummary.averageOriginalScore !== null ? `${progressSummary.averageOriginalScore}` : ' - '}
            {progressSummary.averageOriginalScore !== null && <span className="text-sm font-normal text-slate-500 dark:text-slate-500">/100</span>}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Initial attempt performance
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500 font-mono block">
            Average Revision
          </span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {progressSummary.averageRevisedScore !== null ? `${progressSummary.averageRevisedScore}` : ' - '}
            {progressSummary.averageRevisedScore !== null && <span className="text-sm font-normal text-emerald-400">/100</span>}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {progressSummary.averageRevisionGain ? `+${progressSummary.averageRevisionGain} avg gain` : 'Score after feedback'}
          </p>
        </div>
      </div>

      {/* 📊 ALL-ATTEMPTS BENCHMARK PROGRESSION CHART */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              All Attempts Benchmark Chart
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Visual trajectory comparing your Attempt 1 (Baseline) vs. Attempt 2 (Revision) against the 85-point Executive Standard.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-slate-400" />
              <span>Attempt 1 (Baseline)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-600" />
              <span>Attempt 2 (Revision)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 border-t-2 border-dashed border-emerald-500" />
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">85 Benchmark</span>
            </div>
          </div>
        </div>

        {evaluatedSessions.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
            <BarChart3 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No attempts evaluated yet</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Complete your first exercise and submit a revision. Your historical benchmark trajectory will plot your score gains against the 85 executive standard right here.
            </p>
            <button
              onClick={() => onStartPractice(nextTopic)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Start Day {nextTopic.dayNumber} practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {evaluatedSessions.map((session) => {
              const topic = topicMap.get(session.topicId);
              const atts = (session.attempts && session.attempts.length > 0)
                ? session.attempts
                : [session.originalAttempt, session.revisedAttempt].filter(Boolean) as Attempt[];
              const att1 = atts.find(a => a.attemptNumber === 1);
              const att2 = atts.find(a => a.attemptNumber === 2);
              const att3 = atts.find(a => a.attemptNumber === 3);

              const score1 = att1?.evaluation?.overallScore ?? session.originalAttempt?.evaluation?.overallScore ?? null;
              const score2 = att2?.evaluation?.overallScore ?? null;
              const score3 = att3?.evaluation?.overallScore ?? null;
              const bestScore = score3 ?? score2 ?? score1;
              const totalGain = (score3 !== null && score1 !== null) ? score3 - score1 : ((score2 !== null && score1 !== null) ? score2 - score1 : null);

              return (
                <div 
                  key={session.id} 
                  onClick={() => onReviewSession && onReviewSession(session)}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-100/60 dark:hover:bg-slate-850 transition-all cursor-pointer space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-700 dark:text-blue-400 font-mono">Day {session.dayNumber}:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{topic?.title || 'Daily Exercise'}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">
                        Att 1: <strong className="text-slate-800 dark:text-slate-200">{score1 ?? ' - '}</strong>
                      </span>
                      {score2 !== null && (
                        <span className="text-blue-700 dark:text-blue-300 font-bold">
                          Att 2: {score2}
                        </span>
                      )}
                      {score3 !== null && (
                        <span className="text-indigo-700 dark:text-indigo-300 font-bold">
                          Att 3: {score3}
                        </span>
                      )}
                      {totalGain !== null && (
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                          ({totalGain >= 0 ? `+${totalGain}` : totalGain} gain)
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        (bestScore ?? 0) >= targetBenchmark 
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {(bestScore ?? 0) >= targetBenchmark ? 'Benchmark Achieved ✓' : `${targetBenchmark - (bestScore ?? 0)} pts to 85`}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar Visualizer */}
                  <div className="relative h-5 w-full bg-slate-200/80 dark:bg-slate-800 rounded-lg overflow-hidden p-0.5 flex items-center">
                    {/* Target Benchmark line at 85% */}
                    <div 
                      className="absolute top-0 bottom-0 z-20 border-r-2 border-dashed border-emerald-500 pointer-events-none"
                      style={{ left: `${targetBenchmark}%` }}
                      title="Target Benchmark: 85"
                    />

                    {/* Attempt 1 Bar */}
                    <div 
                      className="h-full bg-slate-400 dark:bg-slate-500 rounded-md transition-all duration-500 opacity-70"
                      style={{ width: `${score1 || 0}%` }}
                      title={`Attempt 1: ${score1 || 0}`}
                    />

                    {/* Attempt 2 Overlay Bar */}
                    {score2 !== null && (
                      <div 
                        className="absolute left-0.5 top-0.5 bottom-0.5 bg-blue-600 rounded-md transition-all duration-500 opacity-80 shadow-xs"
                        style={{ width: `calc(${score2}% - 4px)` }}
                        title={`Attempt 2: ${score2}`}
                      />
                    )}

                    {/* Attempt 3 Overlay Bar */}
                    {score3 !== null && (
                      <div 
                        className="absolute left-0.5 top-0.5 bottom-0.5 bg-indigo-600 rounded-md transition-all duration-500 opacity-95 shadow-xs"
                        style={{ width: `calc(${score3}% - 4px)` }}
                        title={`Attempt 3: ${score3}`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dimension Breakdown vs. Benchmark */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
        <div>
          <h3 className="text-base font-bold text-slate-950 dark:text-white">Dimension Averages vs. 85 Benchmark</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Aggregate performance across the 4 core communication axes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Clarity & Brevity</span>
              <span className="font-mono">{progressSummary.dimensionAverages.clarity ?? ' - '}/100</span>
            </div>
            <div className="relative h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 border-r-2 border-dashed border-emerald-500 z-10"
                style={{ left: `${targetBenchmark}%` }}
              />
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${progressSummary.dimensionAverages.clarity || 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Structure & Flow</span>
              <span className="font-mono">{progressSummary.dimensionAverages.structureAndFlow ?? ' - '}/100</span>
            </div>
            <div className="relative h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 border-r-2 border-dashed border-emerald-500 z-10"
                style={{ left: `${targetBenchmark}%` }}
              />
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${progressSummary.dimensionAverages.structureAndFlow || 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Specificity & Evidence</span>
              <span className="font-mono">{progressSummary.dimensionAverages.specificity ?? ' - '}/100</span>
            </div>
            <div className="relative h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 border-r-2 border-dashed border-emerald-500 z-10"
                style={{ left: `${targetBenchmark}%` }}
              />
              <div 
                className="h-full bg-amber-500 rounded-full" 
                style={{ width: `${progressSummary.dimensionAverages.specificity || 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Language Effectiveness</span>
              <span className="font-mono">{progressSummary.dimensionAverages.languageEffectiveness ?? ' - '}/100</span>
            </div>
            <div className="relative h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 border-r-2 border-dashed border-emerald-500 z-10"
                style={{ left: `${targetBenchmark}%` }}
              />
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${progressSummary.dimensionAverages.languageEffectiveness || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Observed Improvement Areas */}
      {progressSummary.frequentImprovementAreas.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-3 transition-colors">
          <h3 className="text-sm font-bold text-slate-950 dark:text-white">Most Frequent Improvement Priorities</h3>
          <div className="space-y-2">
            {progressSummary.frequentImprovementAreas.map((area, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-white dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-800 dark:text-slate-200 font-medium">{area.area}</span>
                <span className="text-slate-400 dark:text-slate-500 font-mono">{area.count} session(s)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
