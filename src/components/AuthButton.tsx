import React, { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthButtonProps {
  variant?: 'desktop' | 'mobile';
  onOpenAuth?: (mode: 'signup' | 'login') => void;
  onSignOut?: () => void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  variant = 'desktop',
  onOpenAuth,
  onSignOut,
}) => {
  const { user, displayName, email, loading, isConfigured, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        avatarButtonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleSignOutClick = async () => {
    setIsDropdownOpen(false);
    if (onSignOut) {
      onSignOut();
    } else {
      await signOut();
    }
  };

  // If Supabase is not configured via env vars, render nothing
  if (!isConfigured) {
    return null;
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${variant === 'mobile' ? 'w-full justify-center p-3' : 'px-2 py-1'}`}>
        <div className="w-3.5 h-3.5 border-2 border-slate-300 dark:border-slate-600 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const initial = (displayName || email || 'P').charAt(0).toUpperCase();

  if (user) {
    if (variant === 'mobile') {
      return (
        <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {displayName || 'Practitioner'}
              </div>
              <div
                className="text-xs text-slate-500 dark:text-slate-400 truncate"
                title={email}
              >
                {email}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOutClick}
            className="w-full min-h-[44px] px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-950 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      );
    }

    // Desktop variant: 32px round avatar button + 240px wide dropdown
    return (
      <div className="relative shrink-0">
        <button
          ref={avatarButtonRef}
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          aria-expanded={isDropdownOpen}
          aria-haspopup="menu"
          aria-label={`Account menu for ${displayName || email}`}
          className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-xs transition-transform active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 cursor-pointer"
        >
          {initial}
        </button>

        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            role="menu"
            aria-orientation="vertical"
            className="absolute right-0 mt-2 w-60 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-xl p-3 space-y-3 z-50 transition-colors animate-fadeIn"
          >
            <div className="space-y-0.5 border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {displayName || 'Practitioner'}
              </div>
              <div
                className="text-xs text-slate-500 dark:text-slate-400 truncate"
                title={email}
              >
                {email}
              </div>
            </div>

            <button
              type="button"
              role="menuitem"
              onClick={handleSignOutClick}
              className="w-full min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-2 text-left"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Signed out state: Quiet "Log in" text link
  if (variant === 'mobile') {
    return (
      <div className="pt-2">
        <button
          type="button"
          onClick={() => onOpenAuth?.('login')}
          className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-300 dark:border-slate-800"
        >
          <span>Log in</span>
        </button>
      </div>
    );
  }

  // Desktop signed out state
  return (
    <button
      type="button"
      onClick={() => onOpenAuth?.('login')}
      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
    >
      Log in
    </button>
  );
};
