import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  BookOpen, 
  Sparkles, 
  Layers, 
  Award, 
  Compass, 
  FileText 
} from 'lucide-react';

interface FounderModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FounderModeModal: React.FC<FounderModeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface rounded-2xl max-w-3xl w-full border border-surface-border shadow-medium p-6 sm:p-8 relative my-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-charcoal-faint hover:text-charcoal p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
          <div className="w-9 h-9 rounded-xl bg-focusBlue-light text-focusBlue flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-charcoal tracking-tight">
              Product One - The Founder Blueprint
            </h2>
            <p className="text-xs text-charcoal-muted">
              Authored by M.S. Sajid • Registered Framework (Recorded 2025)
            </p>
          </div>
        </div>

        {/* Phase Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-surface-border">
          {[
            { id: 1, label: 'Phase 1: Origin & Vision' },
            { id: 2, label: 'Phase 2: Structure & Features' },
            { id: 3, label: 'Phase 3: UX & Functional Flow' },
            { id: 4, label: 'Phase 4: Execution Playbook' },
            { id: 5, label: 'Phase 5: Voice & Branding' },
            { id: 6, label: 'Phase 6: Legacy & Continuity' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-focusBlue text-white'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-surface-subtle'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Phase Content */}
        <div className="text-xs text-charcoal space-y-4 max-h-[420px] overflow-y-auto pr-2 leading-relaxed">
          {activeTab === 1 && (
            <div className="space-y-3">
              <div className="p-3.5 bg-surface-subtle rounded-xl border border-surface-border">
                <span className="font-bold text-focusBlue block mb-1">The Founder Philosophy: Structured Freedom</span>
                <p className="italic text-charcoal-light">"There is no race. There is only rhythm."</p>
                <p className="mt-1 text-charcoal-muted">
                  Unlike traditional startup roadmaps that push completion within rigid deadlines, Product One follows phases of maturity: 30 Days (Understanding) → 60 Days (Application) → 90 Days (Integration).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-surface-border">
                  <span className="font-semibold text-charcoal block">Vision Statement</span>
                  <p className="text-charcoal-muted mt-1">To build a platform that transforms communication into confidence, and confidence into a professional identity.</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-surface-border">
                  <span className="font-semibold text-charcoal block">Mission Statement</span>
                  <p className="text-charcoal-muted mt-1">To guide individuals through a structured journey of self-expression - from uncertainty to articulation, from articulation to influence.</p>
                </div>
              </div>

              <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border">
                <span className="font-bold text-charcoal block mb-1">Core Values & Rules</span>
                <ul className="space-y-1 text-charcoal-muted">
                  <li>• <strong>Authenticity:</strong> No AI-generated personality masks - only guided improvement.</li>
                  <li>• <strong>Discipline:</strong> Structure before style. Daily guideline and reflection.</li>
                  <li>• <strong>Growth Mindset:</strong> Mistakes are milestones. Documented, analyzed, reframed.</li>
                  <li>• <strong>Minimalism:</strong> Build only what adds value. Zero clutter.</li>
                  <li>• <strong>Ownership:</strong> Protect originality. All frameworks remain founder IP.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-3">
              <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border">
                <span className="font-bold text-charcoal block mb-1">The G.A.I.N. Method</span>
                <p className="text-charcoal-muted mb-2">Each communication exercise follows a fixed 4-step ritual:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-2 rounded border border-surface-border">
                    <span className="font-bold text-focusBlue">G - Greet</span>
                    <p className="text-[10px] text-charcoal-faint">Friendly Opener</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-surface-border">
                    <span className="font-bold text-purple-600">A - Acknowledge</span>
                    <p className="text-[10px] text-charcoal-faint">Identity + Context</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-surface-border">
                    <span className="font-bold text-emerald-600">I - Insight</span>
                    <p className="text-[10px] text-charcoal-faint">Main Idea / Lesson</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-surface-border">
                    <span className="font-bold text-amber-600">N - Navigate Out</span>
                    <p className="text-[10px] text-charcoal-faint">Smooth Closure / Next</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border">
                <span className="font-bold text-charcoal block mb-1">Cognitive Mode Auto-Rotation</span>
                <p className="text-charcoal-muted">
                  The system cycles between <strong>Reflective Mode</strong> (personal insight), <strong>Analytical Mode</strong> (critical reasoning), and <strong>Expressive Mode</strong> (presentation and storytelling) to ensure neural freshness.
                </p>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-3">
              <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border">
                <span className="font-bold text-charcoal block mb-1">The "Minimal Learning Flow" & Interaction Ethics</span>
                <ul className="space-y-1.5 text-charcoal-muted mt-2">
                  <li>• <strong>Missed a day:</strong> Gentle reminder with reflective quote (Compassion, no shame).</li>
                  <li>• <strong>Completed a phase:</strong> Badge and motivational phrase (Pride).</li>
                  <li>• <strong>First 3 days:</strong> Consistency micro-reward (Momentum).</li>
                  <li>• <strong>Restart:</strong> Option to restart without loss of past record (Freedom).</li>
                </ul>
              </div>
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 italic text-blue-950">
                “Every button, transition, and micro-text in Product One must feel like a personal reflection, not a digital task. This is not an app - it’s a discipline container.” - M.S. Sajid
              </div>
            </div>
          )}

          {activeTab === 4 && (
            <div className="space-y-3">
              <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border">
                <span className="font-bold text-charcoal block mb-1">Development Philosophy: "Slow Build, Solid Base"</span>
                <p className="text-charcoal-muted">
                  "Product One isn't built in a rush. It grows like a habit, documented like a system, and designed like a story."
                </p>
                <div className="mt-2 space-y-1 text-charcoal-light">
                  <p>• You may pause, but you never reset progress.</p>
                  <p>• You measure clarity, not completion.</p>
                  <p>• You document, even when you can't code.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 5 && (
            <div className="space-y-3">
              <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border">
                <span className="font-bold text-charcoal block mb-1">Brand Voice & Aesthetics</span>
                <p className="text-charcoal-muted mb-2">
                  "Product One is not marketed. It's documented. It doesn't speak louder - it speaks clearer."
                </p>
                <p className="text-charcoal-muted">
                  Palette: White/Gray base, Charcoal text (#1F2937), Focus Blue accent (#007AFF), clean Inter typography, generous whitespace.
                </p>
              </div>
            </div>
          )}

          {activeTab === 6 && (
            <div className="space-y-3">
              <div className="p-3 bg-surface-subtle rounded-xl border border-surface-border">
                <span className="font-bold text-charcoal block mb-1">The Continuity Code - Preserving the Soul</span>
                <p className="text-charcoal-muted">
                  "The real value of Product One isn't in its code - it's in its discipline, mindset, and documentation."
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg border border-surface-border">
                  <span className="font-semibold text-charcoal block">Successor Ethics Clause</span>
                  <p className="text-charcoal-muted mt-1 italic">
                    "If this framework ever changes hands, it must never be stripped of its reflective core or repurposed for manipulation, exploitation, or vanity-driven growth. Product One was born to help humans build clarity - that intent must never be altered."
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-faint">
          <span>Registered Founder Email: m.s.sajid.building.productone@gmail.com</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-charcoal text-white rounded-xl text-xs font-semibold hover:bg-charcoal-light transition-colors"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
