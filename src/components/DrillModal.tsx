import React, { useState } from 'react';
import { DrillConfig, DrillResult } from '../types';
import { Dumbbell, X } from 'lucide-react';

interface DrillModalProps {
  isOpen: boolean;
  drillConfig: DrillConfig;
  initialResult?: DrillResult;
  onSaveDrill: (response: string) => void;
  onClose: () => void;
}

export const DrillModal: React.FC<DrillModalProps> = ({
  isOpen,
  drillConfig,
  initialResult,
  onSaveDrill,
  onClose,
}) => {
  if (!isOpen) return null;

  const [response, setResponse] = useState<string>(initialResult?.userResponse || '');
  const [isCompleted, setIsCompleted] = useState<boolean>(!!initialResult?.completedAt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) return;
    onSaveDrill(response.trim());
    setIsCompleted(true);
    setTimeout(() => onClose(), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-300 dark:border-slate-800 shadow-2xl p-5 sm:p-7 relative my-8 transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 text-slate-500 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1 font-mono">
          <Dumbbell className="w-4 h-4" />
          <span>Targeted Weakness Drill</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {drillConfig.targetSkill}
        </h3>

        {/* Reason for Assignment */}
        <div className="mt-3 p-3 bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 rounded-xl text-xs text-purple-950 dark:text-purple-200">
          <span className="font-bold text-purple-900 dark:text-purple-300">Why this was assigned: </span>
          {drillConfig.reason}
        </div>

        {/* Instructions & Criteria */}
        <div className="mt-4 space-y-2 text-xs">
          <div className="bg-slate-50 dark:bg-slate-950/70 p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-slate-100 block mb-0.5">Instruction:</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{drillConfig.instruction}</p>
          </div>

          <div className="bg-emerald-50/50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
            <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-0.5">Success Criteria:</span>
            <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed">{drillConfig.completionCriteria}</p>
          </div>
        </div>

        {/* Response Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Drill Attempt
            </label>
            <textarea
              rows={4}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder={drillConfig.placeholder || 'Type your focused drill response here...'}
              className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed bg-white dark:bg-slate-950"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 dark:text-slate-500 font-mono">
              {response.trim().split(/\s+/).filter(Boolean).length} words
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={!response.trim()}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm"
              >
                {isCompleted ? 'Saved ✓' : 'Save Drill Result'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
