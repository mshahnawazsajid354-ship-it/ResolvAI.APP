import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthButtonProps {
  variant?: 'desktop' | 'mobile';
}

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const AuthButton: React.FC<AuthButtonProps> = ({ variant = 'desktop' }) => {
  const { user, loading, isConfigured, signInWithGoogle, signOut } = useAuth();

  // If Supabase is not configured via env vars, render nothing
  if (!isConfigured) {
    return null;
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${variant === 'mobile' ? 'w-full justify-center p-3' : 'px-3 py-1.5'}`}>
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

    // Desktop variant
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

  // Signed out state
  if (variant === 'mobile') {
    return (
      <div className="space-y-1.5 pt-2">
        <button
          type="button"
          onClick={signInWithGoogle}
          className="w-full min-h-[44px] flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
        >
          <GoogleIcon className="w-4 h-4 shrink-0" />
          <span>Sign in with Google</span>
        </button>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed px-1">
          We save your email to keep your progress. We never sell it.
        </p>
      </div>
    );
  }

  // Desktop signed out state
  return (
    <div className="flex flex-col items-end gap-0.5 shrink-0">
      <button
        type="button"
        onClick={signInWithGoogle}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs shrink-0"
      >
        <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
        <span>Sign in with Google</span>
      </button>
      <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
        We save your email to keep your progress. We never sell it.
      </span>
    </div>
  );
};
