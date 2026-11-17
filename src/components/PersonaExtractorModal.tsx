import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Sparkles, 
  Copy, 
  Check, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck,
  ExternalLink
} from 'lucide-react';

interface PersonaExtractorModalProps {
  isOpen: boolean;
  userProfile: UserProfile;
  onSavePersona: (personaText: string) => void;
  onClose: () => void;
}

export const EXTRACTION_PROMPT = `Act as my personal communication and professional profiler. Based on all our past interactions, synthesize an honest, high-density summary of who I am to calibrate my communication gym app:

- Current Role & Domain: [What I build/do]
- Language Background & Speaking Style: [My native language, fluency, conversational habits]
- Core Communication Strengths: [What I do well: e.g. passion, empathy, technical insight]
- Key Growth Weaknesses: [Where I struggle: e.g. rambling, filler words, structuring under pressure, over-explaining]
- Primary Audience: [Clients, executives, engineers, peers]

Keep the summary direct, constructive, and under 140 words.`;

export const PersonaExtractorModal: React.FC<PersonaExtractorModalProps> = ({
  isOpen,
  userProfile,
  onSavePersona,
  onClose,
}) => {
  const [pastedPersona, setPastedPersona] = useState(userProfile.preferences.aiPersona || '');
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(EXTRACTION_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    onSavePersona(pastedPersona.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface rounded-2xl max-w-2xl w-full border border-surface-border shadow-medium p-6 sm:p-7 relative my-8 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-charcoal-faint hover:text-charcoal p-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-charcoal">
              AI Persona & Background Extractor
            </h3>
            <p className="text-xs text-charcoal-muted">
              Import your background and conversational habits from ChatGPT, Claude, or Gemini.
            </p>
          </div>
        </div>

        {/* Explanatory 3-step banner */}
        <div className="bg-surface-subtle p-3.5 rounded-xl border border-surface-border text-xs text-charcoal-light space-y-1">
          <span className="font-semibold text-charcoal block">How this works:</span>
          <p className="text-charcoal-muted">
            1. Copy the tailored prompt below. <br />
            2. Paste it into your existing ChatGPT / Claude / Gemini chat. <br />
            3. Paste the AI's response back here. Your practice evaluations will immediately adapt to your background!
          </p>
        </div>

        {/* Step 1: Copy Prompt Card */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Step 1: Copy this extractor prompt
            </span>
            <button
              onClick={handleCopyPrompt}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-focusBlue hover:bg-focusBlue-hover text-white shadow-soft'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
            </button>
          </div>

          <div className="bg-surface-subtle p-3 rounded-xl border border-surface-border font-mono text-[11px] text-charcoal-muted leading-relaxed select-all">
            {EXTRACTION_PROMPT}
          </div>
        </div>

        {/* Step 2: Paste Response Box */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal block">
            Step 2: Paste AI Persona Output Here
          </span>
          <textarea
            rows={5}
            value={pastedPersona}
            onChange={(e) => setPastedPersona(e.target.value)}
            placeholder="Paste what ChatGPT / Claude / Gemini generated about your communication style and background here..."
            className="w-full p-3.5 rounded-xl border border-surface-border text-xs text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-focusBlue/30 focus:border-focusBlue leading-relaxed"
          />
        </div>

        {/* Privacy Note */}
        <div className="flex items-center gap-2 text-[11px] text-charcoal-faint">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            Optional & stored locally. Only used to calibrate personalized communication critiques.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-surface-border flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-charcoal-muted hover:text-charcoal"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!pastedPersona.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-focusBlue hover:bg-focusBlue-hover disabled:bg-surface-muted disabled:text-charcoal-faint text-white rounded-xl text-xs font-semibold transition-colors shadow-soft"
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Persona Saved!' : 'Save Persona to Gym'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
