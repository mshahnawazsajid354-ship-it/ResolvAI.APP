import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { X, Flame, Sun, Moon, Settings } from 'lucide-react';
import { ActiveView, UserProfile, ProgressSummary } from '../types';
import { Logo } from './Logo';
import { AuthButton } from './AuthButton';

export const HAMBURGER_SIDE: 'right' | 'left' = 'right';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenAuth?: (mode: 'signup' | 'login') => void;
  userProfile: UserProfile;
  progressSummary: ProgressSummary;
  onToggleHarshCritique: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSetTheme?: (theme: 'light' | 'dark') => void;
  navLinks: { view: ActiveView; label: string; icon: React.ReactNode }[];
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  activeView,
  onNavigate,
  onOpenAuth,
  userProfile,
  progressSummary,
  onToggleHarshCritique,
  theme,
  onToggleTheme,
  onSetTheme,
  navLinks,
  triggerRef,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isHarsh = userProfile.preferences.directCritiqueMode;
  const shouldReduceMotion = useReducedMotion();

  // 1. Body scroll lock with absolute cleanup on close and unmount
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isOpen]);

  // 2. Auto-close when window width reaches desktop breakpoint (1280px = xl)
  useEffect(() => {
    if (!isOpen) return;

    const mediaQuery = window.matchMedia('(min-width: 1280px)');
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        onClose();
      }
    };

    if (mediaQuery.matches) {
      onClose();
      return;
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
      return () => mediaQuery.removeListener(handleMediaChange);
    }
  }, [isOpen, onClose]);

  // 3. Focus trap and Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    // Move initial focus to the close button
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      // Return focus to hamburger button upon closing
      triggerRef?.current?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  // Framer Motion animation configuration
  const slideDistance = HAMBURGER_SIDE === 'right' ? '100%' : '-100%';

  const drawerVariants: Variants = {
    closed: {
      x: shouldReduceMotion ? 0 : slideDistance,
      opacity: shouldReduceMotion ? 0 : 1,
      transition: { duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeInOut' },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeOut' },
    },
  };

  const backdropVariants: Variants = {
    closed: { opacity: 0, transition: { duration: 0.2 } },
    open: { opacity: 1, transition: { duration: 0.2 } },
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          id="mobile-drawer-portal"
          className="fixed inset-0 z-[45] flex pointer-events-auto"
          role="none"
        >
          {/* Dim Backdrop Overlay */}
          <motion.div
            key="mobile-drawer-backdrop"
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Side Drawer Panel */}
          <motion.aside
            key="mobile-drawer-panel"
            ref={drawerRef}
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants}
            className={`fixed top-0 bottom-0 ${
              HAMBURGER_SIDE === 'right' ? 'end-0' : 'start-0'
            } w-[min(88vw,360px)] h-[100dvh] max-h-screen bg-white dark:bg-slate-950 border-s border-slate-300 dark:border-slate-800 shadow-2xl flex flex-col z-[46] text-slate-900 dark:text-slate-100 select-none overflow-hidden`}
            style={{
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              paddingRight: 'env(safe-area-inset-right, 0px)',
              paddingLeft: 'env(safe-area-inset-left, 0px)',
            }}
          >
            {/* Top Bar inside Drawer: Logo, Badge (if screen < 360px) & Close Button */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-slate-300 dark:border-slate-800/90 shrink-0">
              <div className="flex items-center gap-2">
                <span className="dark:hidden">
                  <Logo variant="horizontal" onDark={false} />
                </span>
                <span className="hidden dark:inline">
                  <Logo variant="horizontal" onDark={true} />
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700 select-none">
                  Beta prototype
                </span>
              </div>

              {/* Close Button: 44x44px minimum tap target */}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Drawer Body with smooth kinetic scrolling */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 space-y-6">
              {/* Primary Navigation Links */}
              <div>
                <p className="px-2 text-[11px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Navigation
                </p>
                <nav className="space-y-1">
                  {navLinks.map((item) => {
                    const isActive =
                      activeView === item.view ||
                      (activeView === 'practice' && item.view === 'dashboard');
                    return (
                      <button
                        key={item.view}
                        type="button"
                        onClick={() => {
                          onNavigate(item.view);
                          onClose();
                        }}
                        className={`w-full min-h-[48px] px-3.5 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 text-start focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold shadow-2xs'
                            : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-900'
                        }`}
                      >
                        <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                          {item.icon}
                        </span>
                        <span className="flex-1">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Mode & Practice Settings */}
              <div className="border-t border-slate-300 dark:border-slate-800/80 pt-4">
                <p className="px-2 text-[11px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Practice Mode & Feedback
                </p>

                {/* Direct Critique Quick Toggle Row (min 48px) */}
                <button
                  type="button"
                  onClick={onToggleHarshCritique}
                  title={
                    isHarsh
                      ? 'Direct critique active: blunt, no-softening feedback'
                      : 'Constructive coaching active: click to switch to Direct critique'
                  }
                  className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border focus:outline-hidden focus:ring-2 focus:ring-rose-500 ${
                    isHarsh
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${isHarsh ? 'bg-rose-100 dark:bg-rose-900/60' : 'bg-slate-100 dark:bg-slate-800'}`}>
                      <Flame className={`w-4 h-4 ${isHarsh ? 'text-rose-600 fill-rose-600' : 'text-slate-500'}`} />
                    </div>
                    <div className="text-start">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {isHarsh ? 'Direct critique' : 'Coaching mode'}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400">
                        {isHarsh ? 'Blunt, unvarnished critique' : 'Encouraging, structured feedback'}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${isHarsh ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                    {isHarsh ? 'Hard' : 'Standard'}
                  </span>
                </button>
              </div>

              {/* Progress & Stats */}
              <div className="border-t border-slate-300 dark:border-slate-800/80 pt-4">
                <p className="px-2 text-[11px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Consistency
                </p>

                {/* Streak Indicator Row */}
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-3.5 py-2.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold text-base">🔥</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Practice streak</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">{progressSummary.currentStreak}</span>
                    <span className="text-slate-600 dark:text-slate-400 text-xs">days</span>
                  </div>
                </div>
              </div>

              {/* Preferences & Appearance */}
              <div className="border-t border-slate-300 dark:border-slate-800/80 pt-4">
                <p className="px-2 text-[11px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Appearance & Settings
                </p>

                {/* Segmented Theme Switcher */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-400">Theme</span>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-300 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSetTheme) onSetTheme('light');
                        else onToggleTheme();
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        theme === 'light'
                          ? 'bg-white text-slate-950 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500 fill-amber-500' : 'text-slate-500'}`} />
                      <span>Light</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onSetTheme) onSetTheme('dark');
                        else onToggleTheme();
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-800 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-blue-400 fill-blue-400' : 'text-slate-500'}`} />
                      <span>Dark</span>
                    </button>
                  </div>
                </div>

                {/* Settings Shortcut Button */}
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('settings');
                    onClose();
                  }}
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Open Settings</span>
                  </div>
                  <span className="text-slate-500">→</span>
                </button>

                {/* Optional Google Auth */}
                <AuthButton
                  variant="mobile"
                  onOpenAuth={(m) => {
                    onClose();
                    onOpenAuth?.(m);
                  }}
                />
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
