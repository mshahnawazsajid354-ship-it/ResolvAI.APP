import React, { useState } from 'react';
import { UserProfile, CommunicationGoal } from '../types';
import { 
  Settings, 
  Save, 
  Trash2, 
  Download, 
  Upload, 
  Flame, 
  Gem, 
  Key,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

interface SettingsViewProps {
  userProfile: UserProfile;
  productName: string;
  onUpdateProductName: (name: string) => void;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
  onOpenPersonaModal: () => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
  onResetAllData: () => void;
  theme?: 'light' | 'dark';
  onSetTheme?: (theme: 'light' | 'dark') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userProfile,
  productName,
  onUpdateProductName,
  onUpdateProfile,
  onExportData,
  onImportData,
  onResetAllData,
  theme = 'light',
  onSetTheme,
}) => {
  const [name, setName] = useState(userProfile.displayName);
  const [prodName, setProdName] = useState(productName);
  const [sessionMins, setSessionMins] = useState(userProfile.preferences.sessionLengthMinutes || 10);
  const [directCritique, setDirectCritique] = useState(userProfile.preferences.directCritiqueMode ?? false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleSave = () => {
    onUpdateProductName(prodName.trim() || 'ResolvAI');
    onUpdateProfile({
      displayName: name.trim() || 'Practitioner',
      preferences: {
        ...userProfile.preferences,
        sessionLengthMinutes: sessionMins,
        directCritiqueMode: directCritique,
      },
    });

    setSavedMsg('Settings saved successfully');
    setTimeout(() => setSavedMsg(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Customize your practice preferences, display name, and AI provider configurations.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-sm p-6 space-y-6 transition-colors">
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:focus:border-blue-500 font-medium"
          />
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Product Title (Customizable)
          </label>
          <input
            type="text"
            value={prodName}
            onChange={(e) => setProdName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:focus:border-blue-500 font-medium"
          />
        </div>

        {/* Interface Theme Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Interface Theme
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onSetTheme && onSetTheme('light')}
              className={`p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between sm:justify-center gap-2 cursor-pointer ${
                theme === 'light'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-600/20 shadow-xs'
                  : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-amber-500 fill-amber-500' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>Light Theme</span>
              </div>
              {theme === 'light' && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>}
            </button>
            <button
              type="button"
              onClick={() => onSetTheme && onSetTheme('dark')}
              className={`p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between sm:justify-center gap-2 cursor-pointer ${
                theme === 'dark'
                  ? 'border-blue-600 bg-slate-800 text-white font-bold ring-2 ring-blue-600/20 shadow-xs'
                  : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400 fill-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>Dark Theme</span>
              </div>
              {theme === 'dark' && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>}
            </button>
          </div>
        </div>

        {/* Practice Time */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Daily Practice Time
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {[5, 10, 15, 20].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSessionMins(m)}
                className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                  sessionMins === m
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300'
                    : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                {m} min
              </button>
            ))}
          </div>
        </div>

        {/* Direct Critique Toggle Card */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Default Feedback Style
          </label>
          <div
            onClick={() => setDirectCritique(!directCritique)}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
              directCritique
                ? 'border-rose-300 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200'
                : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-400 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                directCritique ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}>
                {directCritique ? <Flame className="w-4 h-4" /> : <Gem className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {directCritique ? 'Direct critique' : 'Coaching'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {directCritique 
                    ? 'Direct critique is direct and demanding. It is honest, never personal.' 
                    : 'Supportive, encouraging communication feedback'}
                </div>
              </div>
            </div>

            <div
              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                directCritique ? 'bg-rose-600 justify-end' : 'bg-slate-300 dark:bg-slate-800 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex items-center justify-between">
          {savedMsg ? (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">✓ {savedMsg}</span>
          ) : <span />}

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 p-6 flex items-center justify-between transition-colors">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Reset to Day 0</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">Clears all saved attempts, scores, and reflections to start fresh from 0.</p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset all practice progress and restart fresh from Day 1 (0 days completed)?')) {
              onResetAllData();
            }
          }}
          className="px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold transition-colors"
        >
          Reset all data
        </button>
      </div>
    </div>
  );
};
