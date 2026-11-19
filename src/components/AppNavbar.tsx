import React, { useState, useRef } from 'react';
import { 
  Flame, 
  Dumbbell, 
  TrendingUp, 
  Archive, 
  Settings, 
  LayoutDashboard,
  Sun,
  Moon,
  Menu
} from 'lucide-react';
import { ActiveView, UserProfile, ProgressSummary } from '../types';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { AuthButton } from './AuthButton';

interface AppNavbarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  productName: string;
  userProfile: UserProfile;
  progressSummary: ProgressSummary;
  onToggleHarshCritique: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSetTheme?: (theme: 'light' | 'dark') => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  activeView,
  onNavigate,
  productName,
  userProfile,
  progressSummary,
  onToggleHarshCritique,
  theme,
  onToggleTheme,
  onSetTheme,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hamburgerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const isHarsh = userProfile.preferences.directCritiqueMode;

  const navLinks: { view: ActiveView; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { view: 'gym', label: 'Curriculum', icon: <Dumbbell className="w-4 h-4" /> },
    { view: 'progress', label: 'Progress', icon: <TrendingUp className="w-4 h-4" /> },
    { view: 'vault', label: 'Vault', icon: <Archive className="w-4 h-4" /> },
    { view: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Top Sticky Header for Desktop, Tablet & Mobile */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-300 dark:border-slate-800/90 transition-colors">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Left: Brand Logo Placeholder & Title */}
          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 sm:gap-2.5 text-left group"
              title="ResolvAI Dashboard"
            >
              {/* Brand logo */}
              <span className="dark:hidden">
                <Logo variant="horizontal" onDark={false} />
              </span>
              <span className="hidden dark:inline">
                <Logo variant="horizontal" onDark={true} />
              </span>
              <div className="flex items-center gap-2">
                <span className="hidden min-[360px]:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700 select-none">
                  Beta prototype
                </span>
              </div>
            </button>

            {/* Center Desktop Navigation Pills (Hidden below 1280px / xl) */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((item) => {
                const isActive = activeView === item.view || (activeView === 'practice' && item.view === 'dashboard');
                return (
                  <button
                    key={item.view}
                    onClick={() => onNavigate(item.view)}
                    className={`px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold'
                        : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions, Theme Switcher & Status (Desktop >= 1280px / xl) */}
          <div className="hidden xl:flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Direct Critique Quick Toggle */}
            <button
              type="button"
              onClick={onToggleHarshCritique}
              title={isHarsh ? "Direct critique active: blunt, no-softening feedback" : "Constructive coaching active: click to switch to Direct critique"}
              className={`flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                isHarsh
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${isHarsh ? 'text-rose-600 fill-rose-600' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">
                {isHarsh ? 'Direct critique' : 'Coaching'}
              </span>
            </button>

            {/* Streak Indicator */}
            <div 
              className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-2 sm:px-2.5 py-1.5 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 shrink-0"
              title="Consecutive practice days"
            >
              <span className="text-amber-500 font-bold text-xs">🔥</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs">{progressSummary.currentStreak}</span>
              <span className="hidden sm:inline text-slate-600 dark:text-slate-400 text-[11px]">streak</span>
            </div>

            {/* Crystal-Clear Segmented Theme Toggle: Light vs Dark */}
            <div 
              className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-2xs shrink-0"
              title={`Active theme: ${theme === 'light' ? 'Light Theme' : 'Dark Theme'}. Click to toggle.`}
            >
              <button
                type="button"
                onClick={() => {
                  if (onSetTheme) onSetTheme('light');
                  else onToggleTheme();
                }}
                className={`flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  theme === 'light'
                    ? 'bg-white text-slate-950 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Switch to Light theme"
                aria-label="Light theme"
              >
                <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500 fill-amber-500' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">Light</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onSetTheme) onSetTheme('dark');
                  else onToggleTheme();
                }}
                className={`flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Switch to Dark theme"
                aria-label="Dark theme"
              >
                <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-blue-400 fill-blue-400' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">Dark</span>
              </button>
            </div>

            {/* Settings Shortcut */}
            <button
              onClick={() => onNavigate('settings')}
              className="p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 transition-colors shrink-0"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Optional Google Auth */}
            <AuthButton variant="desktop" />
          </div>

          {/* Right: Hamburger Menu Button for Narrow Screens (< 1280px) */}
          <div className="xl:hidden flex items-center">
            <button
              ref={hamburgerTriggerRef}
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-drawer"
              className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Portal to document.body) */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeView={activeView}
        onNavigate={onNavigate}
        userProfile={userProfile}
        progressSummary={progressSummary}
        onToggleHarshCritique={onToggleHarshCritique}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onSetTheme={onSetTheme}
        navLinks={navLinks}
        triggerRef={hamburgerTriggerRef}
      />
    </>
  );
};
