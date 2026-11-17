import React from 'react';
import { Attempt } from '../types';
import { 
  TrendingUp, 
  MousePointerClick
} from 'lucide-react';

interface BenchmarkChartProps {
  attempts: Attempt[];
  selectedAttemptNum?: number;
  onSelectAttempt?: (attemptNum: number) => void;
}

function getBandInfo(score: number | null): { label: string; range: string; color: string } {
  if (score === null) return { label: 'Pending', range: 'No attempt yet', color: 'text-slate-400' };
  if (score >= 90) return { label: 'Excellent', range: '90-100 range', color: 'text-emerald-600 dark:text-emerald-400' };
  if (score >= 75) return { label: 'Strong', range: '75-89 range', color: 'text-blue-600 dark:text-blue-400' };
  if (score >= 60) return { label: 'Developing', range: '60-74 range', color: 'text-amber-600 dark:text-amber-400' };
  return { label: 'Needs Restructuring', range: 'Below 60', color: 'text-rose-600 dark:text-rose-400' };
}

export const BenchmarkChart: React.FC<BenchmarkChartProps> = ({
  attempts = [],
  selectedAttemptNum = 1,
  onSelectAttempt,
}) => {
  // Sorted attempts
  const sortedAttempts = [...attempts].sort((a, b) => (a.attemptNumber || 1) - (b.attemptNumber || 1));
  const attempt1 = sortedAttempts.find(a => a.attemptNumber === 1);
  const attempt2 = sortedAttempts.find(a => a.attemptNumber === 2);
  const attempt3 = sortedAttempts.find(a => a.attemptNumber === 3);

  const score1 = attempt1?.evaluation?.overallScore ?? null;
  const score2 = attempt2?.evaluation?.overallScore ?? null;
  const score3 = attempt3?.evaluation?.overallScore ?? null;

  // Active attempt score & band
  const activeScore = selectedAttemptNum === 1 
    ? score1 
    : (selectedAttemptNum === 2 ? score2 : score3);
  const band = getBandInfo(activeScore);

  // Revision progress
  const gain1to2 = (score2 !== null && score1 !== null) ? score2 - score1 : null;
  const gain2to3 = (score3 !== null && score2 !== null) ? score3 - score2 : null;

  let progressGainText = 'Baseline';
  let progressSubtitle = 'Initial starting point';
  if (selectedAttemptNum === 2) {
    if (gain1to2 !== null) {
      progressGainText = gain1to2 >= 0 ? `+${gain1to2} pts` : `${gain1to2} pts`;
      progressSubtitle = 'Progress vs. Attempt 1';
    } else {
      progressGainText = 'In Draft';
      progressSubtitle = 'Draft revision to measure';
    }
  } else if (selectedAttemptNum === 3) {
    if (gain2to3 !== null) {
      progressGainText = gain2to3 >= 0 ? `+${gain2to3} pts` : `${gain2to3} pts`;
      progressSubtitle = 'Progress vs. Attempt 2';
    } else {
      progressGainText = score2 !== null ? 'Ready' : 'Locked';
      progressSubtitle = 'Final attempt progress';
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-sm p-4 sm:p-7 space-y-5 sm:space-y-6 animate-fadeIn transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/60 font-mono">
              PROGRESSION TRACKER
            </span>
            {onSelectAttempt && (
              <span className="text-[11px] text-slate-600 dark:text-slate-400 hidden sm:inline-flex items-center gap-1">
                <MousePointerClick className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                Click any attempt to inspect
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Attempt Progression & Evolution
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Track your score trajectory across Attempt 1, Attempt 2, and Attempt 3 against calibrated score anchors.
          </p>
        </div>
      </div>

      {/* Top Progression Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
        {/* Attempt 1 */}
        <div 
          onClick={() => attempt1 && onSelectAttempt && onSelectAttempt(1)}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer relative space-y-0.5 ${
            selectedAttemptNum === 1
              ? 'bg-white dark:bg-slate-800 border-slate-900 dark:border-slate-400 ring-2 ring-slate-900 dark:ring-slate-400 shadow-xs'
              : 'bg-slate-50/80 dark:bg-slate-950/60 border-slate-300 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-850'
          }`}
          title="Click to view Attempt 1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 font-mono">
              Attempt 1 (Baseline)
            </span>
            {selectedAttemptNum === 1 && (
              <span className="text-[9px] font-bold uppercase text-white bg-slate-900 dark:bg-slate-700 px-1.5 py-0.2 rounded font-mono">
                Active
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {score1 !== null ? score1 : ' - '}
            </span>
            <span className="text-xs text-slate-500">/100</span>
          </div>
          <span className="text-[10px] text-slate-600 dark:text-slate-400 block truncate">Starting attempt</span>
        </div>

        {/* Attempt 2 */}
        <div 
          onClick={() => attempt2 && onSelectAttempt && onSelectAttempt(2)}
          className={`p-3.5 rounded-xl border transition-all space-y-0.5 relative ${
            attempt2 ? 'cursor-pointer' : 'opacity-60 cursor-default'
          } ${
            selectedAttemptNum === 2
              ? 'bg-white dark:bg-slate-800 border-blue-600 dark:border-blue-400 ring-2 ring-blue-600 dark:ring-blue-400 shadow-xs'
              : 'bg-blue-50/40 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 hover:bg-blue-50/70 dark:hover:bg-blue-950/60'
          }`}
          title={attempt2 ? "Click to view Attempt 2" : "Attempt 2 pending"}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-300 font-mono">
              Attempt 2 (Revision)
            </span>
            {selectedAttemptNum === 2 && (
              <span className="text-[9px] font-bold uppercase text-white bg-blue-600 px-1.5 py-0.2 rounded font-mono">
                Active
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-blue-700 dark:text-blue-400">
              {score2 !== null ? score2 : 'In Draft'}
            </span>
            {score2 !== null && <span className="text-xs text-blue-500">/100</span>}
          </div>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 block truncate">
            {gain1to2 !== null 
              ? (gain1to2 >= 0 ? `+${gain1to2} pts from baseline` : `${gain1to2} pts delta`) 
              : 'Draft revision to measure'}
          </span>
        </div>

        {/* Attempt 3 */}
        <div 
          onClick={() => attempt3 && onSelectAttempt && onSelectAttempt(3)}
          className={`p-3.5 rounded-xl border transition-all space-y-0.5 relative ${
            attempt3 ? 'cursor-pointer' : 'opacity-60 cursor-default'
          } ${
            selectedAttemptNum === 3
              ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-600 dark:ring-indigo-400 shadow-xs'
              : 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/60'
          }`}
          title={attempt3 ? "Click to view Attempt 3" : "Attempt 3 pending"}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-indigo-700 dark:text-indigo-300 font-mono">
              Attempt 3 (Final)
            </span>
            {selectedAttemptNum === 3 && (
              <span className="text-[9px] font-bold uppercase text-white bg-indigo-600 px-1.5 py-0.2 rounded font-mono">
                Active
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-700 dark:text-indigo-400">
              {score3 !== null ? score3 : (score2 !== null ? 'Ready to draft' : 'Locked')}
            </span>
            {score3 !== null && <span className="text-xs text-indigo-500">/100</span>}
          </div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block truncate">
            {gain2to3 !== null
              ? (gain2to3 >= 0 ? `+${gain2to3} pts from Attempt 2` : `${gain2to3} pts delta`)
              : (score2 !== null ? 'Final polish attempt' : 'Complete Attempt 2 first')}
          </span>
        </div>

        {/* Card 4: Band Label */}
        <div className="bg-white dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 font-mono block">
            Current Band
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl sm:text-2xl font-black ${band.color}`}>
              {band.label}
            </span>
          </div>
          <span className="text-[10px] text-slate-600 dark:text-slate-400 block truncate">{band.range}</span>
        </div>

        {/* Card 5: Progress vs. Earlier Attempt */}
        <div className="bg-white dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 space-y-0.5 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 font-mono block">
            Revision Progress
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black ${
              progressGainText.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
            }`}>
              {progressGainText}
            </span>
          </div>
          <span className="text-[10px] text-slate-600 dark:text-slate-400 block truncate">
            {progressSubtitle}
          </span>
        </div>
      </div>

      {/* Attempt Progression Visual Trajectory */}
      <div className="space-y-4 pt-1">
        <div className="h-44 w-full bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-300 dark:border-slate-800 p-4 relative flex items-end justify-around">
          {/* Column 1: Attempt 1 */}
          <div 
            onClick={() => attempt1 && onSelectAttempt && onSelectAttempt(1)}
            className={`flex flex-col items-center gap-2 z-10 w-20 sm:w-24 cursor-pointer p-1 rounded-xl transition-all ${
              selectedAttemptNum === 1 ? 'bg-slate-200/60 dark:bg-slate-800 ring-2 ring-slate-800 dark:ring-slate-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
            title="Click to view Attempt 1"
          >
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
              {score1 !== null ? `${score1}/100` : ' - '}
            </span>
            <div 
              className={`w-14 sm:w-16 rounded-t-xl transition-all duration-500 shadow-xs ${
                selectedAttemptNum === 1 ? 'bg-slate-700 dark:bg-slate-400' : 'bg-slate-400 dark:bg-slate-600'
              }`}
              style={{ height: `${((score1 || 0) / 100) * 110}px` }}
            />
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 text-center">
              Attempt 1<br /><span className="text-[10px] text-slate-400 font-normal">Baseline</span>
            </span>
          </div>

          {/* Column 2: Attempt 2 */}
          <div 
            onClick={() => attempt2 && onSelectAttempt && onSelectAttempt(2)}
            className={`flex flex-col items-center gap-2 z-10 w-20 sm:w-24 p-1 rounded-xl transition-all ${
              attempt2 ? 'cursor-pointer hover:bg-blue-50/60 dark:hover:bg-blue-950/50' : 'opacity-60 cursor-default'
            } ${
              selectedAttemptNum === 2 ? 'bg-blue-100/60 dark:bg-blue-950/70 ring-2 ring-blue-600 dark:ring-blue-400' : ''
            }`}
            title={attempt2 ? "Click to view Attempt 2" : "Attempt 2 pending"}
          >
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 font-mono">
              {score2 !== null ? `${score2}/100` : 'Pending'}
            </span>
            <div 
              className={`w-14 sm:w-16 rounded-t-xl transition-all duration-500 shadow-xs ${
                score2 !== null 
                  ? (selectedAttemptNum === 2 ? 'bg-blue-700 dark:bg-blue-500' : 'bg-blue-600') 
                  : 'bg-slate-200 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700'
              }`}
              style={{ height: `${((score2 || 20) / 100) * 110}px` }}
            />
            <span className="text-[11px] font-semibold text-blue-900 dark:text-blue-300 text-center">
              Attempt 2<br /><span className="text-[10px] text-blue-500 dark:text-blue-400 font-normal">Revision</span>
            </span>
          </div>

          {/* Column 3: Attempt 3 */}
          <div 
            onClick={() => attempt3 && onSelectAttempt && onSelectAttempt(3)}
            className={`flex flex-col items-center gap-2 z-10 w-20 sm:w-24 p-1 rounded-xl transition-all ${
              attempt3 ? 'cursor-pointer hover:bg-indigo-50/60 dark:hover:bg-indigo-950/50' : 'opacity-60 cursor-default'
            } ${
              selectedAttemptNum === 3 ? 'bg-indigo-100/60 dark:bg-indigo-950/70 ring-2 ring-indigo-600 dark:ring-indigo-400' : ''
            }`}
            title={attempt3 ? "Click to view Attempt 3" : "Attempt 3 pending"}
          >
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 font-mono">
              {score3 !== null ? `${score3}/100` : (score2 !== null ? 'Ready' : 'Locked')}
            </span>
            <div 
              className={`w-14 sm:w-16 rounded-t-xl transition-all duration-500 shadow-xs ${
                score3 !== null 
                  ? (selectedAttemptNum === 3 ? 'bg-indigo-800 dark:bg-indigo-500' : 'bg-indigo-600') 
                  : 'bg-slate-200 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700'
              }`}
              style={{ height: `${((score3 || 20) / 100) * 110}px` }}
            />
            <span className="text-[11px] font-semibold text-indigo-900 dark:text-indigo-300 text-center">
              Attempt 3<br /><span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-normal">Final</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
