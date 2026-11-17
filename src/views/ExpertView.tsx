import React, { useState } from 'react';
import { UserProfile, Topic, EvaluationRubric } from '../types';
import { aiExpertService } from '../services/aiExpert';
import { 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  RotateCcw,
  Info
} from 'lucide-react';
import { getScoreBadgeClass } from '../utils/formatters';
import { AiDisclaimer } from '../components/AiDisclaimer';

interface ExpertViewProps {
  userProfile: UserProfile;
}

export const ExpertView: React.FC<ExpertViewProps> = ({ userProfile }) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [customContext, setCustomContext] = useState<'Professional' | 'Interview' | 'Storytelling' | 'Everyday'>('Professional');
  const [customText, setCustomText] = useState('');
  const [isHarsh, setIsHarsh] = useState(userProfile.preferences.directCritiqueMode ?? true);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationRubric | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const words = customText.trim().split(/\s+/).filter(Boolean).length;

  const handleEvaluate = async () => {
    if (words < 5) {
      setErrorMsg('Please enter at least a few sentences to evaluate.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      // Build ad-hoc topic wrapper
      const syntheticTopic: Topic = {
        id: 'ad-hoc-topic',
        dayNumber: 0,
        stage: 'stage-c',
        stageTitle: `Ad-Hoc Practice (${customContext})`,
        title: customPrompt.trim() || `Ad-Hoc ${customContext} Communication`,
        objective: 'Articulate ideas with clarity, structure, and evidence.',
        difficulty: 'Challenge',
        cognitiveMode: 'Analytical',
        categoryTag: customContext === 'Interview' ? 'Professional' : customContext as any,
        suggestedCompletionMinutes: 10,
        context: `Custom input evaluated in ${customContext} context.`,
        instructions: customPrompt || 'Evaluate custom communication draft.',
        guidelines: {
          type: 'GAIN',
          title: 'The Universal G.A.I.N. Framework',
          objective: 'Greet/Frame → Acknowledge → Insight → Navigate',
          whyItMatters: 'Structures any communication naturally.',
          steps: [
            { label: 'G - Greet/Frame', instruction: 'Establish context', example: '' },
            { label: 'A - Acknowledge', instruction: 'State the premise', example: '' },
            { label: 'I - Insight', instruction: 'Deliver core idea', example: '' },
            { label: 'N - Navigate', instruction: 'Conclude with next step', example: '' },
          ],
          illustrativeExample: '',
          commonMistakeToAvoid: 'Meandering without an explicit conclusion.'
        },
        suggestedDrill: {
          targetSkill: 'Ad-Hoc Brevity Drill',
          reason: 'Sharpen communication economy.',
          instruction: 'Summarise your response in two crisp sentences.',
          completionCriteria: 'Clear context and punchy conclusion.'
        }
      };

      const result = await aiExpertService.evaluateAttempt({
        topic: syntheticTopic,
        userResponse: customText,
        attemptType: 'original',
        userProfile,
        isHarshCritique: isHarsh,
      });

      setEvaluation(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Evaluation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Banner */}
      <div className="bg-surface p-6 sm:p-7 rounded-2xl border border-surface-border shadow-soft">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-focusBlue mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Layer 8 - AI Communication Expert Studio</span>
        </div>
        <h1 className="text-2xl font-bold text-charcoal tracking-tight">
          Ad-Hoc Communication Evaluator
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed max-w-2xl">
          Test any email, presentation excerpt, difficult conversation draft, or interview answer outside the 30-day curriculum against the standard 4-dimension rubric.
        </p>
      </div>

      {/* Input Studio */}
      <div className="bg-surface rounded-2xl border border-surface-border shadow-soft p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Communication Scenario / Intended Objective
            </label>
            <input
              type="text"
              placeholder="e.g. Asking for budget approval, or answering 'Tell me about yourself'"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border text-xs text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-focusBlue/30 focus:border-focusBlue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Context Category
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Professional', 'Interview', 'Storytelling', 'Everyday'] as const).map((ctx) => (
                <button
                  key={ctx}
                  type="button"
                  onClick={() => setCustomContext(ctx)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
                    customContext === ctx
                      ? 'bg-focusBlue text-white font-semibold'
                      : 'bg-surface-subtle hover:bg-surface-muted text-charcoal-muted border border-surface-border'
                  }`}
                >
                  {ctx}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-charcoal">
              Your Draft Response
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsHarsh(!isHarsh)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                  isHarsh ? 'bg-rose-600 text-white shadow-rose-200 ring-2 ring-rose-300' : 'bg-surface-subtle text-charcoal-muted border border-surface-border'
                }`}
              >
                <ShieldAlert className={`w-3.5 h-3.5 ${isHarsh ? 'text-white' : 'text-charcoal-faint'}`} />
                <span>Direct Critique: {isHarsh ? 'ACTIVE' : 'OFF'}</span>
              </button>
              <span className="text-xs text-charcoal-faint">{words} words</span>
            </div>
          </div>

          <textarea
            rows={7}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type or paste the speech, email, or discussion draft you want evaluated..."
            className="w-full p-4 rounded-xl border border-surface-border text-sm text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-focusBlue/30 focus:border-focusBlue leading-relaxed"
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
            {errorMsg}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={isLoading || words < 5}
            onClick={handleEvaluate}
            className="flex items-center gap-2 bg-focusBlue hover:bg-focusBlue-hover disabled:bg-surface-muted disabled:text-charcoal-faint text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-soft cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing across 4 dimensions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate with AI Expert</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Evaluation Result if computed */}
      {evaluation && (
        <div className="bg-surface rounded-2xl border border-surface-border shadow-soft p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-surface-border">
            <div>
              <span className="text-xs font-bold text-focusBlue uppercase tracking-wider">
                Evaluation Output
              </span>
              <h2 className="text-xl font-bold text-charcoal">
                {customPrompt || 'Ad-Hoc Analysis'}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-charcoal">
                {evaluation.overallScore ?? 'N/A'}
                <span className="text-sm font-normal text-charcoal-faint">/100</span>
              </span>
            </div>
          </div>

          <div className="bg-surface-subtle p-4 rounded-xl border border-surface-border text-xs sm:text-sm text-charcoal leading-relaxed">
            {evaluation.overallAssessment}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-950">
              <span className="font-bold text-emerald-900 block mb-1">Strongest Element</span>
              {evaluation.strongestElement}
            </div>
            <div className="bg-rose-50/60 border border-rose-200 p-4 rounded-xl text-xs text-rose-950">
              <span className="font-bold text-rose-900 block mb-1">Main Priority</span>
              {evaluation.mainImprovementPriority}
            </div>
          </div>

          {/* 4 Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Clarity & Brevity', dim: evaluation.dimensions.clarity },
              { title: 'Structure & Flow', dim: evaluation.dimensions.structureAndFlow },
              { title: 'Specificity & Detail', dim: evaluation.dimensions.specificity },
              { title: 'Language Effectiveness', dim: evaluation.dimensions.languageEffectiveness },
            ].map((d, i) => (
              <div key={i} className="bg-surface-subtle p-4 rounded-xl border border-surface-border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-charcoal">{d.title}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getScoreBadgeClass(d.dim.score)}`}>
                    {d.dim.score}/100
                  </span>
                </div>
                <p className="text-xs text-charcoal-muted leading-relaxed">{d.dim.explanation}</p>
                {d.dim.evidence && (
                  <p className="text-[11px] text-charcoal-light italic bg-white p-2 rounded border border-surface-border">
                    "{d.dim.evidence}"
                  </p>
                )}
              </div>
            ))}
          </div>

          {evaluation.aiAssistedExample && (
            <div className="bg-blue-50/40 border border-blue-200 p-4 rounded-xl text-xs text-blue-950 space-y-1">
              <span className="font-bold text-blue-900 block">AI-Assisted Structural Example (Reference)</span>
              <p className="italic bg-white p-3 rounded-lg border border-blue-100">
                "{evaluation.aiAssistedExample}"
              </p>
            </div>
          )}

          {evaluation.evaluationSource === 'live-ai' && <AiDisclaimer />}

          <div className="text-[11px] text-charcoal-faint pt-2 border-t border-surface-border">
            * Evaluated via {evaluation.modelIdentifier || 'Local Heuristics Engine'}. {evaluation.limitationsNote}
          </div>
        </div>
      )}
    </div>
  );
};
