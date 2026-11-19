import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthButtonProps {
  variant?: 'desktop' | 'mobile';
  onOpenAuth?: (mode: 'signup' | 'login') => void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  variant = 'desktop',
  onOpenAuth,
}) => {
  const { user, loading, isConfigured, signOut } = useAuth();

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

  if (user) {
    if (variant === 'mobile') {
      return (
        <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate" title={user.email}>
              {user.email}
            </span>
            <button
              type="button"
              onClick={signOut}
              className="px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center gap-1 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      );
    }

    // Desktop variant (Signed in)
    return (
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-2.5 py-1.5 rounded-full text-xs font-medium shrink-0">
        <span className="max-w-[140px] truncate text-slate-700 dark:text-slate-300" title={user.email}>
          {user.email}
        </span>
        <button
          type="button"
          onClick={signOut}
          className="text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-0.5 rounded"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Signed out state: Quiet "Log in" text link (No long microcopy in navbar)
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
