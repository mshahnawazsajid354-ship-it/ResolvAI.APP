import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Mic, 
  MicOff, 
  Flame, 
  Clock, 
  BookOpen, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Save,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { Topic, UserProfile, Attempt, AttemptType } from '../types';
import { speechService } from '../services/speech';

interface PracticeStudioViewProps {
  topic: Topic;
  userProfile: UserProfile;
  initialContent?: string;
  attemptType: AttemptType;
  attemptNumber?: number;
  originalAttempt?: Attempt;
  onSubmit: (content: string, preRating: number, isHarsh: boolean) => void;
  onSaveDraft: (content: string) => void;
  onOpenPersonaModal?: () => void;
  isLoading: boolean;
  onBackToGym: () => void;
  theme?: 'light' | 'dark';
  onSetTheme?: (theme: 'light' | 'dark') => void;
}

export const PracticeStudioView: React.FC<PracticeStudioViewProps> = ({
  topic,
  userProfile,
  initialContent = '',
  attemptType,
  attemptNumber = 1,
  originalAttempt,
  onSubmit,
  onSaveDraft,
  isLoading,
  onBackToGym,
  theme = 'light',
  onSetTheme,
}) => {
  const [content, setContent] = useState(initialContent);
  const [preRating, setPreRating] = useState<number>(userProfile.preferences.initialConfidenceRating || 6);
  const [isHarsh, setIsHarsh] = useState<boolean>(userProfile.preferences.directCritiqueMode ?? false);
  const [showGuidelines, setShowGuidelines] = useState<boolean>(false);
  const [draftSavedMsg, setDraftSavedMsg] = useState<string | null>(null);

  // Speech to Text
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const isSpeechSupported = speechService.getIsSupported();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const baseContentRef = useRef<string>('');

  // Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(300); // 5 min default
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timerSeconds]);

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const chars = content.length;

  const handleSaveDraft = () => {
    onSaveDraft(content);
    setDraftSavedMsg('Draft saved');
    setTimeout(() => setDraftSavedMsg(null), 2500);
  };

  const handleToggleSpeech = async () => {
    if (!isSpeechSupported) {
      if (textareaRef.current) textareaRef.current.focus();
      setSpeechError('Voice dictation works in Chrome or Edge. You can still type.');
      return;
    }

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      baseContentRef.current = content;
    } else {
      setSpeechError(null);
      baseContentRef.current = content;
      if (textareaRef.current) textareaRef.current.focus();

      const started = await speechService.startListening(
        (interim, final) => {
          const base = baseContentRef.current.trim();
          const spoken = final.trim();
          const activeInterim = interim.trim();

          let textToSet = base;
          if (spoken) {
            textToSet = textToSet ? `${textToSet} ${spoken}` : spoken;
          }
          if (activeInterim) {
            textToSet = textToSet ? `${textToSet} ${activeInterim}` : activeInterim;
          }
          setContent(textToSet);
        },
        (errMsg) => {
          setSpeechError(errMsg);
          setIsListening(false);
          baseContentRef.current = content;
        },
        (listening) => {
          setIsListening(listening);
          if (!listening) {
            baseContentRef.current = content;
          }
        }
      );
      if (started) {
        setIsListening(true);
      }
    }
  };

  const handleSubmit = () => {
    if (words < 5) {
      alert('Please compose at least a couple of sentences to receive meaningful feedback.');
      return;
    }
    if (isListening) speechService.stopListening();
    onSubmit(content, preRating, isHarsh);
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format stage label e.g., "Stage A · Foundations"
  const stageParts = topic.stageTitle.split(':');
  const stageCode = stageParts[0] || 'Stage A';
  const stageSub = stageParts[1]?.trim()?.split('&')[0]?.trim() || 'Foundations';
  const stageLabel = `${stageCode} · ${stageSub}`;

  // Guideline label: "G.A.I.N. GUIDELINE" or custom
  const guidelineHeaderTitle = topic.guidelines.type === 'GAIN' 
    ? 'G.A.I.N. GUIDELINE' 
    : (topic.guidelines.title ? `${topic.guidelines.title.toUpperCase()}` : 'GUIDELINE');

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. Top Minimal Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBackToGym}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors group py-1"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Topic ladder</span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {/* Segmented Theme Switcher */}
          {onSetTheme && (
            <div 
              className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-2xs shrink-0"
              title={`Current theme: ${theme === 'light' ? 'Light' : 'Dark'}. Click to switch.`}
            >
              <button
                type="button"
                onClick={() => onSetTheme('light')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  theme === 'light'
                    ? 'bg-white text-slate-950 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Switch to Light theme"
              >
                <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500 fill-amber-500' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">Light</span>
              </button>
              <button
                type="button"
                onClick={() => onSetTheme('dark')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Switch to Dark theme"
              >
                <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-blue-400 fill-blue-400' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">Dark</span>
              </button>
            </div>
          )}

          {/* Feedback standard quick toggle */}
          <div className="flex flex-col items-end gap-1">
            <button
              type="button"
              onClick={() => setIsHarsh(!isHarsh)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                isHarsh
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Toggle Direct Critique / Coaching Standard"
            >
              <Flame className={`w-3.5 h-3.5 ${isHarsh ? 'text-rose-600 fill-rose-600' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">{isHarsh ? 'Direct critique' : 'Coaching'}</span>
            </button>
            {isHarsh && (
              <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                Direct critique is direct and demanding. It is honest, never personal.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Metadata row matching reference UI */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
          {/* Stage Pill */}
          <span className="px-3 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/70 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-medium tracking-tight">
            {stageLabel}
          </span>
          
          {/* Day Label */}
          <span className="font-bold text-slate-700 dark:text-slate-300">
            DAY {topic.dayNumber}
          </span>

          {/* Time Estimate */}
          <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{topic.suggestedCompletionMinutes || 5} min</span>
          </span>

          {/* Attempt indicator if multi-attempt */}
          {attemptNumber > 1 && (
            <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-[11px] font-mono font-bold">
              Attempt {attemptNumber} of 3
            </span>
          )}
        </div>

        {/* Big Bold Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {topic.title}
        </h1>

        {/* Prompt Instruction */}
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {topic.instructions}
        </p>

        {/* Objective */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-normal">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Objective:</span> {topic.objective}
        </p>
      </div>

      {/* 3. Sleek Collapsible Guideline Card (Matching reference UI) */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-800/90 rounded-2xl overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => setShowGuidelines(!showGuidelines)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
        >
          <span className="text-xs font-bold text-blue-700 dark:text-blue-400 tracking-wider uppercase font-mono">
            {guidelineHeaderTitle}
          </span>

          <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
            <span>60-150 words</span>
            {showGuidelines ? (
              <ChevronUp className="w-4 h-4 ml-0.5" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-0.5" />
            )}
          </div>
        </button>

        {showGuidelines && (
          <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-200 dark:border-slate-800/70 text-xs">
            {/* Steps grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              {topic.guidelines.steps.map((st, i) => (
                <div 
                  key={i} 
                  className="bg-white dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 space-y-1"
                >
                  <div className="font-bold text-blue-700 dark:text-blue-400">{st.label}</div>
                  <div className="text-slate-600 dark:text-slate-300 leading-relaxed">{st.instruction}</div>
                  {st.example && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-500 italic pt-1 font-mono">
                      {st.example}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Structure Example & Mistake to Avoid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-3.5 rounded-xl space-y-1">
                <span className="font-bold text-blue-900 dark:text-blue-300 block">Structure Example:</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{topic.guidelines.illustrativeExample}"
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-3.5 rounded-xl space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-300 block">Mistake to Avoid:</span>
                <p className="text-amber-950 dark:text-amber-200 leading-relaxed">
                  {topic.guidelines.commonMistakeToAvoid}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Sleek Response Card (Matching reference UI) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-none space-y-4 transition-colors">
        {/* Card Header: "Your response" & word counter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <label className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Your response
            </label>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
              Speak or write
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-200">{words} words</span>
            <span>·</span>
            <span>target 60-150</span>
          </div>
        </div>

        {/* Text Area Canvas */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Speak using Voice dictation above or type your response here. Focus on clarity, authentic facts, and structured progression..."
            className="w-full p-4 sm:p-5 rounded-xl border border-slate-400 dark:border-slate-800 focus:outline-hidden focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-600 bg-white dark:bg-slate-950/60 text-sm sm:text-base leading-relaxed transition-all resize-y font-normal"
          />

          {/* Speech error or fallback notification if any */}
          {speechError && (
            <div className="mt-2.5 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5 transition-all">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="font-medium text-slate-800 dark:text-slate-200">{speechError}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Alternative: Click inside the response box and press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300">Win</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300">H</kbd> to use Windows built-in voice typing.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Integrated Workspace Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200 dark:border-slate-800/80">
          {/* Left tools: Speech to text & save draft */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSpeech}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isListening
                  ? 'border-red-300 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 animate-pulse'
                  : 'border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
              title={isSpeechSupported ? 'Click to toggle browser voice dictation' : 'Click for Windows system voice typing guidance'}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  <span>Listening... (click to stop)</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Voice dictation</span>
                </>
              )}
            </button>

            {/* Discreet, non-highlighted Windows native PC dictation indicator */}
            {isSpeechSupported ? (
              <div 
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500 font-normal select-none px-1"
                title="Windows Voice Typing: Click into the text area and press Windows Key + H to dictate using your PC voice engine"
              >
                <span className="text-[11px]">PC shortcut:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-400 font-semibold shadow-2xs">Win</kbd>
                <span className="text-[10px] text-slate-500">+</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-400 font-semibold shadow-2xs">H</kbd>
              </div>
            ) : (
              <span className="text-[11px] text-slate-600 dark:text-slate-400 select-none">
                Voice dictation works in Chrome or Edge. You can still type.
              </span>
            )}

            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
              title="Save current progress"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span>Save draft</span>
            </button>

            {draftSavedMsg && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>{draftSavedMsg}</span>
              </span>
            )}
          </div>

          {/* Right tools: Practice timer */}
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
              title="Click to toggle practice timer"
            >
              {formatTimer(timerSeconds)} ({isTimerRunning ? 'Pause' : 'Start'})
            </button>
          </div>
        </div>

        {/* Privacy Note */}
        <p className="text-[11px] text-slate-500 dark:text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800/60">
          Speech is converted by your browser, your text is sent to an AI service for feedback, audio is never stored.
        </p>
      </div>

      {/* 5. Minimal Readiness / Confidence Rating */}
      <div className="bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-300 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">
            Self-rated readiness before feedback
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400">
            How clearly do you feel you expressed your core thought? (1-10)
          </span>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setPreRating(num)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                preRating === num
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Primary Action Buttons */}
      <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToGym}
          className="py-2.5 sm:py-0 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors text-center"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || words < 5}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span>Analyzing your response...</span>
          ) : (
            <>
              <span>Get AI feedback</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
