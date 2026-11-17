import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Clock, 
  MessageSquare, 
  Compass, 
  ShieldCheck,
  Dumbbell
} from 'lucide-react';
import { UserProfile, CommunicationGoal, UserPreferences } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: Partial<UserProfile>) => void;
  onExploreDemo: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onExploreDemo,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [displayName, setDisplayName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<CommunicationGoal[]>([
    'express-thoughts',
    'improve-professional',
  ]);
  const [sessionLength, setSessionLength] = useState<number>(10);
  const [confidenceRating, setConfidenceRating] = useState<number>(5);
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [roadmapDays, setRoadmapDays] = useState<30 | 60 | 90>(30);

  if (!isOpen) return null;

  const toggleGoal = (goal: CommunicationGoal) => {
    if (selectedGoals.includes(goal)) {
      if (selectedGoals.length > 1) {
        setSelectedGoals(selectedGoals.filter((g) => g !== goal));
      }
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleFinish = () => {
    onComplete({
      displayName: displayName.trim() || 'Practitioner',
      goals: selectedGoals,
      roadmapDays,
      preferences: {
        preferredFormat: 'text',
        sessionLengthMinutes: sessionLength,
        dailyReminder: false,
        initialConfidenceRating: confidenceRating,
        experienceLevel,
        directCritiqueMode: true,
        aiProvider: 'offline-heuristic',
      },
      onboardingCompleted: true,
    });
  };

  const goalOptions: { id: CommunicationGoal; label: string; desc: string }[] = [
    { id: 'express-thoughts', label: 'Express My Thoughts Clearly', desc: 'Organise ideas into structured, concise sentences without meandering.' },
    { id: 'improve-professional', label: 'Improve Professional Communication', desc: 'Communicate with authority in meetings, updates, and design proposals.' },
    { id: 'practise-english', label: 'Practise English Expression', desc: 'Refine phrasing, idioms, and natural rhythm in English.' },
    { id: 'prepare-interviews', label: 'Prepare for Interviews or Presentations', desc: 'Sharpen behavioral storytelling and structured answers under pressure.' },
    { id: 'storytelling-persuasion', label: 'Storytelling & Persuasion', desc: 'Hook listeners and present compelling arguments with concrete proof.' },
    { id: 'everyday-communication', label: 'Everyday Communication', desc: 'Cultivate empathy, active listening, and thoughtful conversational flow.' },
    { id: 'explore-weaknesses', label: 'Explore Communication Weaknesses', desc: 'Identify filler words, vague abstractions, and cognitive blind spots.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface rounded-2xl max-w-2xl w-full border border-surface-border shadow-medium p-6 sm:p-8 my-8 relative">
        {/* Progress Dots */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-focusBlue text-white text-xs font-bold flex items-center justify-center">
              P1
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
              Step {step} of 4: {step === 1 ? 'Welcome' : step === 2 ? 'Goals' : step === 3 ? 'Preferences' : 'Roadmap'}
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-focusBlue' : i < step ? 'w-2.5 bg-focusBlue/40' : 'w-2.5 bg-surface-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ================= SCREEN 1: WELCOME ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-focusBlue-light text-focusBlue mb-2">
                Day 0 - The First Contact
              </span>
              <h2 className="text-2xl font-bold text-charcoal tracking-tight">
                Welcome to ResolvAI
              </h2>
              <p className="text-charcoal-muted mt-2 text-sm leading-relaxed">
                A structured practice container designed to transform communication into clarity, and clarity into confidence.
              </p>
            </div>

            {/* 4-Step Cycle Card */}
            <div className="bg-surface-subtle p-4 sm:p-5 rounded-xl border border-surface-border space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-faint">
                The Daily Practice Rhythm
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-3 rounded-lg border border-surface-border shadow-soft">
                  <div className="w-7 h-7 mx-auto rounded-full bg-blue-50 text-focusBlue flex items-center justify-center text-xs font-bold mb-1.5">
                    1
                  </div>
                  <p className="text-xs font-semibold text-charcoal">Practise</p>
                  <p className="text-[11px] text-charcoal-faint mt-0.5">Topic + G.A.I.N. frame</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-surface-border shadow-soft">
                  <div className="w-7 h-7 mx-auto rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold mb-1.5">
                    2
                  </div>
                  <p className="text-xs font-semibold text-charcoal">Receive Feedback</p>
                  <p className="text-[11px] text-charcoal-faint mt-0.5">4-dimension rubric</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-surface-border shadow-soft">
                  <div className="w-7 h-7 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold mb-1.5">
                    3
                  </div>
                  <p className="text-xs font-semibold text-charcoal">Retry</p>
                  <p className="text-[11px] text-charcoal-faint mt-0.5">Raw baseline preserved</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-surface-border shadow-soft">
                  <div className="w-7 h-7 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold mb-1.5">
                    4
                  </div>
                  <p className="text-xs font-semibold text-charcoal">Track Progress</p>
                  <p className="text-[11px] text-charcoal-faint mt-0.5">Vault & honest trends</p>
                </div>
              </div>
            </div>

            {/* Display Name Input */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                How should we address you?
              </label>
              <input
                type="text"
                placeholder="e.g. Sajid or Practitioner"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-surface-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-focusBlue/30 focus:border-focusBlue text-charcoal"
              />
              <p className="text-[11px] text-charcoal-faint mt-1">
                Stored privately on your device. No public profile is created.
              </p>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onExploreDemo}
                className="text-xs text-charcoal-muted hover:text-charcoal underline underline-offset-4"
              >
                Skip to Quick Demo
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 bg-focusBlue hover:bg-focusBlue-hover text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-soft"
              >
                <span>Start My Practice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 2: COMMUNICATION GOALS ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-charcoal">
                What do you want to develop?
              </h2>
              <p className="text-charcoal-muted text-xs mt-1">
                Select one or more goals to calibrate your practice drills and AI feedback emphasis.
              </p>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {goalOptions.map((opt) => {
                const isSelected = selectedGoals.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleGoal(opt.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-focusBlue bg-focusBlue-light/40 text-charcoal'
                        : 'border-surface-border bg-white hover:bg-surface-subtle text-charcoal-light'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-focusBlue border-focusBlue text-white'
                          : 'border-surface-border bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-charcoal">{opt.label}</h4>
                      <p className="text-xs text-charcoal-muted mt-0.5">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs text-charcoal-muted hover:text-charcoal px-3 py-2 rounded-md hover:bg-surface-subtle transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 bg-focusBlue hover:bg-focusBlue-hover text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-soft"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 3: PREFERENCES ================= */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-charcoal">
                Your Practice Preferences
              </h2>
              <p className="text-charcoal-muted text-xs mt-1">
                Customize your pace. Discipline is built on sustainable routines, not exhausting marathons.
              </p>
            </div>

            {/* Preferred Session Length */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-2">
                Preferred Daily Session Length
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSessionLength(mins)}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                      sessionLength === mins
                        ? 'border-focusBlue bg-focusBlue-light text-focusBlue font-bold shadow-soft'
                        : 'border-surface-border bg-white text-charcoal hover:bg-surface-subtle'
                    }`}
                  >
                    <div className="text-sm font-semibold">{mins} Minutes</div>
                    <div className="text-[11px] text-charcoal-faint">
                      {mins === 5 ? 'Micro Practice' : mins === 10 ? 'Recommended' : 'Deep Practice'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Initial Self-Rated Confidence */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-charcoal">
                  Initial Confidence in Spontaneous Expression (1-10)
                </label>
                <span className="text-xs font-bold text-focusBlue px-2 py-0.5 rounded bg-focusBlue-light">
                  {confidenceRating}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={confidenceRating}
                onChange={(e) => setConfidenceRating(parseInt(e.target.value))}
                className="w-full accent-focusBlue cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-charcoal-faint mt-0.5">
                <span>1 - Often hesitant</span>
                <span>5 - Moderate clarity</span>
                <span>10 - Fluent & articulate</span>
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-2">
                Current Experience Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperienceLevel(lvl)}
                    className={`py-2 px-3 rounded-lg border text-xs capitalize transition-all ${
                      experienceLevel === lvl
                        ? 'border-focusBlue bg-focusBlue-light text-focusBlue font-semibold'
                        : 'border-surface-border bg-white text-charcoal hover:bg-surface-subtle'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 text-xs text-charcoal-muted hover:text-charcoal px-3 py-2 rounded-md hover:bg-surface-subtle transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex items-center gap-2 bg-focusBlue hover:bg-focusBlue-hover text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-soft"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 4: ROADMAP ARCHITECTURE ================= */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-charcoal">
                The Progressive Roadmap
              </h2>
              <p className="text-charcoal-muted text-xs mt-1">
                "There is no race. There is only rhythm." Select your initial progression horizon.
              </p>
            </div>

            {/* Roadmap Card Options */}
            <div className="space-y-3">
              {[
                { days: 30, title: '30-Day Starter Roadmap', desc: 'Understanding & Expression: Build baseline clarity, master the G.A.I.N. method, and eliminate filler words.' },
                { days: 60, title: '60-Day Application Pathway', desc: 'Application & Nuance: High-stakes discussions, constructive dissent, and cross-domain storytelling.' },
                { days: 90, title: '90-Day Integration Mastery', desc: 'Integration & Influence: Becoming what you have built. Executive presence, negotiation, and leadership architecture.' },
              ].map((r) => (
                <div
                  key={r.days}
                  onClick={() => setRoadmapDays(r.days as 30 | 60 | 90)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    roadmapDays === r.days
                      ? 'border-focusBlue bg-focusBlue-light/40 shadow-soft'
                      : 'border-surface-border bg-white hover:bg-surface-subtle'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-charcoal">{r.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      roadmapDays === r.days ? 'bg-focusBlue text-white' : 'bg-surface-muted text-charcoal-muted'
                    }`}>
                      {r.days} Days
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>

            {/* Core Principle Alert */}
            <div className="bg-surface-subtle p-3.5 rounded-lg border border-surface-border text-xs text-charcoal-muted flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-charcoal">The Product One Promise: </span>
                This roadmap is fluid. Missing a day will never reset your progress or penalize you. You move when ready, not when rushed.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 text-xs text-charcoal-muted hover:text-charcoal px-3 py-2 rounded-md hover:bg-surface-subtle transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 bg-focusBlue hover:bg-focusBlue-hover text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-medium"
              >
                <span>Enter Practice Studio</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
