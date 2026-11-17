import React from 'react';
import { 
  Flame, 
  Calendar, 
  Sparkles, 
  ShieldAlert, 
  UserCircle 
} from 'lucide-react';
import { UserProfile, ProgressSummary } from '../types';

interface HeaderProps {
  userProfile: UserProfile;
  progressSummary: ProgressSummary;
  productName: string;
  onOpenSettings: () => void;
  onOpenFounderMode: () => void;
  onToggleHarshCritique: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  progressSummary,
  productName,
  onOpenSettings,
  onOpenFounderMode,
  onToggleHarshCritique,
}) => {
  const isHarsh = userProfile.preferences.directCritiqueMode;

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-surface-border px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        {/* Mobile brand indicator */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-focusBlue flex items-center justify-center text-white font-bold text-xs">
            P1
          </div>
          <span className="font-semibold text-charcoal text-sm">{productName}</span>
        </div>

        {/* Roadmap tracker indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-surface-subtle px-3 py-1.5 rounded-full text-xs text-charcoal-light border border-surface-border">
          <Calendar className="w-3.5 h-3.5 text-focusBlue" />
          <span>Roadmap:</span>
          <span className="font-semibold text-charcoal">
            Day {Math.min(30, progressSummary.daysCompleted + 1)} of {userProfile.roadmapDays}
          </span>
          <span className="text-charcoal-faint">|</span>
          <span className="text-charcoal-muted">Flexible Pace</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Direct / Harsh Critique Quick Toggle (Highlighted in Red, Default ON) */}
        <button
          onClick={onToggleHarshCritique}
          title={isHarsh ? "Direct Critique Active: High standard, candid feedback enabled" : "Click to activate Direct Critique"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            isHarsh
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200 ring-2 ring-rose-400/50'
              : 'bg-surface-subtle text-charcoal-muted hover:text-charcoal border border-surface-border'
          }`}
        >
          <ShieldAlert className={`w-3.5 h-3.5 ${isHarsh ? 'text-white' : 'text-charcoal-faint'}`} />
          <span className="hidden sm:inline">Direct Critique:</span>
          <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold ${isHarsh ? 'bg-white/20 text-white' : 'bg-surface-muted text-charcoal-muted'}`}>
            {isHarsh ? 'ACTIVE' : 'OFF'}
          </span>
        </button>

        {/* Consistency streak indicator (gentle, no shame) */}
        <div 
          className="flex items-center gap-1.5 bg-surface-subtle px-2.5 py-1.5 rounded-md text-xs border border-surface-border text-charcoal-light"
          title="Compassionate consistency: your completed consecutive practice days"
        >
          <Flame className={`w-3.5 h-3.5 ${progressSummary.currentStreak > 0 ? 'text-amber-500 fill-amber-500' : 'text-charcoal-faint'}`} />
          <span className="font-semibold">{progressSummary.currentStreak}</span>
          <span className="hidden sm:inline text-charcoal-muted">day streak</span>
        </div>

        {/* User avatar / Settings shortcut */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-md hover:bg-surface-subtle text-charcoal transition-colors border border-transparent hover:border-surface-border"
          title="User profile and settings"
        >
          <UserCircle className="w-5 h-5 text-charcoal-muted" />
          <span className="hidden md:inline text-xs font-medium truncate max-w-[120px]">
            {userProfile.displayName || 'Practitioner'}
          </span>
        </button>
      </div>
    </header>
  );
};
