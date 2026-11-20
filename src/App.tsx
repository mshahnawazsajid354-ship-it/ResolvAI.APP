import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  PracticeSession, 
  ProgressSummary, 
  Topic, 
  ActiveView, 
  AttemptType 
} from './types';
import { STARTER_CURRICULUM } from './data/curriculum';
import { storageService, DEFAULT_USER_PROFILE } from './services/storage';
import { aiExpertService } from './services/aiExpert';

import { AppNavbar } from './components/AppNavbar';
import { LandingView } from './views/LandingView';
import { OnboardingView } from './views/OnboardingView';
import { AuthScreen } from './components/AuthScreen';
import { DashboardView } from './views/DashboardView';
import { GymView } from './views/GymView';
import { ProgressView } from './views/ProgressView';
import { VaultView } from './views/VaultView';
import { SettingsView } from './views/SettingsView';
import { PracticeStudioView } from './components/PracticeStudioView';
import { EvaluationView } from './components/EvaluationView';
import { DrillModal } from './components/DrillModal';
import { ReflectionModal } from './components/ReflectionModal';
import { AmbientBackground } from './components/AmbientBackground';
import { useAuth } from './context/AuthContext';

export function App() {
  const { user, isConfigured: isAuthConfigured } = useAuth();
  // Application State
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [previousView, setPreviousView] = useState<ActiveView>('landing');
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [productName, setProductName] = useState<string>('ResolvAI');
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [progressSummary, setProgressSummary] = useState<ProgressSummary>(storageService.getProgressSummary());

  // Theme Management (Light / Dark Theme - Light is default)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('resolvai_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'light'; // Always default to clean light theme
    } catch {
      return 'light';
    }
  });

  const applyTheme = (newTheme: 'light' | 'dark') => {
    try {
      localStorage.setItem('resolvai_theme', newTheme);
      const isDark = newTheme === 'dark';
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }
      window.dispatchEvent(new CustomEvent('resolvai_theme_change', { detail: newTheme }));
    } catch (e) {
      console.error('Failed to apply theme:', e);
    }
  };

  useEffect(() => {
    applyTheme(theme);
    (window as any).__setResolvAITheme = (t: 'light' | 'dark') => handleSetTheme(t);
    (window as any).__toggleResolvAITheme = handleToggleTheme;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'resolvai_theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        setTheme(e.newValue);
        applyTheme(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [theme]);

  const handleSetTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    handleSetTheme(next);
  };

  // Automatic routing upon successful sign-in
  useEffect(() => {
    let isPending = false;
    try {
      isPending = sessionStorage.getItem('product_one_auth_pending') === '1';
    } catch {}

    if (user && (activeView === 'auth' || (activeView === 'landing' && isPending))) {
      const profile = storageService.getUserProfile();
      if (profile.onboardingCompleted) {
        setActiveView('dashboard');
      } else {
        setActiveView('onboarding');
      }
      try {
        sessionStorage.removeItem('product_one_auth_pending');
      } catch {}
    }
  }, [user, activeView]);

  const handleOpenAuth = (mode: 'signup' | 'login') => {
    setAuthMode(mode);
    setPreviousView(activeView);
    setActiveView('auth');
  };

  const handleStartTrainingFromLanding = () => {
    const isSkipped = localStorage.getItem('product_one_auth_skipped') === 'true';
    const profile = storageService.getUserProfile();
    const hasProfile = profile.onboardingCompleted || (profile.displayName && profile.displayName !== 'Practitioner');

    if (!isAuthConfigured || user || isSkipped || hasProfile) {
      if (profile.onboardingCompleted) {
        setActiveView('dashboard');
      } else {
        setActiveView('onboarding');
      }
      return;
    }

    handleOpenAuth('signup');
  };

  const handleSkipAuth = () => {
    try {
      localStorage.setItem('product_one_auth_skipped', 'true');
    } catch {}
    const profile = storageService.getUserProfile();
    if (profile.onboardingCompleted) {
      setActiveView('dashboard');
    } else {
      setActiveView('onboarding');
    }
  };

  const handleBackFromAuth = () => {
    setActiveView(previousView === 'auth' ? 'landing' : previousView);
  };

  // Practice & Evaluation Context
  const [activeTopic, setActiveTopic] = useState<Topic>(STARTER_CURRICULUM[0]);
  const [activeSession, setActiveSession] = useState<PracticeSession | null>(null);
  const [attemptType, setAttemptType] = useState<AttemptType>('original');
  const [currentAttemptNumber, setCurrentAttemptNumber] = useState<number>(1);
  const [isPracticingInStudio, setIsPracticingInStudio] = useState<boolean>(false);
  const [isEvaluationLoading, setIsEvaluationLoading] = useState(false);
  const [draftContent, setDraftContent] = useState<string>('');

  // Modals
  const [isDrillModalOpen, setIsDrillModalOpen] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);

  // Initialize and load saved data
  useEffect(() => {
    // Check if user requested URL-based hard reset (?reset=true or ?reset=1)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('reset') === 'true' || urlParams.get('reset') === '1') {
        storageService.clearAllData();
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch {}

    const profile = storageService.getUserProfile();
    const allSessions = storageService.getAllSessions();
    const summary = storageService.getProgressSummary();

    setUserProfile(profile);
    setSessions(allSessions);
    setProgressSummary(summary);

    (window as any).__resetAllData = handleResetAllData;

    const savedName = localStorage.getItem('product_one_app_title');
    if (savedName && savedName !== 'Gym for Communication') {
      setProductName(savedName);
    } else {
      setProductName('ResolvAI');
      localStorage.setItem('product_one_app_title', 'ResolvAI');
    }

    // If user already completed onboarding, restore active practice session if previously active
    if (profile.onboardingCompleted) {
      try {
        const lastTopicId = localStorage.getItem('product_one_active_topic_id');
        const lastView = localStorage.getItem('product_one_active_view');
        if (lastTopicId && lastView === 'practice') {
          const matchedTopic = STARTER_CURRICULUM.find(t => t.id === lastTopicId);
          if (matchedTopic) {
            const matchedSession = storageService.getSessionByTopicId(matchedTopic.id);
            if (matchedSession) {
              setActiveTopic(matchedTopic);
              setActiveSession(matchedSession);
              setIsPracticingInStudio(false);
              const maxNum = matchedSession.attempts && matchedSession.attempts.length > 0 
                ? Math.max(...matchedSession.attempts.map(a => a.attemptNumber || 1))
                : 1;
              setCurrentAttemptNumber(maxNum);
              setActiveView('practice');
              return;
            }
          }
        }
      } catch {}
      setActiveView('dashboard');
    } else {
      setActiveView('landing');
    }
  }, []);

  const refreshAppState = () => {
    const profile = storageService.getUserProfile();
    const allSessions = storageService.getAllSessions();
    const summary = storageService.getProgressSummary();
    setUserProfile(profile);
    setSessions(allSessions);
    setProgressSummary(summary);
  };

  // ================= ONBOARDING ACTIONS =================
  const handleCompleteOnboarding = (profileUpdates: Partial<UserProfile>) => {
    const updated = storageService.saveUserProfile(profileUpdates);
    setUserProfile(updated);
    refreshAppState();
    setActiveView('dashboard');
    localStorage.setItem('product_one_active_view', 'dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ================= NAVIGATION =================
  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    localStorage.setItem('product_one_active_view', view);
    if (view === 'dashboard') {
      localStorage.removeItem('product_one_active_topic_id');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ================= PRACTICE WORKFLOW =================
  const handleStartPractice = (topic: Topic) => {
    setActiveTopic(topic);
    setAttemptType('original');
    localStorage.setItem('product_one_active_topic_id', topic.id);
    localStorage.setItem('product_one_active_view', 'practice');

    let session = storageService.getSessionByTopicId(topic.id);
    if (!session) {
      session = storageService.createSession(topic.id, topic.dayNumber);
      setCurrentAttemptNumber(1);
      setIsPracticingInStudio(true);
    } else {
      const hasEvaluated = session.originalAttempt && session.originalAttempt.evaluation;
      if (hasEvaluated) {
        setIsPracticingInStudio(false);
        const maxNum = session.attempts && session.attempts.length > 0 
          ? Math.max(...session.attempts.map(a => a.attemptNumber || 1))
          : 1;
        setCurrentAttemptNumber(maxNum);
      } else {
        setIsPracticingInStudio(true);
        setCurrentAttemptNumber(1);
      }
    }
    setActiveSession(session);

    const draft = storageService.getDraft(topic.id);
    setDraftContent(draft || '');
    setActiveView('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartRevision = (targetNum?: number, initialDraft?: string) => {
    if (!activeSession) return;
    const nextNum = targetNum || (activeSession.attempts ? activeSession.attempts.length + 1 : 2);
    const clampedNum = Math.min(3, Math.max(1, nextNum)) as 1 | 2 | 3;
    setCurrentAttemptNumber(clampedNum);
    setAttemptType(clampedNum === 3 ? 'attempt-3' : 'revised');

    // Blank response box for every new attempt - do not recall previous input
    setDraftContent(initialDraft || '');
    setIsPracticingInStudio(true);
    setActiveView('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ================= SUBMISSION =================
  const handleSubmitAttempt = async (content: string, preRating: number, isHarsh: boolean) => {
    if (!activeTopic || !activeSession) return;
    setIsEvaluationLoading(true);

    try {
      const attemptNum = (currentAttemptNumber || 1) as 1 | 2 | 3;
      const evaluation = await aiExpertService.evaluateAttempt({
        topic: activeTopic,
        userResponse: content,
        attemptType,
        userProfile,
        isHarshCritique: isHarsh,
      });

      const updatedSession = storageService.saveSessionAttempt(
        activeSession.id,
        content,
        evaluation,
        attemptNum,
        preRating,
        evaluation.aiImprovedVersion
      );

      // Lock current attempt number in localStorage so refresh never loses selection
      localStorage.setItem(`product_one_selected_attempt_${activeSession.id}`, attemptNum.toString());

      setActiveSession(updatedSession);
      setDraftContent(''); // Clear draft content for fresh subsequent attempts
      setIsPracticingInStudio(false);
      refreshAppState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      alert(err.message || 'Evaluation could not be processed.');
    } finally {
      setIsEvaluationLoading(false);
    }
  };

  const handleCompleteSession = (sessionId: string) => {
    const updated = storageService.markSessionComplete(sessionId);
    setActiveSession(updated);
    refreshAppState();
    handleNavigate('dashboard');
  };

  const handleSaveDraft = (content: string) => {
    if (activeTopic) {
      storageService.saveDraft(activeTopic.id, content);
    }
  };

  // ================= DRILLS & REFLECTIONS =================
  const handleSaveDrill = (userResponse: string) => {
    if (!activeSession || !activeTopic) return;
    const drillResult = {
      id: `drill_${Date.now()}`,
      drillConfig: activeTopic.suggestedDrill,
      userResponse,
      completedAt: new Date().toISOString(),
    };
    const updated = storageService.saveDrillResult(activeSession.id, drillResult);
    setActiveSession(updated);
    refreshAppState();
  };

  const handleSaveReflection = (data: {
    whatWentWell: string;
    whatWasDifficult: string;
    oneThingToChange: string;
    whatToPractiseNext: string;
  }) => {
    if (!activeSession) return;
    const updated = storageService.saveReflection(activeSession.id, data);
    setActiveSession(updated);
    refreshAppState();
    setIsReflectionModalOpen(false);
    setActiveView('vault');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReopenSession = (session: PracticeSession) => {
    const topic = STARTER_CURRICULUM.find((t) => t.id === session.topicId) || STARTER_CURRICULUM[0];
    setActiveTopic(topic);
    setActiveSession(session);
    setIsPracticingInStudio(false);
    const maxNum = session.attempts && session.attempts.length > 0
      ? Math.max(...session.attempts.map(a => a.attemptNumber || 1))
      : 1;
    setCurrentAttemptNumber(maxNum);
    setActiveView('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ================= SETTINGS =================
  const handleUpdateProductName = (name: string) => {
    setProductName(name);
    localStorage.setItem('product_one_app_title', name);
  };

  const handleUpdateProfile = (profile: Partial<UserProfile>) => {
    const updated = storageService.saveUserProfile(profile);
    setUserProfile(updated);
    refreshAppState();
  };

  const handleToggleHarshCritique = () => {
    const current = userProfile.preferences.directCritiqueMode;
    const updated = storageService.saveUserProfile({
      preferences: {
        ...userProfile.preferences,
        directCritiqueMode: !current,
      },
    });
    setUserProfile(updated);
    refreshAppState();
  };

  const handleExportJSON = () => {
    const json = storageService.exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gym-practice-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (jsonStr: string) => {
    const res = storageService.importData(jsonStr);
    alert(res.message);
    if (res.success) {
      refreshAppState();
    }
  };

  const handleResetAllData = () => {
    storageService.clearAllData();
    setUserProfile(DEFAULT_USER_PROFILE);
    setSessions([]);
    setProgressSummary(storageService.getProgressSummary());
    setActiveSession(null);
    setDraftContent('');
    setCurrentAttemptNumber(1);
    setActiveTopic(STARTER_CURRICULUM[0]);
    setIsPracticingInStudio(false);
    setActiveView('landing');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-150 relative overflow-x-hidden">
      {/* Dynamic Cursor Reactive Ambient Background */}
      <AmbientBackground theme={theme} />

      {/* Main Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* 1. Landing View (Full Screen) */}
        {activeView === 'landing' && (
          <LandingView
            onStartTraining={handleStartTrainingFromLanding}
            onEnterGym={() => setActiveView('dashboard')}
            onOpenAuth={handleOpenAuth}
            hasExistingSession={sessions.length > 0}
            productName={productName}
            theme={theme}
            onSetTheme={handleSetTheme}
            onToggleTheme={handleToggleTheme}
            isAuthConfigured={isAuthConfigured}
            isSignedIn={Boolean(user)}
          />
        )}

        {/* 1b. Authentication View (Sign Up / Log In) */}
        {activeView === 'auth' && (
          <AuthScreen
            mode={authMode}
            onSwitchMode={(m) => setAuthMode(m)}
            onSkip={handleSkipAuth}
            onBack={handleBackFromAuth}
            theme={theme}
          />
        )}

      {/* 2. Onboarding Flow (Full Screen) */}
      {activeView === 'onboarding' && (
        <OnboardingView
          onComplete={handleCompleteOnboarding}
          onBackToLanding={() => setActiveView('landing')}
          initialProfile={userProfile}
          theme={theme}
          onSetTheme={handleSetTheme}
          onToggleTheme={handleToggleTheme}
        />
      )}

      {/* 3. Core App Experience with Top Navbar */}
      {activeView !== 'landing' && activeView !== 'onboarding' && activeView !== 'auth' && (
        <>
          <AppNavbar
            activeView={activeView}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
            productName={productName}
            userProfile={userProfile}
            progressSummary={progressSummary}
            onToggleHarshCritique={handleToggleHarshCritique}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onSetTheme={handleSetTheme}
          />

          <main className="flex-1 w-full px-4 sm:px-6 pb-20 md:pb-12">
            {activeView === 'dashboard' && (
              <DashboardView
                userProfile={userProfile}
                progressSummary={progressSummary}
                topics={STARTER_CURRICULUM}
                recentSessions={sessions}
                onStartPractice={handleStartPractice}
                onNavigateToGym={() => handleNavigate('gym')}
                onNavigateToProgress={() => handleNavigate('progress')}
                onNavigateToVault={() => handleNavigate('vault')}
                onReopenSession={handleReopenSession}
              />
            )}

            {activeView === 'gym' && (
              <GymView
                topics={STARTER_CURRICULUM}
                sessions={sessions}
                onSelectTopic={handleStartPractice}
                onReviewSession={handleReopenSession}
              />
            )}

            {activeView === 'practice' && activeTopic && (
              !isPracticingInStudio && activeSession && activeSession.originalAttempt && activeSession.originalAttempt.evaluation ? (
                <EvaluationView
                  session={activeSession}
                  topic={activeTopic}
                  userProfile={userProfile}
                  onStartRevision={handleStartRevision}
                  onNavigateToProgress={() => handleNavigate('progress')}
                  onOpenDrill={() => setIsDrillModalOpen(true)}
                  onOpenReflection={() => setIsReflectionModalOpen(true)}
                  onReturnToGym={() => handleNavigate('gym')}
                  onCompleteDay={handleCompleteSession}
                />
              ) : (
                <PracticeStudioView
                  topic={activeTopic}
                  userProfile={userProfile}
                  initialContent={draftContent}
                  attemptType={attemptType}
                  attemptNumber={currentAttemptNumber}
                  originalAttempt={activeSession?.originalAttempt}
                  onSubmit={handleSubmitAttempt}
                  onSaveDraft={handleSaveDraft}
                  isLoading={isEvaluationLoading}
                  onBackToGym={() => handleNavigate('gym')}
                  theme={theme}
                  onSetTheme={handleSetTheme}
                />
              )
            )}

            {activeView === 'progress' && (
              <ProgressView
                progressSummary={progressSummary}
                sessions={sessions}
                topics={STARTER_CURRICULUM}
                onStartPractice={handleStartPractice}
                onReviewSession={handleReopenSession}
              />
            )}

            {activeView === 'vault' && (
              <VaultView
                sessions={sessions}
                topics={STARTER_CURRICULUM}
                onOpenSession={handleReopenSession}
                onExportJSON={handleExportJSON}
              />
            )}

            {activeView === 'settings' && (
              <SettingsView
                userProfile={userProfile}
                productName={productName}
                onUpdateProductName={handleUpdateProductName}
                onUpdateProfile={handleUpdateProfile}
                onOpenPersonaModal={() => {}}
                onExportData={handleExportJSON}
                onImportData={handleImportJSON}
                onResetAllData={handleResetAllData}
                theme={theme}
                onSetTheme={handleSetTheme}
              />
            )}
          </main>
        </>
      )}

      {/* Modals */}
      {activeTopic && (
        <DrillModal
          isOpen={isDrillModalOpen}
          drillConfig={activeTopic.suggestedDrill}
          initialResult={activeSession?.drillResult}
          onSaveDrill={handleSaveDrill}
          onClose={() => setIsDrillModalOpen(false)}
        />
      )}

      <ReflectionModal
        isOpen={isReflectionModalOpen}
        initialReflection={activeSession?.reflection}
        onSaveReflection={handleSaveReflection}
        onSkip={() => {
          setIsReflectionModalOpen(false);
          setActiveView('vault');
        }}
        onClose={() => setIsReflectionModalOpen(false)}
      />
      </div>
    </div>
  );
}
