import React, { useState, useEffect } from 'react';
import { 
  PracticeSession, 
  Topic, 
  Attempt, 
  UserProfile
} from '../types';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  Flame, 
  Dumbbell, 
  BookOpen, 
  FileEdit
} from 'lucide-react';
import { BenchmarkChart } from './BenchmarkChart';
import { AiDisclaimer } from './AiDisclaimer';

interface EvaluationViewProps {
  session: PracticeSession;
  topic: Topic;
  userProfile?: UserProfile;
  onStartRevision: (targetAttemptNumber?: number, initialDraft?: string) => void;
  onNavigateToProgress: () => void;
  onOpenDrill: () => void;
  onOpenReflection: () => void;
  onReturnToGym: () => void;
  onCompleteDay?: (sessionId: string) => void;
}

/**
 * Validation check for AI-Assisted Example:
 * Every capitalized name and every number in the example must also appear in the user's original text.
 * If the check fails, the rewrite is hidden to avoid presenting hallucinated claims or names.
 */
function isValidAssistedExample(example: string | undefined | null, originalText: string): boolean {
  if (!example || !example.trim() || !originalText) return false;

  const originalNorm = originalText.toLowerCase();

  // 1. Numbers check (support digit and word forms: e.g. '2' and 'two')
  const numToWords: Record<string, string> = {
    '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five',
    '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten'
  };
  const numbersInExample = example.match(/\b\d+(?:[\.,]\d+)?\b/g) || [];
  for (const num of numbersInExample) {
    const wordForm = numToWords[num];
    if (!originalText.includes(num) && (!wordForm || !originalNorm.includes(wordForm))) {
      return false;
    }
  }

  // 2. Capitalized name / proper noun check with natural transition allowance
  const words = example.split(/\s+/);
  const commonWords = new Set([
    'a', 'an', 'the', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'my', 'your', 'his', 'her', 'its', 'our', 'their',
    'in', 'on', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'out', 'off', 'over', 'under',
    'and', 'but', 'or', 'nor', 'so', 'yet',
    'as', 'if', 'when', 'than', 'because', 'while', 'where', 'although', 'though', 'since',
    'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'can', 'could', 'shall', 'should', 'will', 'would', 'may', 'might', 'must',
    'hello', 'hi', 'good', 'morning', 'afternoon', 'evening', 'currently', 'additionally', 'furthermore', 'first', 'second', 'finally', 'next', 'overall',
    'every', 'twice', 'earlier', 'now', 'today', 'sometimes', 'regularly',
    'before', 'after', 'when', 'while', 'because', 'although', 'however',
    'therefore', 'instead', 'meanwhile', 'specifically', 'ultimately',
    'rebuilding', 'starting', 'getting', 'pushing', 'practicing', 'working'
  ]);

  for (const rawWord of words) {
    const cleaned = rawWord.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
    if (!cleaned) continue;

    if (/^[A-Z][a-z]+$/.test(cleaned)) {
      const lower = cleaned.toLowerCase();
      if (commonWords.has(lower)) {
        continue;
      }
      if (!originalNorm.includes(lower)) {
        return false;
      }
    }
  }

  return true;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  session,
  topic,
  userProfile,
  onStartRevision,
  onNavigateToProgress,
  onOpenDrill,
  onOpenReflection,
  onReturnToGym,
  onCompleteDay,
}) => {
  // Normalize attempts array
  const attempts: Attempt[] = (session.attempts && session.attempts.length > 0)
    ? [...session.attempts].sort((a, b) => (a.attemptNumber || 1) - (b.attemptNumber || 1))
    : [
        session.originalAttempt ? { ...session.originalAttempt, attemptNumber: 1 } : null,
        session.revisedAttempt ? { ...session.revisedAttempt, attemptNumber: 2 } : null
      ].filter(Boolean) as Attempt[];

  // Retrieve initial attempt from localStorage if saved, else default to latest attempt
  const getInitialAttemptNum = (): number => {
    try {
      const saved = localStorage.getItem(`product_one_selected_attempt_${session.id}`);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (attempts.some(a => a.attemptNumber === parsed)) {
          return parsed;
        }
      }
    } catch {}
    return attempts.length > 0 ? (attempts[attempts.length - 1].attemptNumber || 1) : 1;
  };

  const [selectedAttemptNum, setSelectedAttemptNum] = useState<number>(getInitialAttemptNum);
  const [copiedExample, setCopiedExample] = useState(false);

  // Sync selected attempt when session attempts update
  useEffect(() => {
    if (attempts.length > 0) {
      try {
        const saved = localStorage.getItem(`product_one_selected_attempt_${session.id}`);
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (attempts.some(a => a.attemptNumber === parsed)) {
            setSelectedAttemptNum(parsed);
            return;
          }
        }
      } catch {}
      const latest = attempts[attempts.length - 1].attemptNumber || 1;
      setSelectedAttemptNum(latest);
    }
  }, [session.id, session.attempts?.length, attempts.length]);

  const handleSelectAttempt = (num: number) => {
    setSelectedAttemptNum(num);
    try {
      localStorage.setItem(`product_one_selected_attempt_${session.id}`, num.toString());
    } catch {}
  };

  const originalAttempt = attempts.find(a => a.attemptNumber === 1) || session.originalAttempt;
  const currentViewAttempt = attempts.find(a => a.attemptNumber === selectedAttemptNum) || attempts[attempts.length - 1] || originalAttempt;

  if (!originalAttempt || !originalAttempt.evaluation) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <p className="text-slate-500 dark:text-slate-400">No evaluation found for this exercise.</p>
        <button
          onClick={onReturnToGym}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold"
        >
          Return to Topic ladder
        </button>
      </div>
    );
  }

  const ev = currentViewAttempt.evaluation || originalAttempt.evaluation!;
  const origScore = originalAttempt.evaluation?.overallScore ?? 0;
  const currentScore = ev.overallScore ?? origScore;
  const scoreDelta = currentScore - origScore;

  // Localhost dev detection for truth diagnostics
  const isDevLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Verify AI Assisted Example
  const showAiExample = ev.evaluationSource === 'live-ai' && 
    isValidAssistedExample(ev.aiAssistedExample, currentViewAttempt.userAuthoredContent);

  const handleCopyExample = () => {
    if (ev.aiAssistedExample) {
      navigator.clipboard.writeText(ev.aiAssistedExample);
      setCopiedExample(true);
      setTimeout(() => setCopiedExample(false), 2500);
    }
  };

  const handleAdoptAsRevision = () => {
    if (ev.aiAssistedExample) {
      onStartRevision(attempts.length + 1, ev.aiAssistedExample);
    }
  };

  const userAuthoredContent = currentViewAttempt.userAuthoredContent || '';
  const wordCount = currentViewAttempt.wordCount || userAuthoredContent.trim().split(/\s+/).filter(Boolean).length;

  // GAIN Check data
  const gainData = ev.gain_checklist;
  const hasGainData = Boolean(
    gainData &&
    typeof gainData === 'object' &&
    (typeof gainData.greet !== 'undefined' ||
     typeof gainData.acknowledge !== 'undefined' ||
     typeof gainData.insight !== 'undefined' ||
     typeof gainData.navigateOut !== 'undefined')
  );

  const gainSteps = [
    { key: 'greet', label: 'Greet', description: 'Opening greeting and engagement' },
    { key: 'acknowledge', label: 'Acknowledge', description: 'Context and situation framing' },
    { key: 'insight', label: 'Insight', description: 'Core value or operational perspective' },
    { key: 'navigateOut', label: 'Navigate Out', description: 'Next step, transition, or call to action' },
  ] as const;

  const getGainStepData = (key: 'greet' | 'acknowledge' | 'insight' | 'navigateOut') => {
    if (!gainData) return { isPresent: false, quote: undefined };
    const val = (gainData as any)[key];
    let isPresent = false;
    let quote: string | undefined = undefined;

    if (typeof val === 'boolean') {
      isPresent = val;
    } else if (typeof val === 'object' && val !== null) {
      isPresent = Boolean(val.present ?? val.followed ?? val.checked ?? true);
      if (typeof val.quote === 'string' && val.quote.trim()) {
        quote = val.quote.trim();
      }
    }

    if (!quote && gainData.quotes && typeof gainData.quotes[key] === 'string' && gainData.quotes[key].trim()) {
      quote = gainData.quotes[key].trim();
    }

    return { isPresent, quote };
  };

  // Guideline Checks data
  const guidelineChecks = ev.guideline_checks;
  const hasGuidelineData = Array.isArray(guidelineChecks) && guidelineChecks.length > 0;

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Navigation & Interactive Attempt Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onReturnToGym}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors self-start group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Topic ladder</span>
        </button>

        {/* Attempt Selector Pills (Attempt 1, 2, 3) */}
        <div className="flex flex-wrap items-center bg-white dark:bg-slate-900 p-1 rounded-xl self-start sm:self-auto gap-1 border border-slate-300 dark:border-slate-800">
          {attempts.map((att) => {
            const num = att.attemptNumber || 1;
            const isSelected = selectedAttemptNum === num;
            const attScore = att.evaluation?.overallScore;
            return (
              <button
                key={num}
                type="button"
                onClick={() => handleSelectAttempt(num)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 sm:gap-1.5 ${
                  isSelected
                    ? num === 1
                      ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
                      : num === 2
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
                title={`Click to view Attempt ${num}`}
              >
                <span className="sm:hidden">Attempt {num}</span>
                <span className="hidden sm:inline">{num === 1 ? 'Attempt 1 (Baseline)' : num === 2 ? 'Attempt 2 (Revision)' : 'Attempt 3 (Final)'}</span>
                {attScore !== undefined && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {attScore}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Revision Button if < 3 attempts */}
          {attempts.length < 3 && (
            <button
              type="button"
              onClick={() => onStartRevision(attempts.length + 1)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors flex items-center gap-1 border border-dashed border-blue-300 dark:border-blue-800"
              title={`Draft Attempt ${attempts.length + 1}`}
            >
              <RotateCcw className="w-3 h-3" />
              <span className="sm:hidden">+ Revise</span>
              <span className="hidden sm:inline">+ Draft Attempt {attempts.length + 1}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Score Hero Card for Current Selected Attempt */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500 font-mono">
              DAY {topic.dayNumber} · {topic.title.toUpperCase()}
            </span>
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono ${
              selectedAttemptNum === 1
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                : selectedAttemptNum === 2
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/60'
            }`}>
              VIEWING ATTEMPT {selectedAttemptNum} {selectedAttemptNum === 1 ? '(BASELINE)' : selectedAttemptNum === 2 ? '(REVISION)' : '(FINAL)'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ev.evaluationSource === 'live-ai' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/60 font-mono">
                <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                AI feedback
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/60 font-mono">
                <CheckCircle2 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                Instant feedback
              </span>
            )}

            {/* In dev on localhost only: show Fallback reason */}
            {isDevLocalhost && ev.evaluationSource !== 'live-ai' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 font-mono">
                Fallback reason: {ev.fallbackReason || 'local analysis'}
              </span>
            )}

            {ev.isHarshCritique && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/60">
                <Flame className="w-3 h-3 fill-rose-600" />
                Direct critique standard
              </span>
            )}
            {selectedAttemptNum > 1 && (
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                scoreDelta >= 0 
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {scoreDelta >= 0 ? `+${scoreDelta} gain from baseline` : `${scoreDelta} delta`}
              </span>
            )}
          </div>
        </div>

        {/* Big Score Display */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              {ev.overallScore ?? ' - '}
            </span>
            <span className="text-lg font-bold text-slate-500 dark:text-slate-500">
              /100
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            {ev.overallAssessment}
          </p>
        </div>

        {/* 4 Dimension Score Bars with Full Word Wrapping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Clarity & Brevity */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              <span>Clarity & Brevity</span>
              <span className={`font-semibold ${
                (ev.dimensions.clarity.score || 0) < 65 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
              }`}>
                {ev.dimensions.clarity.score ?? ' - '}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  (ev.dimensions.clarity.score || 0) < 65 
                    ? 'bg-amber-500' 
                    : selectedAttemptNum === 1 ? 'bg-slate-700 dark:bg-slate-500' : selectedAttemptNum === 2 ? 'bg-blue-600' : 'bg-indigo-600'
                }`}
                style={{ width: `${ev.dimensions.clarity.score || 0}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed whitespace-normal break-words">
              {ev.dimensions.clarity.explanation}
            </p>
          </div>

          {/* Structure & Flow */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              <span>Structure & Flow</span>
              <span className={`font-semibold ${
                (ev.dimensions.structureAndFlow.score || 0) < 65 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
              }`}>
                {ev.dimensions.structureAndFlow.score ?? ' - '}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  (ev.dimensions.structureAndFlow.score || 0) < 65 
                    ? 'bg-amber-500' 
                    : selectedAttemptNum === 1 ? 'bg-slate-700 dark:bg-slate-500' : selectedAttemptNum === 2 ? 'bg-blue-600' : 'bg-indigo-600'
                }`}
                style={{ width: `${ev.dimensions.structureAndFlow.score || 0}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed whitespace-normal break-words">
              {ev.dimensions.structureAndFlow.explanation}
            </p>
          </div>

          {/* Specificity & Evidence */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              <span>Specificity & Evidence</span>
              <span className={`font-semibold ${
                (ev.dimensions.specificity.score || 0) < 65 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
              }`}>
                {ev.dimensions.specificity.score ?? ' - '}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  (ev.dimensions.specificity.score || 0) < 65 
                    ? 'bg-amber-500' 
                    : selectedAttemptNum === 1 ? 'bg-slate-700 dark:bg-slate-500' : selectedAttemptNum === 2 ? 'bg-blue-600' : 'bg-indigo-600'
                }`}
                style={{ width: `${ev.dimensions.specificity.score || 0}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed whitespace-normal break-words">
              {ev.dimensions.specificity.explanation}
            </p>
          </div>

          {/* Language Effectiveness */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              <span>Language Effectiveness</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {ev.dimensions.languageEffectiveness.score ?? ' - '}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  selectedAttemptNum === 1 ? 'bg-slate-700 dark:bg-slate-500' : selectedAttemptNum === 2 ? 'bg-blue-600' : 'bg-indigo-600'
                }`}
                style={{ width: `${ev.dimensions.languageEffectiveness.score || 0}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed whitespace-normal break-words">
              {ev.dimensions.languageEffectiveness.explanation}
            </p>
          </div>
        </div>

        {/* Priority Improvement Callout Box */}
        <div className="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-900/60 rounded-xl p-4 text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
          <span className="font-bold text-amber-900 dark:text-amber-300">Priority for Attempt {selectedAttemptNum}: </span>
          {ev.mainImprovementPriority}
        </div>
      </div>

      {/* CORE TRANSFORMATION STAGE: AUTHENTIC DRAFT & ARTICULATED MODEL */}
      <div className={`grid grid-cols-1 ${showAiExample && ev.aiAssistedExample ? 'lg:grid-cols-2' : ''} gap-4 sm:gap-6 items-stretch`}>
        {/* Left: Your Authentic Response */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-sm p-6 sm:p-7 space-y-3 transition-colors flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500 font-mono">
                Your response
              </span>
              <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                {wordCount} words
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed font-normal whitespace-pre-wrap">
              {userAuthoredContent || 'No response recorded.'}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-500 font-mono">
            Authentic practitioner draft (Attempt {selectedAttemptNum})
          </div>
        </div>

        {/* Right: The Articulated Model Version */}
        {showAiExample && ev.aiAssistedExample && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-300 dark:border-blue-900/50 shadow-sm p-6 sm:p-7 space-y-4 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full font-mono border border-blue-200 dark:border-blue-900/60">
                      AI Mentor Model
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {ev.aiAssistedExample.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mt-1.5">
                    One example of how it could sound
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleCopyExample}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
                  >
                    {copiedExample ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedExample ? 'Copied' : 'Copy'}</span>
                  </button>

                  {attempts.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAdoptAsRevision}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Adopt as Draft →</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-blue-50/40 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/40 text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed font-normal whitespace-pre-wrap">
                {ev.aiAssistedExample}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-500 font-mono">
              Structured to follow the {topic.guidelines.title} arc while preserving 100% of your authentic facts.
            </div>
          </div>
        )}
      </div>

      {/* GAIN CHECK: Rendered only when topic framework is GAIN and data is present */}
      {topic.guidelines?.type === 'GAIN' && hasGainData && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-sm p-6 sm:p-7 space-y-4 transition-colors">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500 font-mono">
              GAIN check
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {gainSteps.map((step) => {
              const { isPresent, quote } = getGainStepData(step.key);
              return (
                <div 
                  key={step.key}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {step.label}
                    </span>
                    {isPresent ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/60 font-mono">
                        <Check className="w-3 h-3" />
                        Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-700/60 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700 font-mono">
                        Missing
                      </span>
                    )}
                  </div>
                  {quote ? (
                    <p className="text-xs italic text-slate-600 dark:text-slate-400 pl-2 border-l-2 border-slate-300 dark:border-slate-700 break-words">
                      "{quote}"
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {step.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION C: GUIDELINE CHECKS (The day's Do list) */}
      {hasGuidelineData && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-sm p-6 sm:p-7 space-y-4 transition-colors">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500 font-mono">
              Guideline checks
            </span>
          </div>
          <div className="space-y-3">
            {guidelineChecks!.map((item, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-2.5"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {item.guideline}
                  </p>
                  {item.observation && (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {item.observation}
                    </p>
                  )}
                </div>
                <div className="shrink-0 self-start">
                  {item.followed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/60 font-mono">
                      <Check className="w-3 h-3" />
                      Present
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-700/60 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700 font-mono">
                      Missing
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION D: STRENGTH AND NEXT STEP */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-sm p-6 sm:p-7 space-y-4 transition-colors">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500 font-mono">
            Strength and next step
          </span>
        </div>
        <div className="space-y-3">
          {/* One Strength */}
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-mono">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Strength</span>
            </div>
            <p className="text-sm text-emerald-950 dark:text-emerald-100 leading-relaxed">
              {ev.strongestElement || 'Clear and authentic communication foundation.'}
            </p>
          </div>

          {/* One Improvement */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Next step</span>
            </div>
            <p className="text-sm text-amber-950 dark:text-amber-100 leading-relaxed">
              {ev.mainImprovementPriority}
            </p>
          </div>

          {/* Reflection Question */}
          {ev.reflection_question && (
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 font-mono">
                <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Reflection question</span>
              </div>
              <p className="text-sm text-blue-950 dark:text-blue-100 leading-relaxed">
                {ev.reflection_question}
              </p>
            </div>
          )}
        </div>
        {ev.evaluationSource === 'live-ai' && <AiDisclaimer />}
      </div>

      {/* BENCHMARK CHART: Multi-Attempt Progression & Evolution */}
      <BenchmarkChart
        attempts={attempts}
        selectedAttemptNum={selectedAttemptNum}
        onSelectAttempt={handleSelectAttempt}
      />

      {/* Bottom Action Grid: Retry, Drill, Reflection */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {attempts.length < 3 
              ? `Ready to draft Attempt ${attempts.length + 1}?` 
              : 'All 3 attempts completed!'}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {attempts.length === 1 
              ? 'Apply the suggested feedback in Attempt 2 to measure your score gain.'
              : attempts.length === 2
                ? 'Draft your 3rd and final mastery attempt to lock in the communication pattern.'
                : 'You have completed all 3 practice attempts for this topic. Lock in your reflection below.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenDrill}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Dumbbell className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Targeted micro-drill</span>
          </button>

          <button
            onClick={onOpenReflection}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{session.reflection ? 'Edit reflection' : 'Save reflection'}</span>
          </button>

          {attempts.length < 3 ? (
            <>
              <button
                onClick={() => onStartRevision(attempts.length + 1)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry and improve (Attempt {attempts.length + 1} of 3)</span>
              </button>
              <button
                onClick={onReturnToGym}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 border border-transparent dark:border-slate-700"
              >
                <span>Topic ladder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            onCompleteDay ? (
              <button
                onClick={() => onCompleteDay(session.id)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                title="Mark this exercise complete and unlock the next day"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Complete Day & Unlock Next</span>
              </button>
            ) : (
              <button
                onClick={onReturnToGym}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 border border-transparent dark:border-slate-700"
              >
                <span>Topic ladder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
