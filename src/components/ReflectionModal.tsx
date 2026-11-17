import React, { useState } from 'react';
import { ReflectionData } from '../types';
import { BookOpen, X, ArrowRight } from 'lucide-react';

interface ReflectionModalProps {
  isOpen: boolean;
  initialReflection?: ReflectionData;
  onSaveReflection: (reflection: {
    whatWentWell: string;
    whatWasDifficult: string;
    oneThingToChange: string;
    whatToPractiseNext: string;
  }) => void;
  onSkip: () => void;
  onClose: () => void;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  isOpen,
  initialReflection,
  onSaveReflection,
  onSkip,
  onClose,
}) => {
  if (!isOpen) return null;

  const [whatWentWell, setWhatWentWell] = useState(initialReflection?.whatWentWell || '');
  const [whatWasDifficult, setWhatWasDifficult] = useState(initialReflection?.whatWasDifficult || '');
  const [oneThingToChange, setOneThingToChange] = useState(initialReflection?.oneThingToChange || '');
  const [whatToPractiseNext, setWhatToPractiseNext] = useState(initialReflection?.whatToPractiseNext || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveReflection({
      whatWentWell: whatWentWell.trim(),
      whatWasDifficult: whatWasDifficult.trim(),
      oneThingToChange: oneThingToChange.trim(),
      whatToPractiseNext: whatToPractiseNext.trim(),
    });
    onClose();
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

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 font-mono">
          <BookOpen className="w-4 h-4" />
          <span>Mindful Practice Reflection</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Post-Practice Reflection
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
          Briefly document your awareness before moving to your next activity.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              1. What did I communicate well today?
            </label>
            <input
              type="text"
              value={whatWentWell}
              onChange={(e) => setWhatWentWell(e.target.value)}
              placeholder="e.g. Led with my conclusion directly..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:focus:border-blue-500 bg-white dark:bg-slate-950 placeholder:text-slate-500 dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              2. What did I find difficult?
            </label>
            <input
              type="text"
              value={whatWasDifficult}
              onChange={(e) => setWhatWasDifficult(e.target.value)}
              placeholder="e.g. Eliminating filler words like 'basically'..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:focus:border-blue-500 bg-white dark:bg-slate-950 placeholder:text-slate-500 dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              3. What is one thing I will change next time?
            </label>
            <input
              type="text"
              value={oneThingToChange}
              onChange={(e) => setOneThingToChange(e.target.value)}
              placeholder="e.g. Anchor my main reason in one metric or example..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:focus:border-blue-500 bg-white dark:bg-slate-950 placeholder:text-slate-500 dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              4. What should I practise next?
            </label>
            <input
              type="text"
              value={whatToPractiseNext}
              onChange={(e) => setWhatToPractiseNext(e.target.value)}
              placeholder="e.g. Day 2: Describing a meaningful habit..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:focus:border-blue-500 bg-white dark:bg-slate-950 placeholder:text-slate-500 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <button
              type="button"
              onClick={onSkip}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              Skip for now
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Save to Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
